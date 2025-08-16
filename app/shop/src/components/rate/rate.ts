import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rate',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  template: `
    <main>
      <h2>Rate Product</h2>

      <form [formGroup]="rateForm" (ngSubmit)="onSubmit()">
        <div *ngIf="showFormError" class="form-error">
          <p>Please fill all required fields correctly.</p>
        </div>

        <!-- Rating -->
        <input 
          type="number" 
          placeholder="Rating (1-5)" 
          formControlName="score" 
          min="1" 
          max="5"
        />
        <div *ngIf="rateForm.get('score')?.invalid && rateForm.get('score')?.touched">
          <small>Rating must be between 1 and 5.</small>
        </div>

        <!-- Comment -->
        <textarea 
          placeholder="Write your comment..." 
          formControlName="comment"
          rows="4"
        ></textarea>
        <div *ngIf="rateForm.get('comment')?.invalid && rateForm.get('comment')?.touched">
          <small>Comment must be at least 5 characters.</small>
        </div>

        <input type="submit" value="Submit Rating" />
      </form>

      <div *ngIf="errorMessage" class="error">
        <p>{{ errorMessage }}</p>
      </div>
    </main>
  `,
  styleUrls: ['./rate.css']
})
export class RateComponent {
  rateForm: FormGroup;
  errorMessage: string = '';
  showFormError: boolean = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.rateForm = this.fb.group({
      score: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
  }

  onSubmit(): void {
    if (this.rateForm.invalid) {
      this.showFormError = true;
      this.markAllFieldsAsTouched();
      return;
    }

    this.showFormError = false;

    const ratingData = {
      ...this.rateForm.value,
      productId: this.productId,
      userId: JSON.parse(localStorage.getItem('user') || '{}')._id
    };

    this.http.post<any>(`http://localhost:5000/catalog/${this.productId}/ratings`, ratingData, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.router.navigate([`/products/${this.productId}/details`]);
        } else {
          this.errorMessage = response.message || 'Rating failed.';
        }
      },
      error: (err) => {
        console.error('Rating error:', err);
        this.errorMessage = err.error?.message || 'Server error. Cannot submit rating.';
      }
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.values(this.rateForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
