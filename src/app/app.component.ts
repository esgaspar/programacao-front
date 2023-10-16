import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { AuthService } from './security/service/auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Observable } from "rxjs";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'programacao-front';
  isLoged = false;


  constructor(private authService: AuthService) {

  }

  logout() {
    this.authService.logOut();
  }

  get isUserLoggedIn() {
    let user = sessionStorage.getItem("user");
    return !(user === null);
  }

}
