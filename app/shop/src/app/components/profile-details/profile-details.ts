import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <main>
      <h2>Profile</h2>
      <div class="profile-details">
        <div class="profile-info">
          <img class="profile-picture" src="https://via.placeholder.com/100" alt="Profile Picture" />
          <div class="info">
            <p><strong>Name:</strong> John Doe</p>
            <p><strong>Email:</strong> john@example.com</p>
          </div>
        </div>
        <button class="edit-button">Edit Profile</button>
      </div>
    </main>
  `,
  styleUrls: ['./profile-details.css']
})
export class ProfileComponent {}