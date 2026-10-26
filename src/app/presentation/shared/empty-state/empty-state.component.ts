import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <p class="empty-title">{{ title() }}</p>
      @if (description()) {
        <p class="empty-desc">{{ description() }}</p>
      }
    </div>
  `,
  styles: [
    `
      .empty-state {
        padding: 24px;
        border-radius: var(--radius-md);
        border: 1px dashed var(--border-strong);
        background: rgba(255, 255, 255, 0.02);
        text-align: center;
      }
      .empty-title {
        margin: 0;
        font-weight: 600;
        color: var(--text-primary);
      }
      .empty-desc {
        margin: 8px 0 0;
        font-size: 0.875rem;
        color: var(--text-secondary);
      }
    `,
  ],
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input<string>('');
}
