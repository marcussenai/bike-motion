import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CouponService } from '../../../core/services/coupon.service';
import { Coupon } from '../../../core/models/coupon.model';

@Component({
  selector: 'app-coupon-management',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="coupon-container">
      <h2>🎟️ Gerenciamento de Cupons</h2>

      <form (ngSubmit)="saveCoupon()" class="coupon-form">
        <h3>{{ editingId() ? 'Editar Cupom' : 'Criar Novo Cupom' }}</h3>

        <div class="form-grid">
          <div class="form-group">
            <label for="code">Código/Nome do Cupom</label>
            <input
              type="text"
              id="code"
              [(ngModel)]="code"
              name="code"
              placeholder="Ex: PEDALAR20"
              required
            />
          </div>

          <div class="form-group">
            <label for="discount">Desconto (%)</label>
            <input
              type="number"
              id="discount"
              [(ngModel)]="discountPercent"
              name="discountPercent"
              min="1"
              max="100"
              placeholder="Ex: 20"
              required
            />
          </div>

          <div class="form-group">
            <label for="maxUsage">Qtd. Máxima de Usos</label>
            <input
              type="number"
              id="maxUsage"
              [(ngModel)]="maxUsage"
              name="maxUsage"
              min="1"
              placeholder="Ex: 100"
              required
            />
          </div>

          <div class="form-group checkbox-group">
            <label>
              <input type="checkbox" [(ngModel)]="active" name="active" />
              Cupom Ativo
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            {{ editingId() ? 'Salvar Alterações' : 'Criar Cupom' }}
          </button>
          @if (editingId()) {
            <button type="button" (click)="resetForm()" class="btn btn-secondary">Cancelar</button>
          }
        </div>
      </form>

      <div class="table-container">
        <h3>Cupons Cadastrados</h3>
        <table class="coupon-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Desconto</th>
              <th>Uso (Atual / Máx)</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (coupon of couponService.coupons(); track coupon.id) {
              <tr>
                <td>
                  <strong>{{ coupon.code }}</strong>
                </td>
                <td>{{ coupon.discountPercent }}%</td>
                <td>
                  <span [class.limit-reached]="coupon.usedCount >= coupon.maxUsage">
                    {{ coupon.usedCount }} / {{ coupon.maxUsage }}
                  </span>
                </td>
                <td>
                  <span
                    class="status-badge"
                    [class.active]="coupon.active"
                    [class.inactive]="!coupon.active"
                  >
                    {{ coupon.active ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td class="actions">
                  <button (click)="editCoupon(coupon)" class="btn-icon edit" title="Editar">
                    ✏️
                  </button>
                  <button (click)="deleteCoupon(coupon.id)" class="btn-icon delete" title="Excluir">
                    🗑️
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" class="empty-message">Nenhum cupom cadastrado.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [
    `
      .coupon-container {
        background: #ffffff;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        border: 1px solid #e2e8f0;
        margin-top: 1rem;
      }

      h2,
      h3 {
        color: #1a202c;
        margin-bottom: 1rem;
      }

      .coupon-form {
        background: #f8fafc;
        padding: 1.25rem;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        margin-bottom: 2rem;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
        align-items: end;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }

      .form-group label {
        font-size: 0.85rem;
        font-weight: 600;
        color: #4a5568;
      }

      .form-group input[type='text'],
      .form-group input[type='number'] {
        padding: 0.5rem 0.75rem;
        border: 1px solid #cbd5e0;
        border-radius: 6px;
        font-size: 0.95rem;
        outline: none;
      }

      .form-group input:focus {
        border-color: #00d1b2;
      }

      .checkbox-group {
        justify-content: center;
        padding-bottom: 0.5rem;
      }

      .checkbox-group label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
      }

      .form-actions {
        margin-top: 1.25rem;
        display: flex;
        gap: 0.8rem;
      }

      .btn {
        padding: 0.5rem 1.2rem;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: background 0.2s;
      }

      .btn-primary {
        background-color: #00d1b2;
        color: #ffffff;
      }

      .btn-primary:hover {
        background-color: #00b89f;
      }

      .btn-secondary {
        background-color: #e2e8f0;
        color: #4a5568;
      }

      .btn-secondary:hover {
        background-color: #cbd5e0;
      }

      .table-container {
        overflow-x: auto;
      }

      .coupon-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
      }

      .coupon-table th,
      .coupon-table td {
        padding: 0.8rem;
        border-bottom: 1px solid #e2e8f0;
      }

      .coupon-table th {
        background: #f7fafc;
        color: #4a5568;
        font-size: 0.85rem;
      }

      .status-badge {
        padding: 0.2rem 0.6rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
      }

      .status-badge.active {
        background: #c6f6d5;
        color: #22543d;
      }

      .status-badge.inactive {
        background: #fed7d7;
        color: #742a2a;
      }

      .limit-reached {
        color: #e53e3e;
        font-weight: bold;
      }

      .actions {
        display: flex;
        gap: 0.5rem;
      }

      .btn-icon {
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 1.1rem;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
      }

      .btn-icon:hover {
        background: #edf2f7;
      }

      .empty-message {
        text-align: center;
        color: #a0aec0;
        padding: 1.5rem;
      }
    `,
  ],
})
export class CouponManagementComponent {
  couponService = inject(CouponService);

  editingId = signal<string | null>(null);
  code = '';
  discountPercent: number | null = null;
  maxUsage: number | null = null;
  active = true;

  saveCoupon() {
    if (!this.code || !this.discountPercent || !this.maxUsage) return;

    if (this.editingId()) {
      this.couponService.updateCoupon(this.editingId()!, {
        code: this.code,
        discountPercent: this.discountPercent,
        maxUsage: this.maxUsage,
        active: this.active,
      });
    } else {
      this.couponService.addCoupon({
        code: this.code,
        discountPercent: this.discountPercent,
        maxUsage: this.maxUsage,
        active: this.active,
      });
    }

    this.resetForm();
  }

  editCoupon(coupon: Coupon) {
    this.editingId.set(coupon.id);
    this.code = coupon.code;
    this.discountPercent = coupon.discountPercent;
    this.maxUsage = coupon.maxUsage;
    this.active = coupon.active;
  }

  deleteCoupon(id: string) {
    if (confirm('Tem certeza que deseja excluir este cupom?')) {
      this.couponService.deleteCoupon(id);
      if (this.editingId() === id) {
        this.resetForm();
      }
    }
  }

  resetForm() {
    this.editingId.set(null);
    this.code = '';
    this.discountPercent = null;
    this.maxUsage = null;
    this.active = true;
  }
}
