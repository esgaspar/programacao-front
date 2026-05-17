import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../security/service/auth.service';

@Component({
    selector: 'app-menu',
    imports: [RouterLink, RouterLinkActive, MatDividerModule, FaIconComponent],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss',
})
export class MenuComponent {
  @Output() onSelect = new EventEmitter<string>();

  constructor(public authService: AuthService) {}
}
