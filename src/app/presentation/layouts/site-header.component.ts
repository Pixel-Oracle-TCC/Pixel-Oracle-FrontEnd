import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="site-header">
      <div class="inner">
        <a class="brand" routerLink="/">
          <img src="assets/pixel-oracle-logo.svg" alt="" class="logo" width="34" height="34" />
          <span class="brand-name">PixelOracle</span>
        </a>
        <nav class="nav">
          <ng-content />
        </nav>
      </div>
    </header>
  `,
  styles: [
    `
      .site-header {
        position: sticky;
        top: 0;
        z-index: 50;
        background: rgba(8, 12, 20, 0.8);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border-bottom: 1px solid var(--border);
      }
      .inner {
        max-width: 1160px;
        margin: 0 auto;
        padding: 0 24px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        color: var(--text-primary);
      }
      .logo {
        display: block;
      }
      .brand-name {
        font-family: var(--font-display);
        font-weight: 600;
        font-size: 17px;
        letter-spacing: -0.3px;
      }
      .nav {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    `,
  ],
})
export class SiteHeaderComponent {
  readonly compact = input(false);
}
