import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ColorSchemeService } from '../../service/color-scheme.service';

@Component({
  selector: 'app-setting-change-color-scheme',
  standalone: true,
  imports: [NgFor, NgIf, MatButtonModule, MatMenuModule, FaIconComponent],
  templateUrl: './setting-change-color-scheme.component.html',
  styleUrls: ['./setting-change-color-scheme.component.scss'],
})
export class SettingChangeColorSchemeComponent {
  public themes: { name: string; icon: any[] }[] = [
    { name: 'dark', icon: ['fas', 'moon-stars'] },
    { name: 'light', icon: ['fas', 'moon-stars'] },
  ];

  constructor(public colorSchemeService: ColorSchemeService) {}

  setTheme(theme: string) {
    this.colorSchemeService.update(theme);
  }
}

