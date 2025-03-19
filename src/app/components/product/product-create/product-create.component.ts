import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../shared/api.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "../../shared/auth.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css'
})
export class ProductCreateComponent implements OnInit {
  name: string = '';
  description: string = '';
  price: number = 0;
  stock: number = 0;
  grade: string = 'HIGH_GRADE';
  image: string = '';

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.toastr.error('Access denied');
      this.router.navigate(['/']);
    }
  }

  createProduct() {
    if (!this.name || !this.description || !this.price || !this.stock || !this.grade || !this.image) {
      this.toastr.error('All fields are required');
      return;
    }

    const productData = {
      name: this.name,
      description: this.description,
      price: this.price,
      stock: this.stock,
      grade: this.grade,
      image: this.image
    };

    this.apiService.createProduct(productData).subscribe({
      next: () => {
        this.toastr.success('Product created successfully');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error creating product:', err);
        this.toastr.error('Failed to create product');
      }
    });
  }
}
