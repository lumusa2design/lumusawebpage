import {Component, computed, signal} from '@angular/core';
import {UpperCasePipe} from '@angular/common';


@Component(
  {
    templateUrl: './hero.component.html',
    selector:'hero',
    imports:[UpperCasePipe]
  })

export class HeroComponent
{
  name=signal('Ironman');
  age=signal(45);
  heroDescription = computed(()=>{
    const description = `${(this.name())} - ${this.age()}`;
    return description;
  })



  changeHero()
  {
    this.name.set('Spiderman');
    this.age.set (16);
  }

  resetForm()
  {
    this.name=signal('Ironman');
    this.age=signal(45);
  }

  ageChange()
  {
    this.age=signal(60);
  }
}
