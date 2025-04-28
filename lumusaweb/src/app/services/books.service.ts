import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, deleteDoc } from '@angular/fire/firestore';
import { Book } from '../inferfaces/book';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private firestore: Firestore) { }

  async addBook(book: Book) {
    const bookRef = collection(this.firestore, 'books');
    return await addDoc(bookRef, book);
  }

  getBooks(): Observable<Book[]> {
    const bookRef = collection(this.firestore, 'books');
    return collectionData(bookRef, { idField: 'id' }) as Observable<Book[]>;
  }

  deleteBook(book: Book)
  {
    const bookRef = doc(this.firestore, `books/${book.id}`);
    return deleteDoc(bookRef)
  }
}
