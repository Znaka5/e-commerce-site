import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-logout',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    template: ``
})
export class logoutComponent implements OnInit {
    constructor( private router: Router ) { }

    ngOnInit(): void {
        localStorage.removeItem("user")
        this.router.navigate(['/']);
    }
}