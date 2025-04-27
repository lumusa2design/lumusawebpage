import {Component, inject, signal} from '@angular/core';
import {DragonballCharListComponent} from '../../componentes/shared/dragonball/dragonball-char-list/dragonball-char-list.component'
import {DragonballCharacterAddComponent} from './dbcomponents/dragonball-character-add/dragonball-character-add.component';
import {DragonballService} from '../../services/dragonball.service';

interface Characters
{
  id: number;
  name: string;
  power: number;
}
@Component({
  selector: 'dragonball-page',
  templateUrl: "./dragonball-page.component.html",
  standalone: true,
  imports: [DragonballCharListComponent, DragonballCharacterAddComponent],
})

export class DragonballPageComponent {
 public dragonballService = inject(DragonballService);
}
