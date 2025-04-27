import {effect, Injectable, signal} from '@angular/core';
import {Characters} from '../inferfaces/character.interface';

const loadFromLocalStorage = (): Characters[] => {
  const characters = localStorage.getItem('characters');
  return characters ? JSON.parse(characters) : [];
};


@Injectable({providedIn: 'root'})

export class DragonballService
{
  characters = signal <Characters[]>([
    {id: 1, name: "Goku", power:9001},
    {id: 2, name: "Vegeta", power:8002},
    {id: 3, name: "Piccolo", power:1000},
  ]);
  saveToLocalStorage = effect(()=> {localStorage.setItem('characters', JSON.stringify(this.characters()))})

  AddCharacter(character: Characters)
  {
    this.characters.update((list) => [...list, character]);

  }

}
