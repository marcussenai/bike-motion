import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-card">
      <h2>Entrar no Bike Motion</h2>
      <form (ngSubmit)="onLogin()">
        <div class="form-group">
          <label for="login-name">Seu Nome</label>
          <input
            id="login-name"
            type="text"
            [(ngModel)]="name"
            name="name"
            required
            placeholder="Ex: João Silva"
          />
        </div>

        <div class="form-group">
          <label for="login-email">E-mail</label>
          <input
            id="login-email"
            type="email"
            [(ngModel)]="email"
            name="email"
            required
            placeholder="seu@email.com"
          />
        </div>

        <div class="form-group">
          <label for="login-password">Senha</label>
          <input
            id="login-password"
            type="password"
            [(ngModel)]="password"
            name="password"
            required
            placeholder="******"
          />
        </div>

        <button
          type="submit"
          class="btn-submit"
          [disabled]="!name.trim() || !email.trim() || !password.trim()"
        >
          Entrar
        </button>
      </form>
    </div>
  `,
  styles: [
    `
      .login-card {
        max-width: 400px;
        margin: 3rem auto;
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      h2 {
        margin-bottom: 1.5rem;
        text-align: center;
      }
      .form-group {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      input {
        padding: 0.6rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .btn-submit {
        width: 100%;
        padding: 0.75rem;
        background: #00d1b2;
        color: white;
        border: none;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
        margin-top: 1rem;
      }
      .btn-submit:disabled {
        background: #a0aec0;
        cursor: not-allowed;
      }
    `,
  ],
})
export class LoginComponent {
  name = '';
  email = '';
  password = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin() {
    const userDisplayName = this.name.trim() || this.email.trim();

    if (userDisplayName) {
      this.authService.login(userDisplayName);
      this.router.navigate(['/']);
    }
  }
}
