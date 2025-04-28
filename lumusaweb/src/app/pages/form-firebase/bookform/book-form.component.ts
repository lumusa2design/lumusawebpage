import {Component, signal} from '@angular/core';
import {Book} from '../../../inferfaces/book';

@Component({
  selector: 'book-form',
  templateUrl: './book-form.component.html',
})

export class BookFormComponent
{

  books = signal<Book[]>([]);
  AddBook()
  {
    //if (){}
  }
}
