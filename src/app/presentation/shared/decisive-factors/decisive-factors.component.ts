import { Component, input } from '@angular/core';

import type { DecisiveFactor } from '../../../domain/entities/full-report';
import { formatPct } from '../format.util';

@Component({
  selector: 'app-decisive-factors',
  standalone: true,
  template: `
    @if (temas().length > 0) {
      <div class="table" role="table">
        <div class="head" role="row">
          <span role="columnheader">No texto da review</span>
          <span role="columnheader">Recomendam se cita</span>
          <span role="columnheader">Recomendam se não cita</span>
        </div>
        @for (factor of temas(); track factor.feature) {
          <div
            class="line"
            role="row"
            [class.up]="factor.direcao === 'aumenta'"
            [class.down]="factor.direcao === 'reduz'"
          >
            <div class="name" role="rowheader">
              <strong>{{ titulo(factor) }}</strong>
              <span>{{ suporteDe(factor) }}</span>
            </div>
            <div class="cell" role="cell">
              <span class="cell-label">Se cita</span>
              <strong>{{ formatPct(factor.taxa_recomendacao_com) }}</strong>
              <div class="track" aria-hidden="true">
                <div class="fill com" [style.width.%]="barra(factor.taxa_recomendacao_com)"></div>
              </div>
            </div>
            <div class="cell base" role="cell">
              <span class="cell-label">Se não cita</span>
              <strong>{{ formatPct(factor.taxa_recomendacao_sem) }}</strong>
              @if (factor.taxa_recomendacao_sem !== null) {
                <div class="track" aria-hidden="true">
                  <div class="fill sem" [style.width.%]="barra(factor.taxa_recomendacao_sem)"></div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    }

    @if (contexto().length > 0) {
      <section class="steam">
        <h4>Horas e early access</h4>
        <p>
          A Steam grava isso fora do texto, na hora da review. A porcentagem é de quem recomenda o jogo nesse grupo.
        </p>
        <ul>
          @for (factor of contexto(); track factor.feature) {
            <li [class.up]="factor.direcao === 'aumenta'" [class.down]="factor.direcao === 'reduz'">
              <span>{{ titulo(factor) }}</span>
              <strong>{{ formatPct(factor.taxa_recomendacao_com) }}</strong>
              <span class="count">{{ suporteDe(factor) }}</span>
            </li>
          }
        </ul>
      </section>
    }

    @if (factors()[0]; as first) {
      <p class="foot">
        Amostra de {{ first.modelo.n_amostras.toLocaleString('pt-BR') }} reviews do gênero {{ first.genero }}.
      </p>
    }
  `,
  styles: `
    .table {
      display: grid;
      gap: 0;
    }
    .head,
    .line {
      display: grid;
      grid-template-columns: minmax(180px, 1.5fr) 1fr 1fr;
      gap: 16px;
      align-items: center;
    }
    .head {
      padding-bottom: 8px;
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
    }
    .head span:not(:first-child),
    .cell {
      text-align: right;
    }
    .line {
      padding: 12px 0;
      border-top: 1px solid var(--border);
    }
    .name strong {
      display: block;
      font-size: 15px;
      font-weight: 600;
    }
    .name span,
    .cell-label,
    .count {
      font-size: 12px;
      font-weight: 500;
      color: var(--text-secondary);
    }
    .cell strong {
      display: block;
      font-size: 20px;
      font-weight: 650;
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.03em;
    }
    .cell-label {
      display: none;
    }
    .down .cell:not(.base) strong {
      color: var(--red);
    }
    .up .cell:not(.base) strong {
      color: var(--green);
    }
    .track {
      height: 6px;
      margin-top: 6px;
      margin-left: auto;
      width: min(100%, 120px);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
      overflow: hidden;
    }
    .fill {
      height: 100%;
      border-radius: inherit;
      min-width: 2px;
    }
    .down .fill.com {
      background: var(--red);
    }
    .up .fill.com {
      background: var(--green);
    }
    .fill.sem {
      background: rgba(148, 163, 184, 0.85);
    }
    .steam {
      margin-top: 18px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }
    .steam h4 {
      margin: 0 0 4px;
      font-size: 15px;
      font-weight: 600;
    }
    .steam p,
    .foot {
      margin: 0;
      font-size: 13px;
      color: var(--text-secondary);
    }
    .steam ul {
      list-style: none;
      margin: 12px 0 0;
      padding: 0;
      display: grid;
      gap: 8px;
    }
    .steam li {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 16px;
      align-items: baseline;
    }
    .steam li span:first-child {
      font-size: 14px;
    }
    .steam strong {
      font-size: 16px;
      font-variant-numeric: tabular-nums;
    }
    .steam .down strong {
      color: var(--red);
    }
    .steam .up strong {
      color: var(--green);
    }
    .foot {
      margin-top: 14px;
      font-size: 12px;
      color: var(--text-muted);
    }
    @media (max-width: 640px) {
      .head {
        display: none;
      }
      .line {
        grid-template-columns: 1fr 1fr;
      }
      .name {
        grid-column: 1 / -1;
      }
      .cell {
        text-align: left;
      }
      .cell-label {
        display: block;
        margin-bottom: 2px;
      }
      .track {
        margin-left: 0;
      }
      .steam li {
        grid-template-columns: 1fr auto;
      }
      .count {
        grid-column: 1 / -1;
      }
    }
  `,
})
export class DecisiveFactorsComponent {
  readonly factors = input.required<DecisiveFactor[]>();
  readonly formatPct = formatPct;

  temas(): DecisiveFactor[] {
    return this.factors()
      .filter((factor) => factor.tipo !== 'contexto')
      .sort((a, b) => Math.abs(this.delta(b) ?? 0) - Math.abs(this.delta(a) ?? 0));
  }

  contexto(): DecisiveFactor[] {
    return this.factors()
      .filter((factor) => factor.tipo === 'contexto')
      .sort((a, b) => this.ordemContexto(a.feature) - this.ordemContexto(b.feature));
  }

  titulo(factor: DecisiveFactor): string {
    return factor.rotulo.replace(/^(?:Elogio|Reclamação):\s*/i, '');
  }

  suporteDe(factor: DecisiveFactor): string {
    return `${factor.suporte.toLocaleString('pt-BR')} de ${factor.modelo.n_amostras.toLocaleString('pt-BR')}`;
  }

  barra(value: number | null): number {
    if (value == null || !Number.isFinite(value)) {
      return 0;
    }
    return Math.min(100, Math.max(0, value * 100));
  }

  private delta(factor: DecisiveFactor): number | null {
    if (factor.taxa_recomendacao_sem == null) {
      return null;
    }
    return factor.taxa_recomendacao_com - factor.taxa_recomendacao_sem;
  }

  private ordemContexto(feature: string): number {
    const ordem = ['menos_2h', '2_a_10h', '10_a_50h', 'mais_50h', 'early_access'];
    const indice = ordem.findIndex((nome) => feature.includes(nome));
    return indice === -1 ? ordem.length : indice;
  }
}
