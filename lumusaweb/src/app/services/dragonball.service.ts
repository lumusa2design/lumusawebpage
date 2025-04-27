import {Injectable, signal} from '@angular/core';
import {Characters} from '../inferfaces/character.interface';
@Injectable({providedIn: 'root'})

export class DragonballService
{
  characters = signal <Characters[]>([
    {id: 1, name: "Goku", power:9001},
    {id: 2, name: "Vegeta", power:8002},
    {id: 3, name: "Piccolo", power:1000},
  ]);
  AddCharacter(character: Characters)
  {
    this.characters.update((list) => [...list, character]);
  }
  constructor() {
  }
}
