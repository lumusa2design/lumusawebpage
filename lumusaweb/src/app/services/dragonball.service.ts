import {effect, Injectable, signal} from '@angular/core';
import {Characters} from '../inferfaces/character.interface';

const loadFromLocalStorage = (): Characters[] => {
  const characters = localStorage.getItem('characters');
  return characters ? JSON.parse(characters) : [];
};


@Injectable({providedIn: 'root'})

export class DragonballService
{

  characters = signal <Characters[]>(loadFromLocalStorage());
  saveToLocalStorage = effect(()=> {localStorage.setItem('characters', JSON.stringify(this.characters()))})

  AddCharacter(character: Characters)
  {
    this.characters.update((list) => [...list, character]);

  }

}
