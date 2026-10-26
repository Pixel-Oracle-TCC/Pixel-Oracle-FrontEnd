import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-api-banner',
  standalone: true,
  template: `
    @if (message()) {
      <div
        class="banner"
        [class.tone-warning]="tone() === 'warning'"
        [class.tone-error]="tone() === 'error'"
        [class.tone-info]="tone() === 'info'"
        role="alert"
      >
        <span>{{ message() }}</span>
        @if (dismissible()) {
          <button type="button" class="dismiss" (click)="dismiss.emit()" aria-label="Fechar">
            ×
          </button>
        }
      </div>
    }
  `,
  styles: [
    `
      .banner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 16px;
        border-radius: var(--radius-sm);
        font-size: 0.875rem;
        border: 1px solid transparent;
      }
      .tone-warning {
        background: rgba(251, 191, 36, 0.12);
        border-color: rgba(251, 191, 36, 0.35);
        color: var(--amber);
      }
      .tone-error {
        background: rgba(248, 113, 113, 0.12);
        border-color: rgba(248, 113, 113, 0.35);
        color: var(--red);
      }
      .tone-info {
        background: rgba(56, 189, 248, 0.1);
        border-color: rgba(56, 189, 248, 0.3);
        color: var(--blue-soft);
      }
      .dismiss {
        background: transparent;
        border: none;
        color: inherit;
        font-size: 1.25rem;
        cursor: pointer;
        line-height: 1;
        opacity: 0.8;
      }
    `,
  ],
})
export class ApiBannerComponent {
  readonly message = input<string | null>(null);
  readonly tone = input<'warning' | 'error' | 'info'>('warning');
  readonly dismissible = input(false);
  readonly dismiss = output<void>();
}
