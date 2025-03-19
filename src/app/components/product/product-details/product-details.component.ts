import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {ApiService} from "../../shared/api.service";
import {AuthService} from "../../shared/auth.service";
import {ToastrService} from "ngx-toastr";
import {Product} from "../../../product.model";
import {Subscription} from "rxjs";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  private uuid: string = "";
  public product!: Product;
  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.uuid = params['uuid'];
      this.apiService.getProductById(this.uuid).subscribe({
        next: (data) => {
          this.product = data;
        },
        error: (err) => {
          console.error('Error fetching product details:', err);
          this.toastr.error('Failed to load product details');
        }
      });
    });
  }

  addToCart() {
    if (!this.authService.isAuthenticated()) {
      this.toastr.warning('You need to be logged in', 'Warning');
      this.router.navigate(['/login']);
    } else {
      const cartPayload = { productId: this.product.id, quantity: 1 };
      const userId = localStorage.getItem('userId');
      if (userId) {
        this.apiService.addItemToCart(userId, cartPayload).subscribe({
          next: () => {
            this.toastr.success('Item added to cart', 'Success');
          },
          error: (error) => {
            console.error('Error adding item to cart:', error);
            this.toastr.error('Failed to add item to cart', 'Error');
          }
        });
      }
    }
  }
}
