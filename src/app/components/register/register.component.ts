import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ApiService} from "../shared/api.service";
import {Toast, ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username: string = ""
  password: string = ""
  constructor(private apiService: ApiService, private toastr: ToastrService, private router: Router) {
  }

  submitRegister(){
    this.apiService.PostRegister({ username: this.username,  password: this.password }).subscribe({
      next: (data) => {
        this.toastr.success('Register successful', 'Success');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Invalid username or password', 'Error');
      },
    })
  }
}
