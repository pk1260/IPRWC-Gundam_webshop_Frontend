import {Component, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ApiService} from "../../shared/api.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent implements OnInit {
  name: string = '';
  description: string = '';
  price: number = 0;
  stock: number = 0;
  grade: string = '';
  uuid: string = '';

  constructor(
    public apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private route : ActivatedRoute
  ) {}

  ngOnInit() {
    this.uuid = this.route.snapshot.paramMap.get('uuid')!;
    this.loadProduct();
  }

  loadProduct() {
    this.apiService.getProductById(this.uuid).subscribe({
      next: (product) => {
        this.name = product.name;
        this.description = product.description;
        this.price = product.price;
        this.stock = product.stock;
        this.grade = product.grade;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.toastr.error('Failed to load product');
      }
    });
  }

  editProduct() {
    const productData = {
      name: this.name,
      description: this.description,
      price: this.price,
      stock: this.stock,
      grade: this.grade
    };

    this.apiService.editProduct(this.uuid, productData).subscribe({
      next: () => {
        this.toastr.success('Product updated successfully');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error updating product:', err);
        this.toastr.error('Failed to update product');
      }
    });
  }

  deleteProduct() {
    this.apiService.deleteProduct(this.uuid).subscribe({
      next: () => {
        this.toastr.success('Product deleted successfully');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error deleting product:', err);
        this.toastr.error('Failed to delete product');
      }
    });
  }
}
