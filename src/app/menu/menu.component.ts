import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../security/service/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, MatToolbarModule, FaIconComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  @Output() onSelect = new EventEmitter<string>();

  constructor(public authService: AuthService) {}
}

