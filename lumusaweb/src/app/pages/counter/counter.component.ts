import {Component} from '@angular/core';


@Component
({
  templateUrl: './counter.component.html',
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
