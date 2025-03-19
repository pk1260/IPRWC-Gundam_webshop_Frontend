import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  parseToken = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64));

    return JSON.parse(jsonPayload);
  };

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if(!token){
      return false;
    }

    return true;
  }

  public isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const claims = this.parseToken(token);
    return claims.role == 'ADMIN';
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public getToken() {
    return localStorage.getItem('token');
  }

  public logOut(){
    localStorage.clear()
  }
  public getUserId() {
    return localStorage.getItem('userId')

  }

}
