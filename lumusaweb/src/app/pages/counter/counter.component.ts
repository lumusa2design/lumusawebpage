import {Component} from '@angular/core';


@Component
({
  template: `
  <h1>Counter Component</h1>
  <h2>{{counter}}</h2>
  <button (click)="increasedBy(1)">+1</button>
  <button (click)="decreaseBy(1)">-1</button>
  <button (click)="resetCounter()">Reset</button>
  `,
})

export class CounterComponent
{
  counter = 10;

  increasedBy(value: number)
  {

    this.counter += 1;
  }
  decreaseBy(value:number)
  {
    if (this.counter >= 0){
      this.counter -= 1;
    }
  }

  resetCounter()
  {
    this.counter = 10;
  }
}
