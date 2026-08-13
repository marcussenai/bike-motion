import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BikeService, Bike } from '../../core/services/bike.service';
import { CouponManagementComponent } from './coupon-management/coupon-management.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, CouponManagementComponent],
  template: `
    <div class="admin-container">
      <h2>Painel de Administração</h2>

      <div class="admin-tabs">
        <button
          class="tab-btn"
          [class.active]="activeTab === 'stock'"
          (click)="activeTab = 'stock'"
        >
          📦 Gestão de Estoque
        </button>
        <button
          class="tab-btn"
          [class.active]="activeTab === 'coupons'"
          (click)="activeTab = 'coupons'"
        >
          🎟️ Gestão de Cupons
        </button>
      </div>

      @if (activeTab === 'stock') {
        <div class="form-card">
          <h3>{{ editingId ? 'Editar Produto' : 'Adicionar Novo Produto' }}</h3>

          <form (ngSubmit)="saveBike()" #bikeForm="ngForm" class="admin-form">
            <div class="form-grid">
              <div class="form-group">
                <label for="admin-bike-name">Nome:</label>
                <input
                  id="admin-bike-name"
                  type="text"
                  [(ngModel)]="formData.name"
                  name="name"
                  required
                  class="input-field"
                />
              </div>

              <div class="form-group">
                <label for="admin-bike-brand">Marca:</label>
                <input
                  id="admin-bike-brand"
                  type="text"
                  [(ngModel)]="formData.brand"
                  name="brand"
                  required
                  class="input-field"
                />
              </div>

              <div class="form-group">
                <label for="admin-bike-category">Categoria:</label>
                <input
                  id="admin-bike-category"
                  type="text"
                  [(ngModel)]="formData.category"
                  name="category"
                  required
                  class="input-field"
                />
              </div>

              <div class="form-group">
                <label for="admin-bike-price">Preço (R$):</label>
                <input
                  id="admin-bike-price"
                  type="number"
                  step="0.01"
                  [(ngModel)]="formData.price"
                  name="price"
                  required
                  class="input-field"
                />
              </div>

              <div class="form-group">
                <label for="admin-bike-stock">Estoque Inicial:</label>
                <input
                  id="admin-bike-stock"
                  type="number"
                  [(ngModel)]="formData.stock"
                  name="stock"
                  required
                  class="input-field"
                />
              </div>

              <div class="form-group full-width">
                <label for="admin-bike-image">URL da Imagem:</label>
                <input
                  id="admin-bike-image"
                  type="url"
                  [(ngModel)]="formData.imageUrl"
                  name="imageUrl"
                  required
                  class="input-field"
                />
              </div>

              <div class="form-group full-width">
                <label for="admin-bike-desc">Descrição:</label>
                <textarea
                  id="admin-bike-desc"
                  [(ngModel)]="formData.description"
                  name="description"
                  rows="3"
                  required
                  class="input-field"
                ></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" [disabled]="!bikeForm.form.valid" class="btn-save">
                {{ editingId ? 'Atualizar' : 'Cadastrar' }}
              </button>
              @if (editingId) {
                <button type="button" (click)="resetForm()" class="btn-cancel">Cancelar</button>
              }
            </div>
          </form>
        </div>

        <div class="table-card">
          <h3>Produtos em Estoque</h3>

          <table class="stock-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Imagem</th>
                <th>Nome</th>
                <th>Marca</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              @for (bike of bikeService.getBikes(); track bike.id) {
                <tr>
                  <td>#{{ bike.id }}</td>
                  <td>
                    <img [src]="bike.imageUrl" [alt]="bike.name" class="thumb-img" />
                  </td>
                  <td>
                    <strong>{{ bike.name }}</strong>
                  </td>
                  <td>{{ bike.brand }}</td>
                  <td>R$ {{ bike.price.toFixed(2) }}</td>
                  <td>
                    <span class="stock-badge" [class.out]="bike.stock <= 0">
                      {{ bike.stock }} unid.
                    </span>
                  </td>
                  <td class="action-buttons">
                    <button (click)="editBike(bike)" class="btn-edit">Editar</button>
                    <button (click)="deleteBike(bike.id)" class="btn-delete">Excluir</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }

      @if (activeTab === 'coupons') {
        <app-coupon-management></app-coupon-management>
      }
    </div>
  `,
  styles: [
    `
      .admin-container {
        max-width: 1100px;
        margin: 2rem auto;
        padding: 0 1rem;
      }
      h2 {
        font-size: 1.6rem;
        color: #1a1a1a;
        margin-bottom: 1.5rem;
      }

      .admin-tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 0.5rem;
      }
      .tab-btn {
        padding: 0.6rem 1.2rem;
        background: transparent;
        border: none;
        border-radius: 8px;
        font-weight: 700;
        font-size: 0.95rem;
        color: #718096;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .tab-btn:hover {
        color: #1a202c;
        background: #f7fafc;
      }
      .tab-btn.active {
        background: #00d1b2;
        color: #ffffff;
      }

      .form-card,
      .table-card {
        background: #fff;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        margin-bottom: 2rem;
        border: 1px solid #f0f0f0;
      }
      h3 {
        font-size: 1.2rem;
        color: #2d3748;
        margin-bottom: 1rem;
      }
      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }
      .full-width {
        grid-column: 1 / -1;
      }
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }
      .form-group label {
        font-size: 0.85rem;
        font-weight: 600;
        color: #4a5568;
      }
      .input-field {
        padding: 0.6rem;
        border: 1px solid #cbd5e0;
        border-radius: 6px;
        font-size: 0.9rem;
      }
      .form-actions {
        margin-top: 1rem;
        display: flex;
        gap: 0.5rem;
      }
      .btn-save {
        background: #00d1b2;
        color: white;
        border: none;
        padding: 0.6rem 1.2rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
      }
      .btn-save:disabled {
        background: #cbd5e0;
        cursor: not-allowed;
      }
      .btn-cancel {
        background: #e2e8f0;
        color: #4a5568;
        border: none;
        padding: 0.6rem 1.2rem;
        border-radius: 6px;
        cursor: pointer;
      }
      .stock-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
      }
      .stock-table th,
      .stock-table td {
        text-align: left;
        padding: 0.75rem;
        border-bottom: 1px solid #edf2f7;
        font-size: 0.9rem;
      }
      .stock-table th {
        background: #f7fafc;
        color: #4a5568;
      }
      .thumb-img {
        width: 45px;
        height: 45px;
        object-fit: contain;
        border-radius: 4px;
      }
      .stock-badge {
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        background: #e6fffa;
        color: #047857;
        font-weight: bold;
        font-size: 0.8rem;
      }
      .stock-badge.out {
        background: #ffe4e6;
        color: #e11d48;
      }
      .action-buttons {
        display: flex;
        gap: 0.4rem;
      }
      .btn-edit {
        background: #3182ce;
        color: white;
        border: none;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
      }
      .btn-delete {
        background: #e53e3e;
        color: white;
        border: none;
        padding: 0.4rem 0.8rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.8rem;
      }
    `,
  ],
})
export class AdminComponent {
  bikeService = inject(BikeService);

  activeTab: 'stock' | 'coupons' = 'stock';
  editingId: number | null = null;

  formData: Omit<Bike, 'id'> = {
    name: '',
    brand: '',
    category: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
  };

  saveBike() {
    if (this.editingId !== null) {
      this.bikeService.updateBike({
        id: this.editingId,
        ...this.formData,
      });
    } else {
      this.bikeService.addBike(this.formData);
    }
    this.resetForm();
  }

  editBike(bike: Bike) {
    this.editingId = bike.id;
    this.formData = {
      name: bike.name,
      brand: bike.brand,
      category: bike.category,
      description: bike.description,
      price: bike.price,
      stock: bike.stock,
      imageUrl: bike.imageUrl,
    };
  }

  deleteBike(id: number) {
    if (confirm('Deseja realmente remover este item do estoque?')) {
      this.bikeService.deleteBike(id);
    }
  }

  resetForm() {
    this.editingId = null;
    this.formData = {
      name: '',
      brand: '',
      category: '',
      description: '',
      price: 0,
      stock: 0,
      imageUrl: '',
    };
  }
}
