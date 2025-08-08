import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-board',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="form-container">
      <h2>Create Board</h2>

      <form [formGroup]="boardForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title</label>
          <input id="title" type="text" formControlName="title">
          <div class="error" *ngIf="f['title'].touched && f['title'].invalid">
            <span *ngIf="f['title'].errors?.['required']">Title is required.</span>
            <span *ngIf="f['title'].errors?.['minlength']">Title must be at least 3 characters.</span>
          </div>
        </div>

        <div class="form-group">
          <label for="img">Image URL</label>
          <input id="img" type="text" formControlName="img">
        </div>

        <button type="submit" [disabled]="boardForm.invalid">Create</button>
      </form>

      <div class="success" *ngIf="successMessage">{{ successMessage }}</div>
      <div class="error" *ngIf="errorMessage">{{ errorMessage }}</div>
    </div>
  `,
  styles: [`
    .form-container {
        max-width: 400px;
        margin: 2rem auto;
        padding: 2rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
        font-family: Arial, sans-serif;
    }
    h2 { text-align: center; margin-bottom: 1.5rem; }
    .form-group { margin-bottom: 1.2rem; }
    label { display: block; margin-bottom: 0.4rem; font-weight: bold; }
    input { width: 100%; padding: 0.5rem; border: 1px solid #aaa; border-radius: 4px; font-size: 1rem; }
    input.ng-invalid.ng-touched { border-color: #e74c3c; }
    .error { color: #e74c3c; font-size: 0.85rem; margin-top: 0.3rem; }
    .success { color: #2ecc71; font-size: 0.9rem; margin-top: 1rem; text-align: center; }
    button { width: 100%; padding: 0.7rem; font-size: 1rem; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; transition: background-color 0.3s ease; }
    button:disabled { background-color: #ccc; cursor: not-allowed; }
    button:not(:disabled):hover { background-color: #0056b3; }
  `]
})
export class CreateComponent implements OnInit {
  boardForm: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.boardForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      img: ['']
    });
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user._id) {
      this.errorMessage = 'User not found. Please log in.';
    }
  }

  onSubmit() {
    if (this.boardForm.invalid) {
      this.boardForm.markAllAsTouched();
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user._id) {
      this.errorMessage = 'User not found. Please log in.';
      return;
    }

    const payload = {
      title: this.boardForm.value.title,
      img: this.boardForm.value.img,
      upvotes: 0,
      comments: [],
      upvoted: [],
      owner: user.username || user.name || '',
      owner_id: user._id
    };

    this.successMessage = '';
    this.errorMessage = '';

    this.http.post('http://localhost:5000/users/create', payload)
      .subscribe({
        next: (res: any) => {
          if (res.status === 201) {
            this.successMessage = 'Board created successfully!';
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 1000);
          } else {
            this.errorMessage = 'Error creating board.';
          }
        },
        error: () => {
          this.errorMessage = 'Server error. Please try again.';
        }
      });
  }

  get f() {
    return this.boardForm.controls;
  }
}