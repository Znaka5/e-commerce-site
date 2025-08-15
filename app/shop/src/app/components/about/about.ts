import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <main>
      <h2>About ITEMS 4 TRADE</h2>
      <p>
        Welcome to ITEMS 4 TRADE! We are your one-stop platform for discovering, sharing,
        and trading the best products online. Our goal is to make product browsing and
        trading simple, fun, and safe for everyone.
      </p>
      <p>
        Whether you're looking for trending items or want to showcase your own products,
        ITEMS 4 TRADE has you covered!
      </p>
      <p class="empty">
        Explore our catalog and start trading today!
      </p>

      <a routerLink="/" class="button">Back to Home</a>
    </main>
  `,
  styles: [`
    main {
      padding: 2rem;
      background: #fafafa;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      max-width: 800px;
      margin: 3rem auto;
      font-family: Arial, sans-serif;
      text-align: center;
    }

    h2 {
      color: #1976d2;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1.1rem;
      color: #555;
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .empty {
      color: #999;
      font-style: italic;
      margin-top: 2rem;
    }

    .button {
      display: inline-block;
      margin-top: 2rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      background-color: #1976d2;
      color: white;
      cursor: pointer;
      text-decoration: none;
      transition: background-color 0.2s;
    }

    .button:hover {
      background-color: #125ca1;
    }
  `]
})
export class AboutComponent {}
