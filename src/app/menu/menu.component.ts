import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../security/service/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],

})
export class MenuComponent {
  @Output() onSelect = new EventEmitter<String>();

  authService: AuthService

  constructor(authService: AuthService){
    this.authService = authService;
  }

  // get isLoged(){
  //   return this.authService.isUserLoggedIn();
  // }
}
