import {Component, Input, signal} from "@angular/core";
import {BookFormComponent} from './bookform/book-form.component';
import {AllBooksComponent} from './allbooks/all-books.component';
import {Book} from '../../inferfaces/book';


@Component
({
  selector: "app-Form-Firebase",
  templateUrl: "./form-firebase.component.html",
  imports: [
    BookFormComponent,
    AllBooksComponent
  ]
})

export class FormFirebaseComponent
{
  books = signal<Book[]>([]);
  AddBook(book: Book)
  {
    this.books.update(books => [...books, book]);
  }
}
