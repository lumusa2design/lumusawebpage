import { Component } from '@angular/core';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {

  timeline: TimelineItem[] = [
    {
      year: '2017',
      title: 'Bachillerato',
      description: 'Bachillerato en Ciencias de la Salud en el Colegio San Antonio María Claret.'
    },
    {
      year: "2019",
      title: "Técnico Deportivo Superior",
      description: "Judo y Defensa Personal en IES Felo Monzón."
    },

    {
      year: '2021',
      title: 'Técnico Superior',
      description: 'Animación 3D, videojuegos y diseño interactivo.'
    },

    {
      year: '2022',
      title: 'Tesorero DEII',
      description: 'Organización y gestión de recursos'
    },
    {
      year: '2022',
      title: 'Vocal de Comunicación Consejo de Estudiantes ULPGC',
      description: 'Coordinar la comunicación entre estudiantes y la universidad.'
    },

    {
      year: '2023',
      title: 'Secretario DEII',
      description: 'Representación estudiantil y organización.'
    },
    {
      year: '2023',
      title: 'Vocal de Eventos Consejo de Estudiantes ULPGC',
      description: 'Organización de eventos y actividades para estudiantes.'
    },

    {
      year: '2024',
      title: 'Ingeniería Informática',
      description: 'Algoritmia, sistemas y arquitectura software.'
    },

    {
      year: '2025',
      title: 'Presidente DEII',
      description: 'Liderazgo de equipos y proyectos.'
    },

    {
      year: '2026',
      title: 'Cloud · IA · Portfolio',
      description: 'AWS, visión artificial y proyectos personales.'
    }

  ];

}