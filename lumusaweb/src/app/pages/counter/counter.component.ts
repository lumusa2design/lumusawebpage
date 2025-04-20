import {Component, signal} from '@angular/core';


@Component
({
  templateUrl: './counter.component.html',
})

export class CounterComponent
{
  counter = 0;
  counterSignal = signal(10);

  increasedBy(value: number)
  {

    this.counter += 1;
    this.counterSignal.update((currentValue) => currentValue + 1);
  }
  decreaseBy(value:number)
  {
    if (this.counter > 0){
      this.counter -= 1;
      this.counterSignal.update((currentValue) => currentValue - 1);
    }
  }

  resetCounter()
  {
    this.counter = 0;
    this.counterSignal.set(0);
  }
}
