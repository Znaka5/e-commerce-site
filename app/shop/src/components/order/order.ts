import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-logout',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    template: `
    <main>
      <h2>Your order has been made</h2>
      <p *ngIf="orderMade" class="successful-order">This item has been successfuly added to your Cart</p>
      <p *ngIf="!orderMade" class="unsuccessful-order">This item has not been successfuly added to your Cart</p>
      <a href="/products/cart" class="button">Go to Cart</a>
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
    .successful-order { color: #2ecc71; font-size: 1rem; margin-top: 1rem; text-align: center; }
    .unsuccessful-order {
       color: red;
       font-weight: 500;
       text-align: center;
    }
  `]
})
export class orderComponent implements OnInit {
    board: any;
    orderMade: boolean = false;
    constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        this.http.get<any>(`http://localhost:5000/catalog/${id}/details`).subscribe({
            next: (res) => {
                this.board = res.message;
                this.board.upvoted.push(user._id)

                this.http.post(`http://localhost:5000/catalog/${id}/order`, this.board).subscribe({
                    
                    next: (res: any) => {
                        console.log(res.status)
                        if (res.status === 200) {
                            this.orderMade = true
                            setTimeout(() => {
                                this.router.navigate(['/']);
                            }, 1500);
                        } else {
                            setTimeout(() => {
                                this.router.navigate(['/']);
                            }, 1500);
                        }
                    }
                });
            }
        });
    }
}