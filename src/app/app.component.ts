import { NgClass } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MenuComponent } from './menu/menu.component';
import { AuthService } from './security/service/auth.service';
import { ColorSchemeService } from './service/color-scheme.service';
import { SettingChangeColorSchemeComponent } from './settings/setting-change-color-scheme/setting-change-color-scheme.component';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        MatSidenavModule,
        MatButtonModule,
        MatDividerModule,
        NgClass,
        FaIconComponent,
        MenuComponent,
        SettingChangeColorSchemeComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
  private authService = inject(AuthService);
  private colorSchemeService = inject(ColorSchemeService);

  title = 'programacao-front';
  appId = 'dark-theme';
  isUserLoggedIn = computed(() => this.authService.isLoggedIn());

  constructor() {
    this.colorSchemeService.load();
  }

  switchTheme(appId: string) {
    this.appId = appId;
  }

  logout() {
    this.authService.logOut();
  }
}
