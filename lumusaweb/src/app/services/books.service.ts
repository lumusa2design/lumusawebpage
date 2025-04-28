import { Injectable } from '@angular/core';
import {Firestore} from '@angular/fire/'
import firebase from 'firebase/compat';
import Firestore = firebase.firestore.Firestore;

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private firestore: Firestore) { }
}
