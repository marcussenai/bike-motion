import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_KEY_USER = 'bike_motion_current_user';

  currentUser = signal<string | null>(localStorage.getItem(this.STORAGE_KEY_USER));

  login(userDisplayName: string) {
    if (!userDisplayName) return;
    this.currentUser.set(userDisplayName);
    localStorage.setItem(this.STORAGE_KEY_USER, userDisplayName);
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem(this.STORAGE_KEY_USER);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}
