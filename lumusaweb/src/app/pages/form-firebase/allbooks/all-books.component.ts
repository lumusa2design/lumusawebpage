import {Component, input} from '@angular/core';
import {Book} from '../../../inferfaces/book';
import {BooksService} from '../../../services/books.service';
import Swal from 'sweetalert2';
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

  async deleteBook(book: Book) {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres borrar el libro "${book.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, borrar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      await this.bookService.deleteBook(book);
      Swal.fire('¡Borrado!', 'El libro ha sido eliminado.', 'success');
    }
  }

  async updateBook(book: Book) {
    const { value: formValues } = await Swal.fire({
      title: 'Editar libro',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Título" value="${book.title}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Autor" value="${book.author}">`,
      focusConfirm: false,
      preConfirm: () => {
        return [
          (document.getElementById('swal-input1') as HTMLInputElement).value,
          (document.getElementById('swal-input2') as HTMLInputElement).value
        ];
      },
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar'
    });

    if (formValues) {
      const [newTitle, newAuthor] = formValues;
      book.title = newTitle;
      book.author = newAuthor;
      await this.bookService.updateBook(book);
      Swal.fire('¡Actualizado!', 'El libro ha sido actualizado.', 'success');
    }
  }
// books = input<Book[]>();

}
