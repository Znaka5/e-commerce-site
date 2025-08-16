import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <main>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <a href="/catalog" class="button">Go to Catalog</a>
    </main>
  `,
  styles: [`
    main {
      max-width: 600px;
      margin: 3rem auto;
      text-align: center;
      padding: 2rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.07);
    }
    .button {
      background: #1976d2;
      color: white;
      padding: 0.6rem 1.2rem;
      border-radius: 4px;
      text-decoration: none;
      display: inline-block;
      margin-top: 1rem;
      cursor: pointer;
    }
    .button:hover {
      background: #1565c0;
    }
  `]
})

export class NotFoundComponent {}
