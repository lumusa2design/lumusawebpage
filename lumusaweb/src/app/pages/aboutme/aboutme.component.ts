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

  mode: Mode = 'PAINT';
  tips = 'Move mouse to paint. Click = burst. Keys: 1 Paint, 2 Vortex, 3 Burst.';
  intensity = 1;
  paused = false;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private frameId: number | null = null;
  private lastT = 0;

  private raycaster = new THREE.Raycaster();
  private planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  private pointerNDC = new THREE.Vector2();
  private pointerWorld = new THREE.Vector3();
  private pointerVel = new THREE.Vector3();
  private lastPointerWorld = new THREE.Vector3();

  private count = 40000;
  private positions!: Float32Array;
  private velocities!: Float32Array;
  private life!: Float32Array;
  private seeds!: Float32Array;

  private geo!: THREE.BufferGeometry;
  private points!: THREE.Points;
  private mat!: THREE.ShaderMaterial;

  private boundsX = 40;
  private boundsY = 30;

  ngAfterViewInit(): void {
    this.initThree();
    window.addEventListener('resize', this.resize);
    window.addEventListener('keydown', this.onKeyDown);
    this.lastT = performance.now();
    this.animate();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('keydown', this.onKeyDown);
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.geo?.dispose();
    this.mat?.dispose();
    this.renderer?.dispose();
  }

  // ================= EVENTS =================
  onPointerMove(ev: PointerEvent): void {
    const rect = this.glHost.nativeElement.getBoundingClientRect();
    this.pointerNDC.set(
      ((ev.clientX - rect.left) / rect.width) * 2 - 1,
      -(((ev.clientY - rect.top) / rect.height) * 2 - 1)
    );

    this.raycaster.setFromCamera(this.pointerNDC, this.camera);
    const hit = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(this.planeZ, hit)) {
      this.pointerVel.copy(hit).sub(this.lastPointerWorld);
      this.pointerWorld.copy(hit);
      this.lastPointerWorld.copy(hit);
    }
  }

  onPointerDown(ev: PointerEvent): void {
    if ((ev.target as HTMLElement).closest('.hud')) return;
    this.burst(this.pointerWorld, 1.4 * this.intensity);
  }

  setMode(m: Mode): void {
    this.mode = m;
    this.tips =
      m === 'PAINT'
        ? 'Paint mode: organic trails.'
        : m === 'VORTEX'
          ? 'Vortex mode: swirl energy.'
          : 'Burst mode: explosive motion.';
  }

  togglePause(): void {
    this.paused = !this.paused;
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.key === '1') this.setMode('PAINT');
    if (e.key === '2') this.setMode('VORTEX');
    if (e.key === '3') this.setMode('BURST');
    if (e.key.toLowerCase() === 'p') this.togglePause();
    if (e.key === '+' || e.key === '=') this.intensity = Math.min(2, this.intensity + 0.1);
    if (e.key === '-') this.intensity = Math.max(0.5, this.intensity - 0.1);
  };

  // ================= THREE =================
  private initThree(): void {
    const host = this.glHost.nativeElement;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 300);
    this.camera.position.set(0, 0, 60);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    host.appendChild(this.renderer.domElement);

    this.positions = new Float32Array(this.count * 3);
    this.velocities = new Float32Array(this.count * 3);
    this.life = new Float32Array(this.count);
    this.seeds = new Float32Array(this.count);

    for (let i = 0; i < this.count; i++) {
      this.resetParticle(i, true);
      this.seeds[i] = Math.random();
    }

    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geo.setAttribute('life', new THREE.BufferAttribute(this.life, 1));

    this.mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uColor: { value: new THREE.Color() },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    });

    this.points = new THREE.Points(this.geo, this.mat);
    this.scene.add(this.points);

    this.resize();
  }

  private resize = () => {
    const w = this.glHost.nativeElement.clientWidth || 1;
    const h = this.glHost.nativeElement.clientHeight || 1;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  };

  private animate = () => {
    const now = performance.now();
    const dt = Math.min(0.033, (now - this.lastT) / 1000);
    this.lastT = now;

    if (!this.paused) this.step(dt);

    this.renderer.render(this.scene, this.camera);
    this.frameId = requestAnimationFrame(this.animate);
  };

  private step(dt: number): void {
    const influence = 18 * this.intensity;
    const damping = 0.985;

    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;

      let x = this.positions[i3];
      let y = this.positions[i3 + 1];
      let z = this.positions[i3 + 2];
      let vx = this.velocities[i3];
      let vy = this.velocities[i3 + 1];

      this.life[i] -= dt * 0.3;
      if (this.life[i] <= 0) {
        this.resetParticle(i, false);
        continue;
      }

      const dx = this.pointerWorld.x - x;
      const dy = this.pointerWorld.y - y;
      const d = Math.sqrt(dx * dx + dy * dy) + 0.001;

      if (this.mode === 'PAINT') {
        vx += this.pointerVel.x * 0.25;
        vy += this.pointerVel.y * 0.25;
      } else if (this.mode === 'VORTEX') {
        vx += -dy / d * influence * dt;
        vy += dx / d * influence * dt;
      } else {
        vx += -dx / d * influence * dt;
        vy += -dy / d * influence * dt;
      }

      const wave = Math.sin(this.seeds[i] * 10 + performance.now() * 0.001 + x * 0.2);
      vx += wave * 0.015;
      vy += Math.cos(wave + y * 0.2) * 0.015;

      vx *= damping;
      vy *= damping;

      x += vx * dt * 60;
      y += vy * dt * 60;

      x = clamp(x, -this.boundsX, this.boundsX);
      y = clamp(y, -this.boundsY, this.boundsY);

      this.positions[i3] = x;
      this.positions[i3 + 1] = y;
      this.velocities[i3] = vx;
      this.velocities[i3 + 1] = vy;
    }

    this.geo.attributes['position'].needsUpdate = true;
    this.geo.attributes['life'].needsUpdate = true;

    const baseHue = 0.33; // verde puro (≈120°)
    const pulse = 0.06 * Math.sin(performance.now() * 0.0015);

    this.mat.uniforms['uColor'].value.setHSL(
      baseHue,
      0.95,
      0.68 + pulse
    );

  }

  private burst(center: THREE.Vector3, power: number): void {
    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      const dx = this.positions[i3] - center.x;
      const dy = this.positions[i3 + 1] - center.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d > 8) continue;
      this.velocities[i3] += dx * power;
      this.velocities[i3 + 1] += dy * power;
      this.life[i] = Math.min(1, this.life[i] + 0.4);
    }
  }

  private resetParticle(i: number, initial: boolean): void {
    const i3 = i * 3;
    this.positions[i3] = (Math.random() - 0.5) * this.boundsX * 2;
    this.positions[i3 + 1] = (Math.random() - 0.5) * this.boundsY * 2;
    this.positions[i3 + 2] = (Math.random() - 0.5) * 6;
    this.velocities[i3] = (Math.random() - 0.5) * (initial ? 0.2 : 0.8);
    this.velocities[i3 + 1] = (Math.random() - 0.5) * (initial ? 0.2 : 0.8);
    this.life[i] = 0.5 + Math.random() * 0.5;
  }
}

// ===== SHADERS =====
const VERTEX_SHADER = `
attribute float life;
varying float vLife;

void main() {
  vLife = life;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float size = mix(1000.0, 1800.0, life);
  size *= (0.2 / -mvPosition.z);
  gl_PointSize = size;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const FRAGMENT_SHADER = `
precision highp float;
varying float vLife;
uniform vec3 uColor;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float alpha = smoothstep(0.5, 0.0, d) * vLife;
  gl_FragColor = vec4(uColor, alpha);
}
`;

function clamp(v: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, v));
}
