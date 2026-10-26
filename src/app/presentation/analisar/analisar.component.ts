import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { environment } from '../../../environments/environment';
import { mapFormToGamePitch } from '../../application/mappers/pitch-form.mapper';
import { CheckApiHealthUseCase } from '../../application/use-cases/check-api-health.use-case';
import { GenerateFullReportUseCase } from '../../application/use-cases/generate-full-report.use-case';
import { ApiError } from '../../domain/entities/api-error';
import type { FullReport, Highlight } from '../../domain/entities/full-report';
import { MockScenario } from '../../infrastructure/mock/mock-scenario';
import { SiteHeaderComponent } from '../layouts/site-header.component';
import { ApiBannerComponent } from '../shared/api-banner/api-banner.component';
import { DecisiveFactorsComponent } from '../shared/decisive-factors/decisive-factors.component';
import { EmptyStateComponent } from '../shared/empty-state/empty-state.component';
import { formatPct, formatPreco, formatFaturamento, faturamentoBoxleiter, steamUrl } from '../shared/format.util';
import { leituraDeMercado } from '../shared/market-reading';
import { HighlightCardComponent } from '../shared/highlight-card/highlight-card.component';
import { LoadingStateComponent } from '../shared/loading-state/loading-state.component';
import { GenreInputComponent } from '../shared/genre-input/genre-input.component';
import { ReferenceReviewsComponent } from '../shared/reference-reviews/reference-reviews.component';

@Component({
  selector: 'app-analisar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    SiteHeaderComponent,
    ApiBannerComponent,
    EmptyStateComponent,
    LoadingStateComponent,
    HighlightCardComponent,
    DecisiveFactorsComponent,
    ReferenceReviewsComponent,
    GenreInputComponent,
  ],
  templateUrl: './analisar.component.html',
  styleUrl: './analisar.component.scss',
})
export class AnalisarComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly generateReport = inject(GenerateFullReportUseCase);
  private readonly checkHealth = inject(CheckApiHealthUseCase);
  private readonly scenario = inject(MockScenario);

  readonly mockMode = environment.useMockApi;
  readonly formatPct = formatPct;
  readonly formatPreco = formatPreco;
  readonly formatFaturamento = formatFaturamento;
  readonly faturamentoBoxleiter = faturamentoBoxleiter;
  readonly leituraDeMercado = leituraDeMercado;
  readonly steamUrl = steamUrl;

  readonly loading = signal(false);
  readonly report = signal<FullReport | null>(null);
  readonly errorMessage = signal<string | null>(null);
  readonly apiOffline = signal(false);
  readonly healthChecked = signal(false);
  readonly simulateEmpty = signal(false);

  readonly form = this.fb.nonNullable.group({
    titulo: ['Floresta Pixel', [Validators.required, Validators.minLength(2)]],
    descricao: [
      'Metroidvania 2D com crafting e exploração cooperativa local.',
      [Validators.required, Validators.minLength(10)],
    ],
    genres: this.fb.nonNullable.control<string[]>(['Indie', 'Ação', 'Aventura'], Validators.required),
    price_brl: this.fb.control<number | null>(36.99, [Validators.min(0)]),
  });

  ngOnInit(): void {
    void this.refreshHealth();
  }

  async refreshHealth(): Promise<void> {
    try {
      await this.checkHealth.execute();
      this.apiOffline.set(false);
    } catch {
      this.apiOffline.set(true);
    } finally {
      this.healthChecked.set(true);
    }
  }

  destaquesDe(report: FullReport): Highlight[] {
    return [...report.dashboard.destaques.elogios, ...report.dashboard.destaques.reclamacoes];
  }

  barWidth(value: number | null): number {
    if (value == null || !Number.isFinite(value)) {
      return 0;
    }
    return Math.min(100, Math.max(0, value * 100));
  }

  fraseDe(report: FullReport, highlight: Highlight): string {
    return report.narrativa.destaques.find((item) => item.id === highlight.id)?.frase ?? highlight.frase;
  }

  alertasVisiveis(report: FullReport) {
    return report.dashboard.alertas.filter((alert) => alert.tipo !== 'dados_insuficientes');
  }

  semReviews(report: FullReport): boolean {
    return report.dashboard.alertas.some((alert) => alert.tipo === 'dados_insuficientes');
  }

  onSimulateChange(event: Event): void {
    this.simulateEmpty.set((event.target as HTMLInputElement).checked);
  }

  async onSubmit(): Promise<void> {
    this.errorMessage.set(null);
    if (this.form.invalid || this.form.controls.genres.value.length === 0) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Informe título, descrição com pelo menos 10 caracteres e ao menos um gênero.');
      return;
    }

    const pitch = mapFormToGamePitch(this.form.getRawValue());
    this.scenario.insufficient.set(this.simulateEmpty());
    this.loading.set(true);
    this.report.set(null);

    try {
      const result = await this.generateReport.execute(pitch);
      this.report.set(result);
      this.apiOffline.set(false);
      queueMicrotask(() => {
        document.getElementById('resultado')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Não foi possível gerar o relatório. Tente novamente.';
      this.errorMessage.set(message);
      if (err instanceof ApiError && (err.kind === 'network' || err.kind === 'ml_offline')) {
        this.apiOffline.set(true);
      }
    } finally {
      this.loading.set(false);
    }
  }
}
