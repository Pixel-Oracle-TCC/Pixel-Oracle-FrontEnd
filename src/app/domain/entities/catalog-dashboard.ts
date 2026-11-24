/**
 * Contrato de GET /kpis/dashboard e GET /kpis/releases.
 * Espelho de api/src/domain/ports/IDashboardRepository.ts na branch alteracoesDashboard.
 * pctFree e avgPositiveRate já vêm em pontos percentuais (0–100), não em fração.
 */

export interface OverviewKpis {
  totalGames: number;
  pctFree: number;
  medianPrice: number | null;
  avgPositiveRate: number | null;
}

export interface ReleasesByMonth {
  month: string;
  releases: number;
  pctFree: number;
}

export interface GamesByGenre {
  genre: string;
  games: number;
  pct: number;
}

export interface CatalogDashboard {
  overview: OverviewKpis;
  releases: ReleasesByMonth[];
  genres: GamesByGenre[];
}
