import {Component, input} from '@angular/core';
import {Book} from '../../../inferfaces/book';

@Component({
  selector: 'allbooks',
  templateUrl: 'all-books.component.html',
})

export class AllBooksComponent
{
books = input<Book[]>();
}
