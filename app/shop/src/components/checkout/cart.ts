import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <main>
      <h2>Your Cart</h2>
      <div *ngIf="loading" class="spinner"></div>
      <div *ngIf="!loading && boards.length === 0" class="empty">Your cart is empty.</div>

      <div *ngFor="let board of boards" class="board-card">
        <h3>{{ board.title }}</h3>
        <p><strong>Owner:</strong> {{ board.owner }}</p>
        <p><strong>Price:</strong> {{ board.price }} euros</p>
        <button class="button" (click)="viewBoard(board._id)">View</button>
        <button class="button" (click)="removeBoard(board._id)">Remove</button>
      </div>

      <div *ngIf="boards.length > 0" class="total">
        <h3>Total: {{ totalPrice }} euros</h3>
        <button class="button">Checkout</button>
      </div>
    </main>
  `,
  styles: [`
    .button {
      margin-right: 0.5rem;
      padding: 0.25rem 0.75rem;
      border: none;
      border-radius: 4px;
      background-color: #1976d2;
      color: white;
      cursor: pointer;
    }
    .button:hover { background-color: #125ca1; }
    main {
      background: #fff;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.07);
      max-width: 900px;
      margin: 2rem auto;
    }
    p { font-size: 1.1rem; margin: 0.5rem 0; }
    .board-card {
      background: #f8f9fa;
      border: 1px solid #ddd;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      margin-bottom: 1rem;
    }
    .board-card h3 { font-size: 1.2rem; margin-bottom: 0.5rem; }
    .error { color: red; margin-bottom: 1rem; }
    .empty { font-style: italic; color: #777; }
    .total { margin-top: 1rem; font-size: 1.3rem; }
  `]
})
export class CartComponent implements OnInit {
  boards: any[] = [];
  loading = true;
  userId: string = '';

  get totalPrice(): number {
    return this.boards.reduce((sum, b) => sum + Number(b.price || 0), 0);
  }

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user?._id || '';
    this.http.get<any>(`http://localhost:5000/catalog/${this.userId}/cart`).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.boards = res.boards || [];
        } else {
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  viewBoard(boardId: string) {
    window.location.href = `/products/${boardId}/details`;
  }

  removeBoard(boardId: string) {
  this.http.post<any>(
    `http://localhost:5000/catalog/${boardId}/${this.userId}/cart-remove`,
    {}
  ).subscribe({
    next: (res) => {
      if (res.status === 200) {
        this.boards = this.boards.filter(b => b._id !== boardId);
      }
    }
  });
}
}