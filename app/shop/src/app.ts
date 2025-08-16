import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  isLoggedIn = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateLoginStatus();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLoginStatus();
    });
  }

  updateLoginStatus() {
    this.isLoggedIn = !!localStorage.getItem('user');
  }
}
