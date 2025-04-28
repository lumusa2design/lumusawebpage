import {Component, input} from '@angular/core';
import {Book} from '../../../inferfaces/book';
import {BooksService} from '../../../services/books.service';

@Component({
  selector: 'allbooks',
  templateUrl: 'all-books.component.html',
})

export class AllBooksComponent
{
  books: Book[] = []
  constructor(private bookService: BooksService) {
  }

  ngOnInit()
  {
    this.bookService.getBooks().subscribe(books =>{this.books = books;});

  }

  async deleteBook(book: Book)
  {
    const response = await this.bookService.deleteBook(book);
  console.log(response);
  }
// books = input<Book[]>();

}
