import { Component } from '@angular/core';

interface Project {
  title: string;
  description: string;
  tags: string[];
  link: string;
  type: 'algorithms' | 'web' | 'cloud'| 'vision'| 'graphics' | 'software'| 'IA';
}

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
 projects: Project[] = [
{
  title: 'Algorithms',
  description: 'Repositorio visual de algoritmos en Python: ordenación, grafos, estructuras de datos, texto y algoritmos genéticos.',
  tags: ['Python', 'Algoritmia', 'Benchmarking'],
  link: 'https://github.com/lumusa2design/algorithms',
  type: 'algorithms'
},
{
  title: 'Link-Com',
  description: 'Aplicación web para gestionar comunidades, eventos y participación usando arquitectura moderna en Angular.',
  tags: ['Angular', 'Supabase', 'TypeScript'],
  link: 'https://github.com/HeliotGonzalez/LinkCom-Frontend',
  type: 'web'
},
{
  title: 'AWS Serverless CRUD',
  description: 'API serverless con Lambda, API Gateway y DynamoDB, diseñada para practicar arquitectura cloud real.',
  tags: ['AWS', 'Lambda', 'DynamoDB'],
  link: 'https://github.com/lumusa2design/Primer-Trabajo-Computacion-en-la-nube',
  type: 'cloud'
},
{title: 'Algorithm Arena',
  description: 'Aplicación  para visualizar y comparar algoritmos de ordenación y búsqueda en tiempo real.',
  tags: ['Python', 'Algoritmia', 'Benchmarking'],
  link: 'https://github.com/lumusa2design/algorithm_arena',
  type: 'algorithms'
},
{
  title: 'Fruit Ninja with Computer Vision',
  description: 'Juego de Fruit Ninja controlado por gestos usando OpenCV y Python.',
  tags: ['Python', 'OpenCV', 'Computer Vision'],
  link: 'https://github.com/Nayade-5/VC-Practicas_g9/tree/main/FruitNinja',
  type: 'vision'
},
{
  title: 'Pokemon AR',
  description: 'Juego de realidad aumentada que permite capturar Pokémon en el mundo real usando ARKit y Unity.',
  tags: ['Unity', 'ARKit', 'C#'],
  link: 'https://github.com/lumusa2design/Computer-graphics/blob/main/TrabajoOpcional/README.md',
  type: 'graphics'
},
{
 title: 'Chatbot with AI',
 description: 'Chatbot inteligente que utiliza procesamiento de lenguaje natural para interactuar con los usuarios.',
 tags: ['Python', 'NLP', 'AI'],
 link: 'https://github.com/lumusa2design/chatbot',
 type: 'IA',
},
{
  title: ' Financial APP',
  description: 'Aplicación financiera que permite a los usuarios gestionar sus finanzas personales y realizar un seguimiento de sus gastos e ingresos.',
  tags: ['Python', 'Tkinter' ],
  link: 'https://github.com/lumusa2design/financial_app',
  type: 'software'
},
{
  title: ' Neural Network',
  description: 'Implementación de una red neuronal desde cero en Python ',
  tags: ['Python', 'Machine Learning', 'Neural Networks'],
  link: 'https://github.com/lumusa2design/neural-network',
  type: 'IA'
}
  ];
}
