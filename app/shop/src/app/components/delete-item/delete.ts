import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-board',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div>
      <h2>Delete Board</h2>
      <p *ngIf="successMessage" style="color: green">{{ successMessage }}</p>
      <p *ngIf="errorMessage" style="color: red">{{ errorMessage }}</p>
      <p *ngIf="!successMessage && !errorMessage">
        Are you sure you want to delete this board?
      </p>
      <button (click)="onDelete()" [disabled]="loading">Delete</button>
      <button (click)="onCancel()" [disabled]="loading">Cancel</button>
    </div>
  `,
  styles: [`
    div {
      max-width: 400px;
      margin: 2rem auto;
      font-family: Arial, sans-serif;
      padding: 1.5rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      background-color: #fff8f8;
      text-align: center;
    }
    h2 {
      margin-bottom: 1.5rem;
      color: #e74c3c;
    }
    p {
      font-size: 1rem;
      margin: 1rem 0;
    }
    button {
      margin: 0.5rem 0.5rem 0 0.5rem;
      padding: 0.6rem 1.2rem;
      font-size: 1rem;
      border-radius: 5px;
      border: none;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    button:not(:disabled) {
      background-color: #e74c3c;
      color: white;
    }
    button:not(:disabled):hover {
      background-color: #c0392b;
    }
  `]
})
export class DeleteComponent implements OnInit {
  boardId!: string;
  successMessage: string = '';
  errorMessage: string = '';
  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.boardId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.boardId) {
      this.errorMessage = 'Invalid board ID.';
    }
  }

  onDelete() {
    if (!this.boardId) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http.get(`http://localhost:5000/catalog/${this.boardId}/delete`, { observe: 'response' })
      .subscribe({
        next: (resp) => {
          if (resp.status === 200) {
            this.successMessage = 'Board deleted successfully!';
            this.errorMessage = '';
            setTimeout(() => this.router.navigate(['/catalog']), 1000);
          } else {
            this.errorMessage = 'Error deleting board.';
            this.successMessage = '';
          }
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = 'Server error. Please try again.';
          this.successMessage = '';
 
        }
      });
  }

  onCancel() {
    this.router.navigate(['/catalog']);
  }
}