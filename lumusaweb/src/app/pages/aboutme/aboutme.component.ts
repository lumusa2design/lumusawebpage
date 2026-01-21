import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';

type Mode = 'PAINT' | 'VORTEX' | 'BURST';

@Component({
  selector: 'app-aboutme',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aboutme.component.html',
  styleUrls: ['./aboutme.component.css'],
})
export class AboutmeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('glHost', { static: true }) glHost!: ElementRef<HTMLDivElement>;

  // ---- HUD data ----
  mode: Mode = 'PAINT';
  tips = 'Move mouse to paint. Click = burst. Keys: 1 Paint, 2 Vortex, 3 Burst.';
  intensity = 1; // 0.5..2
  paused = false;

  // ---- Three ----
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;

  private frameId: number | null = null;
  private lastT = 0;

  // ---- Interaction ----
  private pointerNDC = new THREE.Vector2(0, 0);
  private pointerWorld = new THREE.Vector3(0, 0, 0);
  private pointerVel = new THREE.Vector3(0, 0, 0);
  private lastPointerWorld = new THREE.Vector3(0, 0, 0);

  private raycaster = new THREE.Raycaster();
  private planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

  private onResize = () => this.resize();
  private onKeyDown = (e: KeyboardEvent) => this.handleKeys(e);

  // ---- Particles (CPU sim + THREE.Points) ----
  private count = 2600;
  private positions!: Float32Array; // xyz
  private velocities!: Float32Array; // xyz
  private life!: Float32Array; // 0..1 (fade)
  private seeds!: Float32Array;

  private geo!: THREE.BufferGeometry;
  private posAttr!: THREE.BufferAttribute;
  private points!: THREE.Points;
  private mat!: THREE.PointsMaterial;

  // ---- Params ----
  private boundsX = 28;
  private boundsY = 16;

  ngAfterViewInit(): void {
    this.initThree();
    window.addEventListener('resize', this.onResize, { passive: true });
    window.addEventListener('keydown', this.onKeyDown);
    this.lastT = performance.now();
    this.animate();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    if (this.frameId) cancelAnimationFrame(this.frameId);

    this.geo?.dispose();
    this.mat?.dispose();
    this.renderer?.dispose();

    const canvas = this.renderer?.domElement;
    if (canvas?.parentElement) canvas.parentElement.removeChild(canvas);
  }

  // =========================
  // Template events
  // =========================
  onPointerMove(ev: PointerEvent): void {
    const rect = this.glHost.nativeElement.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((ev.clientY - rect.top) / rect.height) * 2 - 1);
    this.pointerNDC.set(x, y);

    // Convert to world on plane z=0
    this.raycaster.setFromCamera(this.pointerNDC, this.camera);
    const hit = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(this.planeZ, hit)) {
      this.pointerWorld.copy(hit);
      this.pointerVel.copy(hit).sub(this.lastPointerWorld);
      this.lastPointerWorld.copy(hit);
    }
  }

  onPointerDown(ev: PointerEvent): void {
    // ignore HUD clicks
    const target = ev.target as HTMLElement;
    if (target.closest('.hud')) return;

    if (this.mode === 'BURST') {
      this.burst(this.pointerWorld, 1.6 * this.intensity);
    } else {
      // Always allow a burst on click (feels good)
      this.burst(this.pointerWorld, 1.1 * this.intensity);
    }
  }

  setMode(m: Mode): void {
    this.mode = m;
    if (m === 'PAINT') this.tips = 'Paint mode: move mouse to draw trails. Click = burst.';
    if (m === 'VORTEX') this.tips = 'Vortex mode: particles swirl around your cursor. Click = burst.';
    if (m === 'BURST') this.tips = 'Burst mode: click to explode particles. Move to steer.';
  }

  togglePause(): void {
    this.paused = !this.paused;
  }

  // =========================
  // Keys
  // =========================
  private handleKeys(e: KeyboardEvent): void {
    if (e.key === '1') this.setMode('PAINT');
    if (e.key === '2') this.setMode('VORTEX');
    if (e.key === '3') this.setMode('BURST');
    if (e.key.toLowerCase() === 'p') this.togglePause();
    if (e.key === '+' || e.key === '=') this.intensity = Math.min(2, this.intensity + 0.1);
    if (e.key === '-') this.intensity = Math.max(0.5, this.intensity - 0.1);
  }

  // =========================
  // Three init
  // =========================
  private initThree(): void {
    const host = this.glHost.nativeElement;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 300);
    this.camera.position.set(0, 0, 60);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(this.renderer.domElement);

    // Particles data
    this.positions = new Float32Array(this.count * 3);
    this.velocities = new Float32Array(this.count * 3);
    this.life = new Float32Array(this.count);
    this.seeds = new Float32Array(this.count);

    for (let i = 0; i < this.count; i++) {
      this.resetParticle(i, true);
      this.seeds[i] = Math.random();
    }

    this.geo = new THREE.BufferGeometry();
    this.posAttr = new THREE.BufferAttribute(this.positions, 3);
    this.geo.setAttribute('position', this.posAttr);

    this.mat = new THREE.PointsMaterial({
      size: 0.9,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });

    // Base color: bluish neon
    this.mat.color.setHSL(0.58, 0.85, 0.65);

    this.points = new THREE.Points(this.geo, this.mat);
    this.scene.add(this.points);

    // Subtle stars
    this.scene.add(this.makeStarfield());

    this.resize();
  }

  private resize(): void {
    const host = this.glHost.nativeElement;
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  // =========================
  // Animation loop
  // =========================
  private animate = (): void => {
    const now = performance.now();
    const dt = Math.min(0.033, (now - this.lastT) / 1000);
    this.lastT = now;

    if (!this.paused) {
      this.step(dt);
    }

    // tiny drift
    this.scene.rotation.y += 0.00015;

    this.renderer.render(this.scene, this.camera);
    this.frameId = requestAnimationFrame(this.animate);
  };

  private step(dt: number): void {
    // Cursor influence parameters
    const influence = 22 * this.intensity;
    const damping = 0.985;
    const flow = 0.65 * this.intensity;

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;

      let x = this.positions[i3 + 0];
      let y = this.positions[i3 + 1];
      let z = this.positions[i3 + 2];

      let vx = this.velocities[i3 + 0];
      let vy = this.velocities[i3 + 1];
      let vz = this.velocities[i3 + 2];

      // Life decay
      this.life[i] -= dt * (0.25 + this.seeds[i] * 0.35);
      if (this.life[i] <= 0) {
        this.resetParticle(i, false);
        continue;
      }

      // Cursor vector
      const dx = this.pointerWorld.x - x;
      const dy = this.pointerWorld.y - y;
      const d2 = dx * dx + dy * dy + 0.001;
      const inv = 1 / Math.sqrt(d2);

      // Mode forces
      if (this.mode === 'PAINT') {
        // Follow cursor path + slight attraction
        vx += (this.pointerVel.x * 0.35) * flow;
        vy += (this.pointerVel.y * 0.35) * flow;

        vx += dx * inv * (influence * 0.02) * dt;
        vy += dy * inv * (influence * 0.02) * dt;
      } else if (this.mode === 'VORTEX') {
        // Swirl around cursor
        const swirl = influence * 0.06;
        const tx = -dy * inv;
        const ty = dx * inv;

        vx += tx * swirl * dt;
        vy += ty * swirl * dt;

        // Gentle pull so it stays around
        vx += dx * inv * (influence * 0.01) * dt;
        vy += dy * inv * (influence * 0.01) * dt;
      } else if (this.mode === 'BURST') {
        // Cursor repels and steers
        const repel = influence * 0.08;
        vx += -dx * inv * repel * dt;
        vy += -dy * inv * repel * dt;

        vx += (this.pointerVel.x * 0.15) * dt;
        vy += (this.pointerVel.y * 0.15) * dt;
      }

      // Some "noise" drift
      vx += (Math.sin((nowPhase(this.seeds[i]) + x * 0.2) * 2.0) * 0.02) * this.intensity;
      vy += (Math.cos((nowPhase(this.seeds[i]) + y * 0.2) * 2.0) * 0.02) * this.intensity;

      // Damping
      vx *= damping;
      vy *= damping;
      vz *= 0.98;

      // Integrate
      x += vx * dt * 60;
      y += vy * dt * 60;
      z += vz * dt * 60;

      // Soft bounds bounce
      if (x < -this.boundsX || x > this.boundsX) vx *= -0.9;
      if (y < -this.boundsY || y > this.boundsY) vy *= -0.9;

      // Keep in bounds
      x = clamp(x, -this.boundsX, this.boundsX);
      y = clamp(y, -this.boundsY, this.boundsY);

      // write back
      this.positions[i3 + 0] = x;
      this.positions[i3 + 1] = y;
      this.positions[i3 + 2] = z;

      this.velocities[i3 + 0] = vx;
      this.velocities[i3 + 1] = vy;
      this.velocities[i3 + 2] = vz;
    }

    this.posAttr.needsUpdate = true;

    // Color pulses slightly with intensity and mode
    const baseHue = this.mode === 'PAINT' ? 0.58 : this.mode === 'VORTEX' ? 0.72 : 0.08;
    const t = performance.now() * 0.001;
    this.mat.color.setHSL(baseHue + 0.02 * Math.sin(t * 1.2), 0.85, 0.62);
    this.mat.size = 0.85 + this.intensity * 0.25;
  }

  private burst(center: THREE.Vector3, power: number): void {
    // apply an outward impulse to a random subset near the cursor
    const radius = 7.5;
    const radius2 = radius * radius;
    const impulse = 22 * power;

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;

      const x = this.positions[i3 + 0];
      const y = this.positions[i3 + 1];

      const dx = x - center.x;
      const dy = y - center.y;

      const d2 = dx * dx + dy * dy;
      if (d2 > radius2) continue;

      const inv = 1 / Math.sqrt(d2 + 0.001);
      this.velocities[i3 + 0] += dx * inv * impulse * (0.5 + Math.random());
      this.velocities[i3 + 1] += dy * inv * impulse * (0.5 + Math.random());
      this.life[i] = Math.min(1, this.life[i] + 0.35);
    }
  }

  private resetParticle(i: number, initial: boolean): void {
    const i3 = i * 3;
    const x = (Math.random() - 0.5) * (this.boundsX * 2);
    const y = (Math.random() - 0.5) * (this.boundsY * 2);
    const z = (Math.random() - 0.5) * 6;

    this.positions[i3 + 0] = x;
    this.positions[i3 + 1] = y;
    this.positions[i3 + 2] = z;

    // small random velocity
    this.velocities[i3 + 0] = (Math.random() - 0.5) * (initial ? 0.2 : 0.6);
    this.velocities[i3 + 1] = (Math.random() - 0.5) * (initial ? 0.2 : 0.6);
    this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;

    this.life[i] = 0.6 + Math.random() * 0.4;
  }

  private makeStarfield(): THREE.Points {
    const count = 700;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = (Math.random() - 0.5) * 220;
      positions[i3 + 1] = (Math.random() - 0.5) * 140;
      positions[i3 + 2] = (Math.random() - 0.5) * 120;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.65,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    });

    return new THREE.Points(geo, mat);
  }
}

// ===== helpers =====
function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v));
}

function nowPhase(seed: number): number {
  return (performance.now() * 0.001) + seed * 10.0;
}
