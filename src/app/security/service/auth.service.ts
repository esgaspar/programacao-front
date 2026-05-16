import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export class User {
  constructor(public status: string) {}
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _isLoggedIn = signal<boolean>(!!sessionStorage.getItem('user'));
  readonly isLoggedIn = this._isLoggedIn.asReadonly();

  constructor(private httpClient: HttpClient, private router: Router) {}

  authenticate(username: string, password: string) {
    return this.httpClient
      .post<any>(environment.apiUrl + 'login', { username, password })
      .pipe(
        map(userData => {
          sessionStorage.setItem('user', JSON.stringify(userData.user));
          sessionStorage.setItem('token', 'Bearer ' + userData.token.token);
          this._isLoggedIn.set(true);
          return userData;
        }),
      );
  }

  logOut() {
    this._isLoggedIn.set(false);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
