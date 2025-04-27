import {Component, output, signal} from '@angular/core';
import {Characters} from '../../../../inferfaces/character.interface';

@Component(
  {
    selector: 'app-dragonball-puto-list',
    templateUrl: './dragonball-character-add.component.html',
  })


export class DragonballCharacterAddComponent
{
  name = signal("");
  power = signal(0);
  newCharacter = output<Characters>();
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
        id:Math.floor(Math.random()*256),
        name: this.name(),
        power: this.power(),
      };
    this.newCharacter.emit(newCharacter);

    //this.characters.update((list) =>[...list, newCharacter]);
    this.ResetFields();
  }

  ResetFields()
  {
    this.name.set('');
    this.power.set(0);
  }
}

