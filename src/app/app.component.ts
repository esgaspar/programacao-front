import { Component } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from './security/service/auth.service';
import { ColorSchemeService } from './service/color-scheme.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'programacao-front';
  isLoged = false;
  faCoffee = faCoffee


  constructor(private authService: AuthService, private colorSchemeService: ColorSchemeService) {
    this.colorSchemeService.load();


  }

  appId = 'dark-theme'; // default 
  switchTheme(appId: string) {
    this.appId = appId; // changing theme based on choice
  }

  logout() {
    this.authService.logOut();
  }

  get isUserLoggedIn() {
    let user = sessionStorage.getItem("user");
    return !(user === null);
  }

}
