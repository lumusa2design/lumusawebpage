import {Component, output, signal} from '@angular/core';
import {Book} from '../../../inferfaces/book';

@Component({
  selector: 'book-form',
  templateUrl: './book-form.component.html',
})

export class BookFormComponent
{

  titulo = signal("");
  autor = signal("");


  bookAdded = output<Book>()

  AddBook()
  {
    if (this.titulo && this.autor)
    {
      const newBook: Book = {title: this.titulo(), author: this.autor()}
      this.bookAdded.emit(newBook);

      this.titulo.set("");
      this.autor.set("");
    }
  }
}
