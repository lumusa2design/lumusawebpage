import {Component, input, signal} from '@angular/core';
import type {Characters} from '../../../../inferfaces/character.interface';

@Component({
  selector: 'app-dragonball-char-list',
  imports: [],
  templateUrl: './dragonball-char-list.component.html',
  styleUrl: './dragonball-char-list.component.css'
})
export class DragonballCharListComponent {
  characters = input.required<Characters[]>();
  listName = input.required<string>();
}
