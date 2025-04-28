import {Component, output, signal} from '@angular/core';
import {Book} from '../../../inferfaces/book';
import {BooksService} from '../../../services/books.service';

@Component({
  selector: 'book-form',
  templateUrl: './book-form.component.html',
})

export class BookFormComponent
{

  titulo = signal("");
  autor = signal("");

  constructor(private bookservice: BooksService ) {
  }

  bookAdded = output<Book>()

  async AddBook()
  {
    if (this.titulo && this.autor)
    {
      const newBook: Book = {title: this.titulo(), author: this.autor()}
      this.bookAdded.emit(newBook);
      const response = await this.bookservice.addBook(newBook);
      console.log(response)
      this.titulo.set("");
      this.autor.set("");
    }
  }
}
