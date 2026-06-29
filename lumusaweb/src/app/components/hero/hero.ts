import { Component, OnDestroy, OnInit } from '@angular/core';
import { NetworkOrb } from '../../features/home/network-orb/network-orb';

@Component({
  selector: 'app-hero',
  imports: [NetworkOrb],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero implements OnInit, OnDestroy {
  terminalText = '';

  private terminalLines = [
    'Lumusa OS v1.0',
    '',
    'lumusa@portfolio:~$ whoami',
    'Luis Muñoz Sanz',
    'Computer Engineering Student',
    '',
    'lumusa@portfolio:~$ skills',
    'Python  Angular  AWS  OpenCV  C++',
    '',
    'lumusa@portfolio:~$ ls projects',
    'algorithms/  cloud-api/  portfolio/',
    '',
    'lumusa@portfolio:~$ status',
    'Portfolio online · building future...'
  ];

  private fullText = this.terminalLines.join('\n');
  private index = 0;
  private intervalId?: number;
  private resetTimeoutId?: number;

  ngOnInit(): void {
    this.startTyping();
  }

  ngOnDestroy(): void {
    window.clearInterval(this.intervalId);
    window.clearTimeout(this.resetTimeoutId);
  }

  private startTyping(): void {
    this.terminalText = '';
    this.index = 0;

    this.intervalId = window.setInterval(() => {
      this.terminalText += this.fullText[this.index];
      this.index++;

      if (this.index >= this.fullText.length) {
        window.clearInterval(this.intervalId);

        this.resetTimeoutId = window.setTimeout(() => {
          this.startTyping();
        }, 4500);
      }
    }, 28);
  }
}