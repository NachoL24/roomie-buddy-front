import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);

  private _theme = signal<Theme>('system');
  readonly theme = this._theme.asReadonly();
  readonly resolvedTheme = signal<'light' | 'dark'>('light');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        this._theme.set(savedTheme);
      }
      this.updateResolvedTheme();

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        if (this._theme() === 'system') {
          this.updateResolvedTheme();
        }
      });
    }

    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const resolvedTheme = this.resolvedTheme();
        document.documentElement.setAttribute('data-theme', resolvedTheme);
        document.documentElement.classList.toggle('dark-mode', resolvedTheme === 'dark');
        // document.documentElement.classList.toggle('light-theme', resolvedTheme === 'light');
        localStorage.setItem('theme', this._theme());
      }
    });
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);
    this.updateResolvedTheme();
  }

  private updateResolvedTheme(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const currentTheme = this._theme();

    if (currentTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.resolvedTheme.set(prefersDark ? 'dark' : 'light');
    } else {
      this.resolvedTheme.set(currentTheme);
    }
  }

  getSystemTheme(): 'light' | 'dark' {
    if (!isPlatformBrowser(this.platformId)) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
