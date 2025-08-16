import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanRate implements CanActivate {

  constructor(
    private router: Router,
    private http: HttpClient
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const result$ = new Subject<boolean>();

    const user = localStorage.getItem("user") || '{}'
    const userObj = JSON.parse(user)
    const user_id = userObj._id

    const id = route.paramMap.get('id')

    if (!id || !user_id) {
      this.router.navigate(['/404'])
      result$.next(false)
      result$.complete()
      return result$
    }

    this.http.get<{ status: number, bool: boolean }>(
      `http://localhost:5000/catalog/${id}/${user_id}/isCreator`
    ).subscribe({
      next: res => {
        if (res.bool) {
            this.router.navigate(['/404'])
          result$.next(false)
        } else {
          result$.next(true)
        }
        result$.complete()
      },
      error: err => {
        this.router.navigate(['/404'])
        result$.next(false)
        result$.complete()
      }
    });

    return result$;
  }
}