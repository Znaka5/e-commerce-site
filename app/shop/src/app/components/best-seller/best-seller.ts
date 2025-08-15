import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-best-sellers',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <main>
      <h2>Best Sellers</h2>

      <div *ngIf="loading" class="spinner"></div>
      <div *ngIf="error" class="error">{{ error }}</div>
      <div *ngIf="!loading && boards.length === 0" class="empty">No boards found.</div>

      <div *ngFor="let board of boards" class="board-card">
        <h3>{{ board.title }}</h3>
        <p><strong>Ratings:</strong> {{ board.upvotes }}</p>
        <p><strong>Owner:</strong> {{ board.owner }}</p>

        <a href="/products/{{ board._id }}/details" class="button">Details</a>
      </div>
    </main>
  `,
  styleUrls: ['./best-seller.css']
})
export class BestSellersComponent implements OnInit {
  boards: any[] = [];
  loading = true;
  error: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get<{ message: any[] }>('http://localhost:5000/catalog/best-sellers').pipe(
      map(res => res.message),
      catchError(err => {
        this.error = 'Failed to load boards.';
        this.loading = false;
        return of([]); // fallback value
      })
    ).subscribe((boards) => {
      this.boards = boards;
      this.loading = false;
    });
  }
}
