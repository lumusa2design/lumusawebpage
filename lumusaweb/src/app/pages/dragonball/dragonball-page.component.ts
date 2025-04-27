import {Component, signal} from '@angular/core';
import {DragonballCharListComponent} from '../../componentes/shared/dragonball/dragonball-char-list/dragonball-char-list.component'
import {DragonballCharacterAddComponent} from './dbcomponents/dragonball-character-add/dragonball-character-add.component';

interface Characters
{
  id: number;
  name: string;
  power: number;
}
@Component({
  templateUrl: "./dragonball-page.component.html",
  imports: [DragonballCharListComponent, DragonballCharacterAddComponent],
})

export class DragonballPageComponent {

  name = signal("");
  power = signal(0);

  characters = signal <Characters[]>([
    {id: 1, name: "Goku", power:9001},
    {id: 2, name: "Vegeta", power:8002},
    {id: 3, name: "Piccolo", power:1000},
  ]);
  AddCharacter(character: Characters)
  {
    this.characters.update((list) => [...list, character]);
  }

  ResetFields()
  {
    this.name.set('');
    this.power.set(0);
  }
}
