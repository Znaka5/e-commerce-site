import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  template: `
    <main>
      <h2>Register</h2>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div *ngIf="showFormError" class="form-error">
          <p>All fields are required and must be valid.</p>
        </div>

        <input type="text" placeholder="Username" formControlName="username" />
        <div *ngIf="registerForm.get('username')?.invalid && registerForm.get('username')?.touched">
          <small>Username is required.</small>
        </div>

        <input type="email" placeholder="Email" formControlName="email" />
        <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
          <small>Valid email is required.</small>
        </div>

        <input type="password" placeholder="Password" formControlName="password" />
        <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
          <small>Password must be at least 6 characters.</small>
        </div>

        <input type="text" placeholder="Phone Number" formControlName="phoneNumber" />
        <div *ngIf="registerForm.get('phoneNumber')?.invalid && registerForm.get('phoneNumber')?.touched">
          <small>Phone number must be at least 8 digits.</small>
        </div>

        <input type="submit" value="Register" />
      </form>

      <div *ngIf="errorMessage" class="error">
        <p>{{ errorMessage }}</p>
      </div>
    </main>
  `,
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  showFormError = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.showFormError = true;
      this.markAllFieldsAsTouched();
      return;
    }

    this.showFormError = false;
    const userData = this.registerForm.value;

    this.http.post<any>('http://localhost:5000/users/register', userData, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: (response) => {
        if (response.status === 200) {
          localStorage.setItem('user', JSON.stringify(response.recievedData));
          this.router.navigate(['/']);
        } else {
          this.errorMessage = response.message || 'Registration failed.';
        }
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.errorMessage = err.error?.message || 'Server error. Cannot register.';
      }
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.values(this.registerForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}