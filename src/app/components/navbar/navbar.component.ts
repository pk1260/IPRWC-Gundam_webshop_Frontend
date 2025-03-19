import {Component, inject, OnInit} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";
import {AuthService} from "../shared/auth.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgClass,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  isMenuVisible = true;
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  auth = inject(AuthService);
  router = inject(Router);

  ngOnInit() {
    this.isAuthenticated = this.auth.isAuthenticated();
    this.isAdmin = this.auth.isAdmin();
  }

  toggleMenuVisibility() {
    console.log(this.isMenuVisible)
    this.isMenuVisible = !this.isMenuVisible;
  }

  signoutClick() {
    this.auth.logOut();
    this.router.navigate(['/login']);
  }
}
