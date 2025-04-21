import {Component, signal} from '@angular/core';

interface Characters
{
  id: number;
  name: string;
  power: number;
}
@Component({
  templateUrl: "./dragonball-super-page.component.html",
})

export class DragonballSuperPageComponent {

  name = signal("");
  power = signal(0);

  characters = signal <Characters[]>([
    {id: 1, name: "Goku", power:9001},
    {id: 2, name: "Vegeta", power:8002},
    {id: 3, name: "Piccolo", power:3003},
  ]);
  AddCharacter()
  {
    if(!this.name() || !this.power() || this.power() < 0)
    {
      throw new Error("Dont character!");
    }

    const newCharacter: Characters =
      {
        id:this.characters().length + 1, name: this.name(), power: this.power(),
      };

    this.characters.update((list) =>[...list, newCharacter]);
    this.ResetFields();
  }

  ResetFields()
  {
    this.name.set('');
    this.power.set(0);
  }
}
