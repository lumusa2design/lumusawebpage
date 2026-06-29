import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';

interface NodePoint {
  x: number;
  y: number;
  z: number;
  pulseSeed: number;
  pulseSpeed: number;
}

@Component({
  selector: 'app-network-orb',
  imports: [],
  templateUrl: './network-orb.html',
  styleUrl: './network-orb.scss',
})
export class NetworkOrb implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private nodes: NodePoint[] = [];
  private animationId = 0;
  private angle = 0;
  private mouseX = 0;
private mouseY = 0;
private targetMouseX = 0;
private targetMouseY = 0;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');

    if (!context) return;

    this.ctx = context;
    this.resize();
    this.createNodes();
    this.animate();

    window.addEventListener('resize', this.resize);
    canvas.addEventListener('mousemove', this.handleMouseMove);
canvas.addEventListener('mouseleave', this.handleMouseLeave);
  }

ngOnDestroy(): void {
  const canvas = this.canvasRef.nativeElement;

  cancelAnimationFrame(this.animationId);
  window.removeEventListener('resize', this.resize);
  canvas.removeEventListener('mousemove', this.handleMouseMove);
  canvas.removeEventListener('mouseleave', this.handleMouseLeave);
}

  private resize = (): void => {
    const canvas = this.canvasRef.nativeElement;
    const size = canvas.offsetWidth;

    canvas.width = size;
    canvas.height = size;
  };

  private handleMouseMove = (event: MouseEvent): void => {
  const canvas = this.canvasRef.nativeElement;
  const rect = canvas.getBoundingClientRect();

  this.targetMouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
  this.targetMouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
};

private handleMouseLeave = (): void => {
  this.targetMouseX = 0;
  this.targetMouseY = 0;
};

  private createNodes(): void {
    this.nodes = [];

    for (let i = 0; i < 105; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.35 + Math.random() * 0.65;

      this.nodes.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        pulseSeed: Math.random() * Math.PI * 2,
        pulseSpeed: 0.4 + Math.random() * 2.8
      });
    }
  }

  private animate = (): void => {
    const canvas = this.canvasRef.nativeElement;
    const { width, height } = canvas;
    const center = width / 2;
    const radius = width * 0.5;

    this.ctx.clearRect(0, 0, width, height);

    this.angle += 0.0015;
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;

const cosY = Math.cos(this.angle + this.mouseX * 0.25);
const sinY = Math.sin(this.angle + this.mouseX * 0.25);
const cosX = Math.cos(this.angle * 0.55 + this.mouseY * 0.25);
const sinX = Math.sin(this.angle * 0.55 + this.mouseY * 0.25);

    const projected = this.nodes.map((node) => {
      let x = node.x * cosY - node.z * sinY;
      let z = node.x * sinY + node.z * cosY;
      let y = node.y * cosX - z * sinX;

      z = node.y * sinX + z * cosX;

      const depth = (z + 1) / 2;
      const perspective = 0.75 + depth * 0.65;

      const wave = Math.sin(this.angle * node.pulseSpeed + node.pulseSeed);
      const pulse = Math.max(0, wave);

      const flash = pulse > 0.8  ? (pulse - 0.8) / 0.4 : 0;

      return {
        x: center + x * radius * perspective,
        y: center + y * radius * perspective,
        z,
        depth,
        pulse,
        flash
      };
    });

    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const a = projected[i];
        const b = projected[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const maxDistance = 80;

        if (distance < maxDistance) {
          const pulseStrength = Math.max(a.flash, b.flash);
          const depthStrength = (a.depth + b.depth) / 2;

          const opacity =
            (1 - distance / maxDistance) *
            (0.08 + depthStrength * 0.18 + pulseStrength * 0.45);

          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
          this.ctx.lineWidth = 1 + pulseStrength * 2.6;
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.stroke();
        }
      }
    }

    for (const point of projected) {
      const glow = point.flash;
      const opacity = 0.28 + point.depth * 0.6 + glow * 0.4;
      const size = 1.5 + point.depth * 2 + glow * 5;

      if (glow > 0) {
        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(34, 211, 238, ${0.16 * glow})`;
        this.ctx.arc(point.x, point.y, size * 4.5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(125, 211, 252, ${0.12 * glow})`;
        this.ctx.arc(point.x, point.y, size * 2.4, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.beginPath();
      this.ctx.fillStyle = `rgba(125, 211, 252, ${opacity})`;
      this.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.animationId = requestAnimationFrame(this.animate);
  };
}