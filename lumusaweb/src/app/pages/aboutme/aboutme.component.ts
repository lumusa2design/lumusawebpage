import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-aboutme',
  standalone: true,
  imports: [],
  templateUrl: './aboutme.component.html',
  styleUrls: ['./aboutme.component.css'],
})
export class AboutmeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('glHost', { static: true }) glHost!: ElementRef<HTMLDivElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;

  private stars!: THREE.Points;
  private starsGeo!: THREE.BufferGeometry;
  private starsPos!: THREE.BufferAttribute;
  private starsSpd!: THREE.BufferAttribute;

  private frameId: number | null = null;
  private onResize = () => this.resize();

  // Interacción
  private pointerNDC = new THREE.Vector2(0, 0); // -1..1
  private pointerSmooth = new THREE.Vector2(0, 0);
  private warp = 0; // 0..1
  private raycaster = new THREE.Raycaster();
  private planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // z=0
  private clickPoint = new THREE.Vector3(0, 0, 0);

  // Explosiones
  private bursts: { points: THREE.Points; born: number }[] = [];

  ngAfterViewInit(): void {
    this.initThree();
    window.addEventListener('resize', this.onResize, { passive: true });
    this.animate();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResize);
    if (this.frameId) cancelAnimationFrame(this.frameId);

    // Limpieza bursts
    for (const b of this.bursts) {
      (b.points.geometry as THREE.BufferGeometry).dispose();
      (b.points.material as THREE.Material).dispose();
      this.scene.remove(b.points);
    }
    this.bursts = [];

    // Limpieza estrellas
    this.starsGeo?.dispose();
    (this.stars.material as THREE.Material)?.dispose();

    this.renderer?.dispose();
    const canvas = this.renderer?.domElement;
    if (canvas?.parentElement) canvas.parentElement.removeChild(canvas);
  }

  // =========================
  // Eventos (desde el template)
  // =========================
  onPointerMove(ev: PointerEvent): void {
    const rect = this.glHost.nativeElement.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((ev.clientY - rect.top) / rect.height) * 2 - 1);
    this.pointerNDC.set(x, y);
  }

  onPointerDown(ev: PointerEvent): void {
    // “Warp” al click (ráfaga)
    this.warp = 1;

    // Convertir click a punto 3D en el plano z=0
    const rect = this.glHost.nativeElement.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((ev.clientY - rect.top) / rect.height) * 2 - 1);

    this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
    const hit = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(this.planeZ, hit)) {
      this.clickPoint.copy(hit);
      this.spawnBurst(this.clickPoint);
    }
  }

  // ==============
  // Three.js setup
  // ==============
  private initThree(): void {
    const host = this.glHost.nativeElement;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, 1, 0.1, 300);
    this.camera.position.set(0, 0, 70);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    host.appendChild(this.renderer.domElement);

    // Estrellas “campo”
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 0] = (Math.random() - 0.5) * 160;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 80;
      speeds[i] = 0.35 + Math.random() * 1.1;
    }

    this.starsGeo = new THREE.BufferGeometry();
    this.starsPos = new THREE.BufferAttribute(positions, 3);
    this.starsSpd = new THREE.BufferAttribute(speeds, 1);
    this.starsGeo.setAttribute('position', this.starsPos);
    this.starsGeo.setAttribute('aSpeed', this.starsSpd);

    const mat = new THREE.PointsMaterial({
      size: 0.75,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });

    this.stars = new THREE.Points(this.starsGeo, mat);
    this.scene.add(this.stars);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.7));

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

  // ==================
  // Animación + física
  // ==================
  private animate = (): void => {
    // Suavizado de puntero (parallax)
    this.pointerSmooth.lerp(this.pointerNDC, 0.08);

    // Mueve cámara con parallax
    const targetX = this.pointerSmooth.x * 6;
    const targetY = this.pointerSmooth.y * 4;
    this.camera.position.x += (targetX - this.camera.position.x) * 0.05;
    this.camera.position.y += (targetY - this.camera.position.y) * 0.05;
    this.camera.lookAt(0, 0, 0);

    // Warp decay
    this.warp = Math.max(0, this.warp - 0.03);

    // Movimiento de estrellas (z-scroll + warp)
    const base = 0.03;
    const extraWarp = this.warp * 0.22;

    for (let i = 0; i < this.starsPos.count; i++) {
      const z = this.starsPos.getZ(i) + (this.starsSpd.getX(i) * (base + extraWarp));
      this.starsPos.setZ(i, z > 40 ? -40 : z);
    }
    this.starsPos.needsUpdate = true;

    // Rotación sutil
    this.stars.rotation.y += 0.0008 + this.warp * 0.003;
    this.stars.rotation.x += 0.0003;

    // Actualiza bursts
    const now = performance.now();
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i];
      const age = (now - b.born) / 1000; // s
      const geo = b.points.geometry as THREE.BufferGeometry;
      const pos = geo.getAttribute('position') as THREE.BufferAttribute;

      // Expandir
      const scale = 1 + age * 18;
      b.points.scale.setScalar(scale);

      // Fade out
      const mat = b.points.material as THREE.PointsMaterial;
      mat.opacity = Math.max(0, 0.8 - age * 1.2);

      if (age > 0.7) {
        geo.dispose();
        (b.points.material as THREE.Material).dispose();
        this.scene.remove(b.points);
        this.bursts.splice(i, 1);
      } else {
        pos.needsUpdate = true;
      }
    }

    this.renderer.render(this.scene, this.camera);
    this.frameId = requestAnimationFrame(this.animate);
  };

  // ==================
  // Burst (click)
  // ==================
  private spawnBurst(center: THREE.Vector3): void {
    const count = 220;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // disco con dispersión
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 2.0;
      positions[i3 + 0] = center.x + Math.cos(a) * r;
      positions[i3 + 1] = center.y + Math.sin(a) * r;
      positions[i3 + 2] = center.z + (Math.random() - 0.5) * 0.2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: 1.2,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });

    const p = new THREE.Points(geo, mat);
    this.scene.add(p);
    this.bursts.push({ points: p, born: performance.now() });
  }
}
