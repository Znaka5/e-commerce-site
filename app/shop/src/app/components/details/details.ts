import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
  <main *ngIf="!loading && board">
  <img *ngIf="board.img" [src]="board.img" alt="{{ board.title }}" class="board-image" />

  <h2>{{ board.title }}</h2>

  <p><strong>Owner:</strong> {{ board.owner }}</p>
  <p><strong>Price:</strong> {{ board.price }} euros</p>
  <p><strong>Ratings:</strong> {{ board.upvotes }}</p>

  <ng-container *ngIf="board.owner_id === currentUserId">
    <a href="/products/{{ board._id }}/edit" class="button">Edit</a>
    <a href="/products/{{ board._id }}/delete" class="button">Delete</a>
  </ng-container>

  <ng-container *ngIf="currentUserId !== board.owner_id && currentUserId !== ''">
    <a href="/products/{{ board._id }}/rate" class="button">Rate</a>
  </ng-container>

  <ng-container *ngIf="currentUserId !== board.owner_id && currentUserId !== '' && ordered !== true">
    <a href="/products/{{ board._id }}/order" class="button">Order</a>
  </ng-container>
  </main>

    <section class="ratings-box-wrapper" *ngIf="!loading">
      <div class="ratings-box">
        <h3>Customer Ratings</h3>
        <ul *ngIf="ratings.length > 0; else noRatings">
          <li *ngFor="let rating of board.comments">
             {{ rating.score }} - {{ rating.comment }}
          </li>
        </ul>
        <ng-template #noRatings>
          <p class="no-ratings">No ratings present.</p>
        </ng-template>
      </div>
    </section>

    <div *ngIf="loading" class="spinner">Loading...</div>
    <div *ngIf="error" class="error">{{ error }}</div>
  `,
  styleUrls: ['./details.css']
})
export class DetailsComponent implements OnInit {
  board: any;
  ratings: any[] = [];
  loading: boolean = true;
  error: string = '';
  ordered: boolean = false;
  currentUserId: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUserId = user?._id || '';

    const id = this.route.snapshot.paramMap.get('id');

    this.http.get<any>(`http://localhost:5000/catalog/${id}/details`).subscribe({
      next: (res) => {
        this.board = res.message;
        this.loading = false;
        this.fetchRatings();
      },
      error: () => {
        this.error = 'Failed to load board details.';
        this.loading = false;
        this.fetchRatings();
      }
    });

    if (user._id !== undefined) {
      this.http.get<any>(`http://localhost:5000/catalog/${id}/${user._id}/ordered`).subscribe({
      next: (res) => {
        this.ordered = res.bool
      },
      error: () => {
        this.ordered = false
      }
    });
    }
  }

  fetchRatings() { //Max stars are 5 ---------------------------------------------------------------↓
    this.ratings = this.board.comments.map((a: any) => a.score = '⭐'.repeat(a.score) + '★'.repeat(5 - a.score))
  }
}