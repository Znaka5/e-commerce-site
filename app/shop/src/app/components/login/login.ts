import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  template: `
    <main>
      <h2>Login</h2>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div *ngIf="showFormError" class="form-error">
          <p>Please fill all required fields correctly.</p>
        </div>

        <input type="text" placeholder="Username" formControlName="username" />
        <div *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
          <small>Username must be at least 4 characters.</small>
        </div>

        <input type="email" placeholder="Email" formControlName="email" />
        <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
          <small>Valid email is required.</small>
        </div>

        <input type="password" placeholder="Password" formControlName="password" />
        <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
          <small>Password must be at least 6 characters.</small>
        </div>

        <input type="submit" value="Login" />
      </form>

      <div *ngIf="errorMessage" class="error">
        <p>{{ errorMessage }}</p>
      </div>
    </main>
  `,
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  showFormError = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.showFormError = true;
      this.markAllFieldsAsTouched();
      return;
    }

    this.showFormError = false;
    const loginData = this.loginForm.value;

    this.http.post<any>('http://localhost:5000/users/login', loginData, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: (response) => {
        if (response.status === 200) {
          localStorage.setItem('user', JSON.stringify(response.obj));
          this.router.navigate(['/']);
        } else {
          this.errorMessage = response.message || 'Login failed.';
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        this.errorMessage = err.error?.message || 'Server error. Cannot login.';
      }
    });
  }

  private markAllFieldsAsTouched(): void {
    Object.values(this.loginForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}