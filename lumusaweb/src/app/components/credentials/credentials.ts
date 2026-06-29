import { Component } from '@angular/core';

type CredentialCategory = 'education' | 'certificate' | 'recommendation';

interface Credential {
  title: string;
  issuer: string;
  year: string;
  category: CredentialCategory;
  description: string;
  pdf: string;
}

@Component({
  selector: 'app-credentials',
  imports: [],
  templateUrl: './credentials.html',
  styleUrl: './credentials.scss',
})
export class Credentials {
  credentials: Credential[] = [
    {
      title: 'Grado en Ingeniería Informática',
      issuer: 'Universidad de Las Palmas de Gran Canaria',
      year: '2022 - Actualidad',
      category: 'education',
      description: 'Estudiante de Ingeniería Informática.',
      pdf: 'assets/credentials/grado.pdf'
    },
    {
      title: 'Técnico Superior en Animación 3D, Juegos y Diseño de Entornos Interactivos',
      issuer: 'CESUR',
      year: '2019 - 2021',
      category: 'education',
      description: 'Título de Formación Profesional de Grado Superior.',
      pdf: 'assets/credentials/animacion3d.pdf'
    },
    {
      title: 'Getting Started with Linux Fundamentals (RH104)',
      issuer: 'Red Hat',
      year: '2024',
      category: 'certificate',
      description: 'Prácticas y proyectos sobre arquitectura cloud.',
      pdf: 'assets/credentials/RHFundamentals.pdf'
    },
    {
      title: 'Red Hat System Administration I (RH124)',
      issuer: 'Red Hat',
      year: '2024',
      category: 'certificate',
      description: 'Prácticas y proyectos sobre administración de sistemas Linux.',
      pdf: 'assets/credentials/RHSystemAdministratorI.pdf'
    },
    {
      title: 'Red Hat System Administration II (RH134)',
      issuer: 'Red Hat',
      year: '2024',
      category: 'certificate',
      description: 'Prácticas y proyectos sobre administración avanzada de sistemas Linux.',
      pdf: 'assets/credentials/RHSystemAdministratorII.pdf'
    },
    {
      title: 'Red Hat OpenShift Development I: Introduction to Containers with Podman (DO188 - RHA) - Ver. 4.18',
      issuer: 'Red Hat',
      year: '2024',
      category: 'certificate',
      description: 'Prácticas y proyectos sobre desarrollo en OpenShift.',
      pdf: 'assets/credentials/DO188.pdf'
    },
    {
      title: 'Carta de recomendación - ISDARA',
      issuer: 'Gerencia ISDARA',
      year: '2026',
      category: 'recommendation',
      description: 'Organización y coordinación del evento ViveCampus ULPGC.',
      pdf: 'assets/credentials/CartaBresh.pdf'
    },
    {
      title: 'Carta de recomendación - Mucho Jaleo S.L.',
      issuer: 'Mucho Jaleo S.L.',
      year: '2026',
      category: 'recommendation',
      description: 'Coordinación de los chiringuitos en los Carnavales de Las Palmas de Gran Canaria.',
      pdf: 'assets/credentials/CartaRecomendacionMuchoJaleo.pdf'
    },
    {
      title: 'Liderazgo',
      issuer: 'Santander Open Academy',
      year: '2026',
      category: 'certificate',
      description: 'Curso de liderazgo y gestión de equipos.',
      pdf: 'assets/credentials/Liderazgo.pdf'
    },
    {
      title: 'Negociación',
      issuer: 'Santander Open Academy',
      year: '2026',
      category: 'certificate',
      description: 'Curso de negociación y resolución de conflictos.',
      pdf: 'assets/credentials/Negociacion.pdf'
    }
  ];

  get education(): Credential[] {
    return this.credentials.filter(item => item.category === 'education');
  }

  get certificates(): Credential[] {
    return this.credentials.filter(item => item.category === 'certificate');
  }

  get recommendations(): Credential[] {
    return this.credentials.filter(item => item.category === 'recommendation');
  }
}