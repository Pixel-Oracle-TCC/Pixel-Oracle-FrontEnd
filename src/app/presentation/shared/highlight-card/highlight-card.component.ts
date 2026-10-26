import { Component, input, signal } from '@angular/core';

import type { Highlight } from '../../../domain/entities/full-report';
import { formatHoras, formatPct } from '../format.util';

@Component({
  selector: 'app-highlight-card',
  standalone: true,
  template: `
    <article class="card" [class.elogio]="tone() === 'elogio'" [class.reclamacao]="tone() === 'reclamacao'">
      <p class="frase">{{ frase() }}</p>
      <div class="chips">
        <span class="chip tema">{{ highlight().tema.rotulo }}</span>
        <span class="chip">{{ highlight().tema.categoria }}</span>
        <span class="chip">{{ escopoLabel() }}</span>
        @if (highlight().metricas.significativo) {
          <span class="chip sig" title="O ponto aparece em jogos diferentes o bastante para não ser um acaso da amostra.">
            o padrão se repete
          </span>
        }
      </div>
      <ul class="metrics">
        <li>
          <strong>{{ highlight().metricas.reviews_com_tema }} de {{ highlight().metricas.total_reviews }} reviews</strong>
          mencionam este ponto ({{ formatPct(highlight().metricas.prevalencia) }} das {{ amostra() }}).
          A faixa provável fica entre {{ formatPct(highlight().metricas.wilson_low) }} e
          {{ formatPct(highlight().metricas.wilson_high) }}.
        </li>
        <li>
          Isso aparece em
          <strong>{{ highlight().metricas.jogos_distintos }} dos {{ highlight().metricas.total_jogos }} jogos</strong>
          comparados, não num jogo só.
        </li>
        <li>
          Essas reviews somam
          <strong>{{ highlight().metricas.votos_uteis.toLocaleString('pt-BR') }} marcações de útil</strong>.
        </li>
      </ul>
      @if (highlight().jogos_exemplo.length) {
        <div class="examples">
          @for (game of highlight().jogos_exemplo; track game.game_id) {
            <span class="example">{{ game.titulo }}</span>
          }
        </div>
      }
      @if (highlight().citacoes.length) {
        <button type="button" class="toggle" (click)="open.set(!open())">
          {{ open() ? 'Ocultar citações' : 'Ver citações' }}
        </button>
        @if (open()) {
          <ul class="quotes">
            @for (quote of highlight().citacoes; track quote.review_id) {
              <li>
                <blockquote>“{{ quote.trecho }}”</blockquote>
                <p class="quote-meta">
                  {{ quote.jogo }} · {{ quote.votos_uteis }} úteis · {{ formatHoras(quote.horas_jogadas) }}
                </p>
              </li>
            }
          </ul>
        }
      }
    </article>
  `,
  styles: `
    .card {
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 18px 18px 14px;
      display: grid;
      gap: 12px;
    }
    .elogio {
      border-top: 3px solid var(--green);
    }
    .reclamacao {
      border-top: 3px solid var(--red);
    }
    .frase {
      margin: 0;
      font-size: 15px;
      line-height: 1.55;
    }
    .chips,
    .examples {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .chip,
    .example {
      font-size: 12px;
      padding: 3px 8px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-secondary);
    }
    .tema {
      color: var(--text-primary);
    }
    .sig {
      color: var(--teal);
      background: rgba(45, 212, 191, 0.12);
    }
    .metrics {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 8px;
    }
    .metrics li {
      margin: 0;
      font-size: 14px;
      line-height: 1.45;
      color: var(--text-secondary);
    }
    .metrics strong {
      color: var(--text-primary);
      font-variant-numeric: tabular-nums;
    }
    .toggle {
      justify-self: start;
      background: transparent;
      border: none;
      color: var(--blue);
      padding: 0;
      cursor: pointer;
      font-size: 13px;
    }
    .quotes {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 10px;
    }
    blockquote {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
      color: var(--text-primary);
    }
    .quote-meta {
      margin: 4px 0 0;
      font-size: 12px;
      color: var(--text-secondary);
    }
  `,
})
export class HighlightCardComponent {
  readonly highlight = input.required<Highlight>();
  readonly frase = input.required<string>();
  readonly tone = input<'elogio' | 'reclamacao'>('elogio');
  readonly open = signal(false);
  readonly formatPct = formatPct;
  readonly formatHoras = formatHoras;

  escopoLabel(): string {
    const item = this.highlight();
    return item.escopo === 'genero' ? `gênero ${item.genero ?? ''}`.trim() : 'jogos parecidos';
  }

  amostra(): string {
    const item = this.highlight();
    return item.escopo === 'genero'
      ? `reviews do gênero ${item.genero ?? ''}`.trim()
      : 'reviews dos jogos parecidos';
  }
}
