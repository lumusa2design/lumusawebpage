import {Component, signal} from '@angular/core';


@Component(
  {
    templateUrl: './hero.component.html',
    selector:'hero',
  })

export class HeroComponent
{
  name=signal('Ironman');
  age=signal(45);


  getHeroDescription()
  {
    return `${this.name()} ${this.age()}`;
  }

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
