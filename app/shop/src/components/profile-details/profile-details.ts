import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

interface User {
  username: string;
  email: string;
  phoneNumber?: string;
  _id: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf],
  template: `
    <main *ngIf="user; else noUser">
      <h2>Profile</h2>
      <div class="profile-details">
        <div class="profile-info">
          <div class="info">
            <p><strong>Username:</strong> {{ user.username }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p *ngIf="user.phoneNumber"><strong>Phone:</strong> {{ user.phoneNumber }}</p>
          </div>
        </div>
        <a class="edit-button" href="/profile/{{ user._id }}/edit">Edit Profile</a>
      </div>
    </main>

    <ng-template #noUser>
      <main>
        <p>No user logged in.</p>
      </main>
    </ng-template>
  `,
  styleUrls: ['./profile-details.css']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
      } catch {
        this.user = null;
      }
    }
  }
}