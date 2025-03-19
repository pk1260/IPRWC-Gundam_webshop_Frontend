import {Component, ChangeDetectorRef} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {Router, RouterLink} from "@angular/router";
import {ApiService} from "../shared/api.service";
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoggedIn = false;
  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  submitLogin() {
    this.apiService
      .PostLogin({ username: this.username, password: this.password })
      .subscribe({
        next: (data) => {
          this.toastr.success('Login successful', 'Success');
          this.isLoggedIn = true;
          this.cdr.detectChanges();
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.toastr.error('Invalid username or password', 'Error');
        },
      });
  }
}
