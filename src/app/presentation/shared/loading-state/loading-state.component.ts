import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  template: `
    <div class="loading" role="status" aria-live="polite">
      <div class="spinner" aria-hidden="true"></div>
      <p class="loading-title">{{ title() }}</p>
      @if (subtitle()) {
        <p class="loading-sub">{{ subtitle() }}</p>
      }
    </div>
  `,
  styles: [
    `
      .loading {
        display: grid;
        place-items: center;
        gap: 12px;
        padding: 48px 24px;
        text-align: center;
      }
      .spinner {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid rgba(56, 189, 248, 0.2);
        border-top-color: var(--blue);
        animation: spin 0.9s linear infinite;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .loading-title {
        margin: 0;
        font-weight: 600;
        font-size: 1.05rem;
      }
      .loading-sub {
        margin: 0;
        color: var(--text-secondary);
        font-size: 0.875rem;
        max-width: 360px;
      }
    `,
  ],
})
export class LoadingStateComponent {
  readonly title = input('Buscando jogos parecidos e reviews…');
  readonly subtitle = input(
    'A primeira chamada real pode passar de 30 segundos enquanto o modelo de embedding carrega.',
  );
}
