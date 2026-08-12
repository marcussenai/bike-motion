import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = signal<boolean>(false);
  currentUser = signal<string | null>(null);

  login(email?: string) {
    this.isLoggedIn.set(true);
    if (email) {
      this.currentUser.set(email);
    }
  }

  logout() {
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
  }
}