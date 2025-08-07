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
      <h2>{{ board.title }}</h2>

      <p><strong>Description:</strong> {{ board.description }}</p>
      <p><strong>Owner:</strong> {{ board.owner }}</p>
      <p><strong>Upvotes:</strong> {{ board.upvotes }}</p>

      <a href="/products/{{ board._id }}/edit" class="button">Edit</a>
      <a href="/products/{{ board._id }}/delete" class="button">Delete</a>
    </main>

    <div *ngIf="loading" class="spinner">Loading...</div>
    <div *ngIf="error" class="error">{{ error }}</div>
  `,
  styleUrls: ['./details.css']
})
export class DetailsComponent implements OnInit {
  board: any;
  loading = true;
  error = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.http.get<any>(`http://localhost:5000/catalog/${id}/details`).subscribe({
      next: (res) => {
        this.board = res.message;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load board details.';
        this.loading = false;
      }
    });
  }
}