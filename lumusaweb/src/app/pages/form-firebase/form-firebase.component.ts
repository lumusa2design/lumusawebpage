import {Component, Input} from "@angular/core";
import {BookFormComponent} from './bookform/book-form.component';
import {AllBooksComponent} from './allbooks/all-books.component';


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

}
