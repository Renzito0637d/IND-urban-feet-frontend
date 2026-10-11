import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

type ThemeMode = 'system' | 'light' | 'dark';

@Component({
  selector: 'app-themetoggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './themetoggle.component.html',
  styleUrl: './themetoggle.component.css'
})
export class ThemetoggleComponent implements OnInit {
  mode: ThemeMode = 'system';   // preferencia guardada: system/light/dark
  isDark = false;               // estado efectivo resultante

  ngOnInit() {
    const saved = (localStorage.getItem('themeMode') as ThemeMode) ?? 'system';
    this.applyTheme(saved);
  }

  // Alterna entre light y dark; (si quieres, añade un 3er botón para 'system')
  toggleTheme() {
    const next = this.isDark ? 'light' : 'dark';
    this.applyTheme(next as ThemeMode);
  }

  setSystem() {
    this.applyTheme('system');
  }

  private applyTheme(mode: ThemeMode) {
    this.mode = mode;
    localStorage.setItem('themeMode', mode);

    const html = document.documentElement;

    // 1) Angular Material (color-scheme) mediante data-theme
    if (mode === 'system') {
      html.removeAttribute('data-theme');       // vuelve a color-scheme: light dark (defecto del SCSS)
      html.style.removeProperty('color-scheme');
    } else {
      html.setAttribute('data-theme', mode);
      html.style.setProperty('color-scheme', mode); // fuerza light/dark
    }

    // 2) Calcular si el efectivo es dark (para Tailwind 'dark' class)
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    this.isDark = mode === 'dark' || (mode === 'system' && prefersDark);

    // 3) Tailwind dark class
    html.classList.toggle('dark', this.isDark);
  }
}