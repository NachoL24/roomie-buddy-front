import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService, Theme } from '@presentation/shared/services';

@Component({
  selector: 'app-theme-switcher',
  imports: [MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: "./theme-switcher.html",
  styleUrl: "./theme-switcher.scss"
})
export class ThemeSwitcherComponent {
  protected themeService = inject(ThemeService);

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  getCurrentThemeIcon(): string {
    const currentTheme = this.themeService.theme();
    const resolvedTheme = this.themeService.resolvedTheme();

    switch (currentTheme) {
      case 'light':
        return 'light_mode';
      case 'dark':
        return 'dark_mode';
      case 'system':
        return resolvedTheme === 'dark' ? 'dark_mode' : 'light_mode';
      default:
        return 'light_mode';
    }
  }

  getCurrentThemeLabel(): string {
    const currentTheme = this.themeService.theme();

    switch (currentTheme) {
      case 'light':
        return 'Tema claro';
      case 'dark':
        return 'Tema oscuro';
      case 'system':
        return 'Tema del sistema';
      default:
        return 'Tema claro';
    }
  }
}
