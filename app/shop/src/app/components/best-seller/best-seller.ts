import { Component } from '@angular/core';

@Component({
  selector: 'app-best-sellers',
  standalone: true,
  template: `
    <main>
      <h2>Best Sellers</h2>
      <p>Hardcoded best sellers content.</p>
    </main>
  `,
  styleUrls: ['./best-seller.css']
})
export class BestSellersComponent {}