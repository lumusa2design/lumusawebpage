import { Component } from '@angular/core';

interface Bar {
  value: number;
  active: boolean;
  sorted: boolean;
}

@Component({
  selector: 'app-algorithm-lab',
  imports: [],
  templateUrl: './algorithm-lab.html',
  styleUrl: './algorithm-lab.scss',
})
export class AlgorithmLab {
  bars: Bar[] = [];
  comparisons = 0;
  swaps = 0;
  running = false;
  status = 'Listo para ejecutar';

  constructor() {
    this.generateArray();
  }

  generateArray(): void {
    if (this.running) return;

    this.comparisons = 0;
    this.swaps = 0;
    this.status = 'Array generado';

    this.bars = Array.from({ length: 28 }, () => ({
      value: Math.floor(Math.random() * 90) + 10,
      active: false,
      sorted: false
    }));
  }

  async runSort(): Promise<void> {
    if (this.running) return;

    this.running = true;
    this.status = 'Ejecutando Bubble Sort...';

    for (let i = 0; i < this.bars.length; i++) {
      for (let j = 0; j < this.bars.length - i - 1; j++) {
        this.clearActive();

        this.bars[j].active = true;
        this.bars[j + 1].active = true;
        this.comparisons++;

        await this.sleep(45);

        if (this.bars[j].value > this.bars[j + 1].value) {
          [this.bars[j], this.bars[j + 1]] = [this.bars[j + 1], this.bars[j]];
          this.swaps++;
          await this.sleep(45);
        }
      }

      this.bars[this.bars.length - i - 1].sorted = true;
    }

    this.clearActive();
    this.bars.forEach(bar => bar.sorted = true);

    this.status = 'Ordenación completada';
    this.running = false;
  }

  private clearActive(): void {
    this.bars.forEach(bar => bar.active = false);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => window.setTimeout(resolve, ms));
  }
}