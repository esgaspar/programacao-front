import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from './security/service/auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Observable } from "rxjs";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'programacao-front';
  isLoged = false;
  isLoged$: Observable<boolean | null>;


  constructor(private authService: AuthService) {
    this.isLoged$ = this.authService.getisUserLoggedIn();
  }
  ngOnInit(): void {
  }

  logout() {
    this.authService.logOut();
  }

}
