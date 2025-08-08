import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="form-container">
      <h2>Edit Product</h2>

      <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
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

        <button type="submit" [disabled]="productForm.invalid">Update</button>
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
export class EditComponent implements OnInit {
  productForm: FormGroup;
  successMessage = '';
  errorMessage = '';
  productId!: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      img: ['']
    });
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user._id) {
      this.errorMessage = 'User not found. Please log in.';
      return;
    }

    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.productId) {
      this.errorMessage = 'Invalid product ID.';
      return;
    }

    this.http.get(`http://localhost:5000/catalog/${this.productId}/details`)
      .subscribe({
        next: (product: any) => {
          this.productForm.patchValue({
            title: product.message.title,
            img: product.message.img
          });
        },
        error: () => {
          this.errorMessage = 'Error fetching product details.';
        }
      });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const payload = {
      title: this.productForm.value.title,
      img: this.productForm.value.img
    };

    this.successMessage = '';
    this.errorMessage = '';

    this.http.post(`http://localhost:5000/catalog/${this.productId}/edit`, payload)
      .subscribe({
        next: (res: any) => {
          if (res.status === 201) {
            this.successMessage = 'Product updated successfully!';
            setTimeout(() => {
              this.router.navigate(['/catalog']);
            }, 1000);
          } else {
            this.errorMessage = 'Error updating product.';
          }
        },
        error: () => {
          this.errorMessage = 'Server error. Please try again.';
        }
      });
  }

  get f() {
    return this.productForm.controls;
  }
}