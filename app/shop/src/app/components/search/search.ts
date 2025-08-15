import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Board {
  _id: string;
  title: string;
  description: string;
  upvotes: number;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <main>
      <div class="error" *ngIf="error">{{ error }}</div>

      <div class="search-controls">
        <input type="text" [(ngModel)]="searchQuery" placeholder="Search boards..." />
        <button class="button" (click)="searchBoards()">Search</button>
        <select [(ngModel)]="filter" class="button">
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
        </select>
      </div>

      <div *ngIf="boards.length === 0" class="empty">No boards found.</div>

      <div *ngFor="let board of boards" class="board-card">
        <h3>{{ board.title }}</h3>
        <p>{{ board.description }}</p>
        <p><strong>Upvotes:</strong> {{ board.upvotes }}</p>
        <a href="/products/{{ board._id }}/details" class="button">Details</a>
      </div>

      <div *ngIf="boards.length > 0" class="total">
        Total Boards: {{ boards.length }}
      </div>
    </main>
  `,
  styles: [`
    .search-controls {
      display: block; /* vertical stack */
      margin-bottom: 1rem;
    }

    .search-controls input,
    .search-controls button,
    .search-controls select {
      display: block;
      width: 100%;
      margin-bottom: 0.5rem;
    }

    .button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      background-color: #1976d2;
      color: white;
      cursor: pointer;
      font-weight: 500;
      text-decoration: none;
      display: inline-block;
      transition: background-color 0.2s;
    }
    .button:hover { background-color: #125ca1; }

    main {
      background: #ffffff;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      max-width: 900px;
      margin: 3rem auto;
      font-family: Arial, sans-serif;
    }

    input[type="text"], select {
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 1rem;
    }

    .board-card {
      background: #fefefe;
      border: 1px solid #e0e0e0;
      padding: 1.25rem;
      border-radius: 10px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.05);
      margin-bottom: 1rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .board-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(0,0,0,0.08);
    }

    .board-card h3 {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
      color: #333;
    }

    p {
      font-size: 1.1rem;
      margin: 0.4rem 0;
      color: #555;
    }

    .error {
      color: #d32f2f;
      font-weight: 500;
      margin-bottom: 1rem;
    }
    .empty {
      font-style: italic;
      color: #777;
      text-align: center;
      margin-top: 1rem;
    }

    .total {
      margin-top: 1.5rem;
      font-size: 1.3rem;
      font-weight: 600;
      text-align: right;
      color: #333;
    }
  `]
})
export class SearchComponent {
  searchQuery: string = '';
  filter: 'top' | 'bottom' = 'top';
  boards: Board[] = [];
  error: string = '';

  constructor(private http: HttpClient) {}

  searchBoards() {
    if (!this.searchQuery.trim()) {
      this.error = 'Please enter a search query.';
      this.boards = [];
      return;
    }

    this.error = '';
    this.http.post<any>('http://localhost:5000/catalog/search-products', {
      name: this.searchQuery
    }).subscribe({
      next: (res) => {
        let boards: Board[] = res.recievedData || [];

        if (this.filter === 'top') {
          boards.sort((a: Board, b: Board) => b.upvotes - a.upvotes);
        } else if (this.filter === 'bottom') {
          boards.sort((a: Board, b: Board) => a.upvotes - b.upvotes);
        }

        this.boards = boards;
      },
      error: () => {
        this.error = 'Failed to fetch boards. Try again.';
      }
    });
  }
}