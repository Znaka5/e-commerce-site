import { Component } from '@angular/core';

@Component({
  selector: 'app-catalog',
  standalone: true,
  template: `
    <main>
      <h2>Catalog</h2>
      <p>Hardcoded catalog content.</p>
    </main>
  `,
  styleUrls: ['./catalog.css']
})
export class CatalogComponent {}