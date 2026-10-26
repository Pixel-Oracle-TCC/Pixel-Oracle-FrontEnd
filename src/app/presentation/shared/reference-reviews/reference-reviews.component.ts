import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';

import type { Highlight, ReferenceReviewsByGame } from '../../../domain/entities/full-report';
import { formatHoras, formatIdioma, formatPct, steamUrl } from '../format.util';

const LIMITE = 5;

@Component({
  selector: 'app-reference-reviews',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <div class="tabs">
      @for (group of groups(); track group.jogo.id; let i = $index) {
        <button type="button" [class.active]="i === index()" (click)="index.set(i)">
          {{ group.jogo.titulo }}
        </button>
      }
      @if (current(); as group) {
        @if (steamUrl(group.jogo.steam_appid); as url) {
          <a class="steam" [href]="url" target="_blank" rel="noopener noreferrer">Ver na Steam</a>
        }
      }
    </div>

    @if (pontos().length) {
      <div class="pontos">
        <p>Principais pontos encontrados nestas reviews</p>
        <ul>
          @for (ponto of pontos(); track ponto.rotulo) {
            <li [class.negativo]="ponto.polaridade === 'negativo'">
              {{ ponto.rotulo }}
              <span>em {{ formatPct(ponto.prevalencia) }} das reviews</span>
            </li>
          }
        </ul>
      </div>
    }

    @if (current(); as group) {
      <div class="sides">
        <section>
          <h4 class="side-title positiva">{{ positivas().length }} reviews positivas</h4>
          @if (positivas().length === 0) {
            <p class="none">Nenhuma review positiva de referência neste jogo.</p>
          } @else {
            <div class="cards">
              @for (review of positivas(); track review.review_id; let i = $index) {
                <ng-container *ngTemplateOutlet="card; context: { review: review, rank: i + 1 }" />
              }
            </div>
          }
        </section>
        <section>
          <h4 class="side-title negativa">{{ negativas().length }} reviews negativas</h4>
          @if (negativas().length === 0) {
            <p class="none">Nenhuma review negativa de referência neste jogo.</p>
          } @else {
            <div class="cards">
              @for (review of negativas(); track review.review_id; let i = $index) {
                <ng-container *ngTemplateOutlet="card; context: { review: review, rank: i + 1 }" />
              }
            </div>
          }
        </section>
      </div>
    }

    <ng-template #card let-review="review" let-rank="rank">
      <article>
        <p class="rank">{{ rank }}</p>
        <div>
          @if (pontosDaReview(review.review_id); as tags) {
            @if (tags.length) {
              <p class="tags">
                @for (tag of tags; track tag) {
                  <span>{{ tag }}</span>
                }
              </p>
            }
          }
          <p class="text">{{ review.texto }}</p>
          <p class="meta">
            {{ review.votos_uteis }} úteis · {{ formatHoras(review.horas_jogadas) }}
            @if (formatIdioma(review.idioma); as lang) {
              · {{ lang }}
            }
            @if (review.early_access) {
              · acesso antecipado
            }
          </p>
          @if (review.resposta_desenvolvedor) {
            <div class="reply">
              <p class="reply-label">Resposta do desenvolvedor</p>
              <p>{{ review.resposta_desenvolvedor }}</p>
            </div>
          }
        </div>
      </article>
    </ng-template>
  `,
  styles: `
    .tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
    button {
      background: transparent;
      color: var(--text-secondary);
      border: 1px solid var(--border);
      border-radius: 999px;
      padding: 6px 12px;
      cursor: pointer;
    }
    button.active {
      color: var(--text-primary);
      border-color: rgba(56, 189, 248, 0.45);
      background: rgba(56, 189, 248, 0.1);
    }
    .steam {
      margin-left: auto;
      color: var(--blue);
      font-size: 13px;
    }
    .pontos {
      margin-top: 16px;
    }
    .pontos p {
      margin: 0 0 8px;
      font-size: 13px;
      color: var(--text-secondary);
    }
    .pontos ul {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .pontos li {
      display: inline-flex;
      gap: 8px;
      align-items: baseline;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(52, 211, 153, 0.12);
      color: var(--green);
      font-size: 13px;
    }
    .pontos li.negativo {
      background: rgba(248, 113, 113, 0.12);
      color: var(--red);
    }
    .pontos span {
      color: var(--text-secondary);
      font-variant-numeric: tabular-nums;
    }
    .sides {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 18px;
    }
    .side-title {
      margin: 0 0 10px;
      font-size: 14px;
    }
    .side-title.positiva {
      color: var(--green);
    }
    .side-title.negativa {
      color: var(--red);
    }
    .cards {
      display: grid;
      gap: 10px;
    }
    article {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 10px;
      background: var(--bg-surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 14px;
    }
    .rank {
      margin: 0;
      width: 22px;
      color: var(--text-muted);
      font-variant-numeric: tabular-nums;
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin: 0 0 8px;
    }
    .tags span {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--blue-soft);
    }
    .text {
      margin: 0;
      line-height: 1.55;
    }
    .meta,
    .none {
      margin: 8px 0 0;
      font-size: 13px;
      color: var(--text-secondary);
    }
    .reply {
      margin-top: 12px;
      padding: 12px;
      border-radius: var(--radius-sm);
      background: rgba(129, 140, 248, 0.08);
      border: 1px solid rgba(129, 140, 248, 0.25);
    }
    .reply p {
      margin: 0;
      line-height: 1.5;
    }
    .reply-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--purple-soft);
      margin-bottom: 6px !important;
    }
    @media (max-width: 800px) {
      .sides {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class ReferenceReviewsComponent {
  readonly groups = input.required<ReferenceReviewsByGame[]>();
  readonly destaques = input<Highlight[]>([]);
  readonly index = signal(0);
  readonly formatHoras = formatHoras;
  readonly formatIdioma = formatIdioma;
  readonly formatPct = formatPct;
  readonly steamUrl = steamUrl;

  readonly current = computed(() => this.groups()[this.index()] ?? null);
  readonly positivas = computed(() => this.current()?.positivas.slice(0, LIMITE) ?? []);
  readonly negativas = computed(() => this.current()?.negativas.slice(0, LIMITE) ?? []);
  readonly pontos = computed(() => {
    const titulo = this.current()?.jogo.titulo;
    if (!titulo) {
      return [];
    }
    return this.destaques()
      .filter(
        (item) =>
          item.jogos_exemplo.some((game) => game.titulo === titulo) ||
          item.citacoes.some((quote) => quote.jogo === titulo),
      )
      .map((item) => ({
        rotulo: item.tema.rotulo,
        polaridade: item.tema.polaridade,
        prevalencia: item.metricas.prevalencia,
      }));
  });

  pontosDaReview(reviewId: number): string[] {
    return this.destaques()
      .filter((item) => item.citacoes.some((quote) => quote.review_id === reviewId))
      .map((item) => item.tema.rotulo);
  }
}
