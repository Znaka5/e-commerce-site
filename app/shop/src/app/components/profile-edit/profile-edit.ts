import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="form-container" *ngIf="user">
      <h2>Edit Profile</h2>

      <div class="form-group">
        <label>Username:</label>
        <input type="text" formControlName="username" />
        <div class="error" *ngIf="username.invalid && (username.dirty || username.touched)">
          Username must be at least 4 characters.
        </div>
      </div>

      <div class="form-group">
        <label>Email:</label>
        <input type="email" formControlName="email" />
        <div class="error" *ngIf="email.invalid && (email.dirty || email.touched)">
          Email must be at least 10 characters.
        </div>
      </div>

      <div class="form-group">
        <label>Password:</label>
        <input type="password" formControlName="password" />
        <div class="error" *ngIf="password.invalid && (password.dirty || password.touched)">
          Password must be at least 4 characters.
        </div>
      </div>

      <div class="form-group">
        <label>Phone Number:</label>
        <input type="tel" formControlName="phoneNumber" />
        <div class="error" *ngIf="phoneNumber.invalid && (phoneNumber.dirty || phoneNumber.touched)">
          Phone number must be at least 8 characters (if provided).
        </div>
      </div>

      <button type="submit" [disabled]="profileForm.invalid">Save Changes</button>

      <p class="success" *ngIf="successMessage">{{ successMessage }}</p>
      <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
    </form>

    <main *ngIf="!user" class="form-container">
      <p>No user data available to edit.</p>
    </main>
  `,
  styleUrls: ['./profile-edit.css']
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: any = null;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      phoneNumber: ['', [this.optionalMinLength(8)]]
    });
  }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
        this.profileForm.patchValue({
          username: this.user.username,
          email: this.user.email,
          phoneNumber: this.user.phoneNumber || ''
        });
      } catch {
        this.user = null;
      }
    }
  }

  optionalMinLength(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      return value.length >= min ? null : { minlength: { requiredLength: min, actualLength: value.length } };
    };
  }

  get username() { return this.profileForm.get('username')!; }
  get email() { return this.profileForm.get('email')!; }
  get password() { return this.profileForm.get('password')!; }
  get phoneNumber() { return this.profileForm.get('phoneNumber')!; }

  onSubmit() {
    if (this.profileForm.valid) {
      const updatedData = {
        _id: this.user._id,
        ...this.profileForm.value
      };

      this.http.post('http://localhost:5000/users/profile-edit', updatedData)
        .subscribe({
          next: () => {
            this.successMessage = 'Profile updated successfully!';
            this.errorMessage = '';
            localStorage.setItem('user', JSON.stringify(updatedData));
            
             setTimeout(() => {
              this.router.navigate(['/']);
            }, 1000) //return to the main menu
          },
          error: () => {
            this.successMessage = '';
            this.errorMessage = 'Failed to update profile. Please try again.';
          }
        });
    }
  }
}
