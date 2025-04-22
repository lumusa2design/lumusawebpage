import {Component, signal} from '@angular/core';
import {DragonballCharListComponent} from '../../componentes/shared/dragonball/dragonball-char-list/dragonball-char-list.component'
interface Characters
{
  id: number;
  name: string;
  power: number;
}
@Component({
  templateUrl: "./dragonball-page.component.html",
  imports:[DragonballCharListComponent],
})

export class DragonballPageComponent {

  name = signal("");
  power = signal(0);

  characters = signal <Characters[]>([
    {id: 1, name: "Goku", power:9001},
    {id: 2, name: "Vegeta", power:8002},
    {id: 3, name: "Piccolo", power:1000},
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
