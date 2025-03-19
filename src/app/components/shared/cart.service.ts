import {Injectable} from "@angular/core";
import {Product} from "../../product.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {forkJoin, Observable, switchMap} from "rxjs";
import {AuthService} from "./auth.service";
import {ApiService} from "./api.service";
import {map} from "rxjs";
import {CartItem} from "../../cart-item";

const API_URL = 'http://localhost:8080/api/v1';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private http: HttpClient, private apiService: ApiService, private authService: AuthService) {}

  getCartFromUser(): Observable<{ id: string; cartItems: CartItem[] }> {
    const userId = localStorage.getItem('userId');
    return this.http.get<{ id: string; cartItems: CartItem[] }>(`http://localhost:8080/api/v1/cart/${userId}`);
  }

  getCartWithProductDetails(): Observable<{ id: string; cartItems: (CartItem & { product: Product })[] }> {
    return this.getCartFromUser().pipe(
      switchMap((cart) => {
        const productDetails$ = cart.cartItems.map(item =>
          this.apiService.getProductById(item.productId).pipe(
            map(product => ({
              ...item,
              product
            }))
          )
        );
        return forkJoin(productDetails$).pipe(
          map(cartItems => ({
            id: cart.id,
            cartItems
          }))
        );
      })
    );
  }

  removeItemFromCart(cartItemId: string): Observable<void> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID is missing');
    }
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { cartItemId };
    return this.http.request<void>('post', `${API_URL}/cart/remove/${userId}`, { headers, body });
  }

  updateCartItem(cartItem: CartItem): Observable<void> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID is missing');
    }
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { cartItemId: cartItem.id, quantity: cartItem.quantity };
    return this.http.put<void>(`${API_URL}/cart/update-quantity/${userId}`, body, { headers });
  }

  orderItems(): Observable<void> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID is missing');
    }
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<void>(`${API_URL}/cart/order/${userId}`, {}, { headers });
  }
}
