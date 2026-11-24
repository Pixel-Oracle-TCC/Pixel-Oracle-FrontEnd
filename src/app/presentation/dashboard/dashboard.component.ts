import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { LoadCatalogDashboardUseCase } from '../../application/use-cases/load-catalog-dashboard.use-case';
import { ApiError } from '../../domain/entities/api-error';
import type {
  CatalogDashboard,
  GamesByGenre,
  ReleasesByMonth,
} from '../../domain/entities/catalog-dashboard';
import { SiteHeaderComponent } from '../layouts/site-header.component';
import { ApiBannerComponent } from '../shared/api-banner/api-banner.component';
import { formatPreco } from '../shared/format.util';
import { LoadingStateComponent } from '../shared/loading-state/loading-state.component';

interface ReleaseBar {
  month: string;
  label: string;
  tick: string;
  showTick: boolean;
  releases: number;
  pctFree: number;
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  lineY: number;
}

const CHART_PAD_LEFT = 8;
const CHART_INNER_HEIGHT = 176;

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function defaultRange(): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to);
  from.setUTCMonth(from.getUTCMonth() - 12);
  return { from: isoDate(from), to: isoDate(to) };
}

function formatCount(value: number): string {
  return value.toLocaleString('pt-BR');
}

function formatPoints(value: number | null, digits = 1): string {
  if (value == null || !Number.isFinite(value)) {
    return '—';
  }
  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

function formatMonth(month: string): string {
  const [year, rawMonth] = month.split('-');
  const index = Number(rawMonth) - 1;
  if (!year || index < 0 || index > 11) {
    return month;
  }
  const label = new Date(Date.UTC(Number(year), index, 1)).toLocaleDateString('pt-BR', {
    month: 'short',
    year: '2-digit',
    timeZone: 'UTC',
  });
  return label.replace('.', '');
}

function buildBars(rows: ReleasesByMonth[]): { bars: ReleaseBar[]; width: number; line: string } {
  const width = Math.max(640, rows.length * 36);
  const maxReleases = Math.max(1, ...rows.map((row) => row.releases));
  const step = rows.length > 16 ? Math.ceil(rows.length / 12) : 1;
  const gap = 8;
  const innerWidth = width - CHART_PAD_LEFT * 2;
  const barW = rows.length === 0 ? 0 : Math.max(6, (innerWidth - gap * (rows.length - 1)) / rows.length);

  const bars = rows.map((row, index) => {
    const h = (row.releases / maxReleases) * CHART_INNER_HEIGHT;
    const x = CHART_PAD_LEFT + index * (barW + gap);
    const y = CHART_INNER_HEIGHT - h;
    const lineY = CHART_INNER_HEIGHT - (Math.min(100, Math.max(0, row.pctFree)) / 100) * CHART_INNER_HEIGHT;
    return {
      month: row.month,
      label: formatMonth(row.month),
      tick: formatMonth(row.month),
      showTick: index % step === 0 || index === rows.length - 1,
      releases: row.releases,
      pctFree: row.pctFree,
      x,
      y,
      w: barW,
      h,
      cx: x + barW / 2,
      lineY,
    };
  });

  return {
    bars,
    width,
    line: bars.map((bar) => `${bar.cx},${bar.lineY}`).join(' '),
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    SiteHeaderComponent,
    ApiBannerComponent,
    LoadingStateComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly catalog = inject(LoadCatalogDashboardUseCase);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);

  readonly formatPreco = formatPreco;
  readonly formatPoints = formatPoints;
  readonly formatCount = formatCount;

  readonly loading = signal(true);
  readonly releasesLoading = signal(false);
  readonly dashboard = signal<CatalogDashboard | null>(null);
  readonly genreOptions = signal<GamesByGenre[]>([]);
  readonly selectedGenre = signal('');
  readonly releases = signal<ReleasesByMonth[]>([]);
  readonly errorMessage = signal<string | null>(null);
  readonly rangeError = signal<string | null>(null);
  readonly heatmapUrl = signal<string | null>(null);
  readonly heatmapError = signal<string | null>(null);

  readonly range = this.fb.nonNullable.group(defaultRange());

  readonly chart = computed(() => buildBars(this.releases()));
  readonly topGenres = computed(() => (this.dashboard()?.genres ?? []).slice(0, 12));
  readonly genreMax = computed(() => Math.max(1, ...this.topGenres().map((genre) => genre.games)));

  constructor() {
    this.destroyRef.onDestroy(() => {
      const url = this.heatmapUrl();
      if (url) {
        URL.revokeObjectURL(url);
      }
    });
  }

  ngOnInit(): void {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set(null);
    try {
      const dashboard = await this.catalog.overview();
      this.genreOptions.set(dashboard.genres);
      this.selectedGenre.set('');
      this.dashboard.set(dashboard);
      this.releases.set(dashboard.releases);
      void this.loadHeatmap();
    } catch (error) {
      this.dashboard.set(null);
      this.errorMessage.set(error instanceof ApiError ? error.message : 'Não foi possível carregar o catálogo.');
    } finally {
      this.loading.set(false);
    }
  }

  onGenreChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    void this.applyGenre(value);
  }

  async applyGenre(genre: string): Promise<void> {
    this.selectedGenre.set(genre);
    await this.reloadSlice();
  }

  async applyRange(): Promise<void> {
    if (!this.rangeIsValid()) {
      return;
    }
    await this.reloadSlice();
  }

  private rangeIsValid(): boolean {
    const { from, to } = this.range.getRawValue();
    if (from > to) {
      this.rangeError.set('A data inicial precisa ser anterior ou igual à data final.');
      return false;
    }
    const start = new Date(`${from}T00:00:00.000Z`);
    const end = new Date(`${to}T00:00:00.000Z`);
    const limit = new Date(start);
    limit.setUTCFullYear(limit.getUTCFullYear() + 5);
    if (end > limit) {
      this.rangeError.set('O intervalo máximo é de 5 anos.');
      return false;
    }
    this.rangeError.set(null);
    return true;
  }

  private async reloadSlice(): Promise<void> {
    if (!this.rangeIsValid()) {
      return;
    }
    const genre = this.selectedGenre() || undefined;
    const { from, to } = this.range.getRawValue();
    this.releasesLoading.set(true);
    try {
      const [dashboard, releases] = await Promise.all([
        this.catalog.overview(genre),
        this.catalog.releases(from, to, genre),
      ]);
      this.dashboard.set(dashboard);
      this.releases.set(releases);
    } catch (error) {
      this.rangeError.set(
        error instanceof ApiError ? error.message : 'Não foi possível atualizar o recorte.',
      );
    } finally {
      this.releasesLoading.set(false);
    }
  }

  private async loadHeatmap(): Promise<void> {
    this.heatmapError.set(null);
    try {
      const blob = await this.catalog.heatmap();
      const next = URL.createObjectURL(blob);
      const previous = this.heatmapUrl();
      this.heatmapUrl.set(next);
      if (previous) {
        URL.revokeObjectURL(previous);
      }
    } catch (error) {
      this.heatmapError.set(
        error instanceof ApiError
          ? error.message
          : 'Não foi possível carregar o mapa de correlação.',
      );
    }
  }
}
