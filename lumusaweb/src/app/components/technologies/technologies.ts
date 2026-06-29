import { Component } from '@angular/core';

interface TechArea {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  items: string[];
}

@Component({
  selector: 'app-technologies',
  imports: [],
  templateUrl: './technologies.html',
  styleUrl: './technologies.scss',
})
export class Technologies {
  selected = 'software';

  areas: TechArea[] = [
    {
      id: 'software',
      title: 'Desarrollo',
      subtitle: 'Software Engineering',
      description: 'Lenguajes, frontend, backend y construcción de aplicaciones completas.',
      items: ['Python', 'C#', 'C++', 'Java', 'JavaScript', 'TypeScript', 'Node.js', 'Angular', 'HTML', 'CSS / SCSS', 'Bootstrap']
    },
    {
      id: 'systems',
      title: 'Sistemas',
      subtitle: 'Low level & OS',
      description: 'Procesos, hilos, memoria, Linux y virtualización.',
      items: ['Linux', 'POSIX', 'fork()', 'pipes', 'signals', 'pthread', 'gestión de memoria', 'KVM/QEMU', 'Windows']
    },
    {
      id: 'cloud',
      title: 'Cloud',
      subtitle: 'AWS & Serverless',
      description: 'Arquitecturas cloud y servicios serverless sobre AWS.',
      items: ['AWS', 'Lambda', 'API Gateway', 'DynamoDB', 'S3', 'Glue', 'Kinesis', 'SAM']
    },
    {
      id: 'ai',
      title: 'IA / Visión',
      subtitle: 'Computer Vision & AI',
      description: 'Procesamiento visual, datos y modelos inteligentes.',
      items: ['OpenCV', 'NumPy', 'Pandas', 'MediaPipe', 'Machine Learning', 'Deep Learning', 'LLMs', 'Prompt Engineering']
    },
    {
      id: 'creative',
      title: 'Gráficos y Videojuegos',
      subtitle: 'Games, 3D & hardware',
      description: 'Motores, 3D, prototipado y software creativo.',
      items: ['Unity', 'Unreal Engine', 'Arduino', 'Blender', '3ds Max', 'ZBrush', 'Adobe']
    }
  ];

  get activeArea(): TechArea {
    return this.areas.find(area => area.id === this.selected) ?? this.areas[0];
  }

  selectArea(id: string): void {
    this.selected = id;
  }
}