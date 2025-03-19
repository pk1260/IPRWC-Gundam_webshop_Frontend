import {Component, OnInit} from '@angular/core';
import {CartItem} from "../../cart-item";
import {CartService} from "../shared/cart.service";
import {ToastrService} from "ngx-toastr";
import {NgFor, NgIf} from "@angular/common";
import {Product} from "../../product.model";
import {Router} from "@angular/router";
import {AuthService} from "../shared/auth.service";

interface Cart {
  id: string;
  cartItems: (CartItem & { product: Product })[];
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  cart: Cart = { id: '', cartItems: [] };

  constructor(private cartService: CartService, private toastr: ToastrService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.toastr.warning('You need to be logged in', 'Warning');
      this.router.navigate(['/login']);
    } else {
      this.loadCart();
    }
  }

  loadCart() {
    this.cartService.getCartWithProductDetails().subscribe(
      (data: Cart) => {
        this.cart = data;
      },
      (error: any) => {
        console.error('Error fetching cart data', error);
      }
    );
  }

  removeItem(cartItemId: string) {
    this.cartService.removeItemFromCart(cartItemId).subscribe({
      next: () => {
        this.toastr.success('Item removed from cart', 'Success');
        this.loadCart(); // Reload the cart to reflect the changes
      },
      error: (error) => {
        console.error('Error removing item from cart:', error);
        this.toastr.error('Failed to remove item from cart', 'Error');
      }
    });
  }

  increaseQuantity(item: CartItem) {
    item.quantity++;
    this.updateCartItem(item);
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCartItem(item);
    }
  }

  updateCartItem(item: CartItem) {
    // Call the service to update the cart item quantity
    this.cartService.updateCartItem(item).subscribe({
      next: () => {
        this.toastr.success('Cart updated', 'Success');
        this.loadCart(); // Reload the cart to reflect the changes
      },
      error: (error) => {
        console.error('Error updating cart item:', error);
        this.toastr.error('Failed to update cart item', 'Error');
      }
    });
  }

  orderItems() {
    this.cartService.orderItems().subscribe({
      next: () => {
        this.toastr.success('Order placed successfully', 'Success');
        this.loadCart(); // Reload the cart to reflect the changes
      },
      error: (error) => {
        console.error('Error placing order:', error);
        if (error.status === 400 && error.error && error.error.message) {
          if (error.error.message.includes('is out of stock')) {
            this.toastr.error('Product is out of stock', 'Error');
          } else {
            this.toastr.error(error.error.message, 'Error');
          }
        } else {
          this.toastr.error('Failed to place order', 'Error');
        }
      }
    });
  }

  getTotalPrice(): number {
    return parseFloat(this.cart.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2));
  }
}
