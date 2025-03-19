import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {map, tap} from "rxjs";
import {object, z} from "zod";
import {CartPayload} from "../../cart-payload";

const API_URL = 'http://localhost:8080/api/v1';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  PostLogin(payload: { username: string; password: string }) {
    return this.http.post(`${API_URL}/auth/login`, payload).pipe(
      map((data) => {
        return z
          .object({
            token: z.string(),
            username: z.string(),
            role: z.string(),
            id: z.string()
          })
          .parse(data);
      }),
      tap((data) => {
        this.authService.setToken(data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        localStorage.setItem('userId', data.id)
      })
    );
  }

  PostRegister(payload: {username: string, password: string}) {
    return this.http.post(`${API_URL}/auth/register`, payload).pipe(
    );
  }

  getAllProducts() {
    return this.http.get(`${API_URL}/products`).pipe(
      map((data) => {
        return z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            price: z.number(),
            grade: z.string(),
            stock: z.number(),
            image: z.string()
          })
        ).parse(data);
      })
    );
  }

  getProductById(uuid: string) {
    return this.http.get(`${API_URL}/products/details/${uuid}`).pipe(
      map((data) => {
        return z.object({
          id: z.string(),
          image: z.string(),
          name: z.string(),
          description: z.string(),
          price: z.number(),
          stock: z.number(),
          grade: z.string()
        }).parse(data);
      })
    );
  }

  createProduct(payload: { name: string; description: string; price: number; stock: number; grade: string }) {
    let token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const productList = [payload]; // Wrap the single product in a list
    return this.http
      .post(`${API_URL}/products`, productList, {
        headers: headers,
        observe: 'response',
      });
  }

  editProduct(uuid: string, payload: { name: string; description: string; price: number; stock: number; grade: string; }) {
    let token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${API_URL}/products/${uuid}`, payload, {
      headers: headers,
      observe: 'response'
    });
  }

  deleteProduct(uuid: string) {
    let token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${API_URL}/products/${uuid}`, {
      headers: headers,
      observe: 'response'
    });
  }

  addItemToCart(uuid: string, cartItems: CartPayload) {
    let token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .post(`${API_URL}/cart/save/${uuid}`, cartItems, {
        headers: headers,
        observe: 'response',
      })
  }
}
