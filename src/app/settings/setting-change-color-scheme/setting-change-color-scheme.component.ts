import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { IconName, IconPrefix } from '@fortawesome/free-solid-svg-icons';
import { ColorSchemeService } from 'src/app/service/color-scheme.service';

@Component({
    selector: 'app-setting-change-color-scheme',
    templateUrl: './setting-change-color-scheme.component.html',
    styleUrls: ['./setting-change-color-scheme.component.scss']
})

export class SettingChangeColorSchemeComponent {
    public themes: { name: string, icon: any[] }[] = [
        {
            name: 'dark',
            icon: ['fas', 'moon-stars']
        },
        {
            name: 'light',
            icon: ['fas', 'moon-stars']
        }
    ];

    constructor(public colorSchemeService: ColorSchemeService) {

    }

    setTheme(theme: string) {
        this.colorSchemeService.update(theme);
    }

}
