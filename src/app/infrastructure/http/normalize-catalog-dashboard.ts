import { ApiError } from '../../domain/entities/api-error';
import type {
  CatalogDashboard,
  GamesByGenre,
  OverviewKpis,
  ReleasesByMonth,
} from '../../domain/entities/catalog-dashboard';

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : null;
}

function asNumber(value: unknown, fallback = 0): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function asNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function envelope(raw: unknown, fallback: string): Record<string, unknown> {
  const body = asRecord(raw);
  if (!body || body['status'] !== 'sucesso') {
    const mensagem = typeof body?.['mensagem'] === 'string' ? body['mensagem'] : fallback;
    throw new ApiError(mensagem, 'unknown');
  }
  return body;
}

function releaseRow(value: unknown): ReleasesByMonth | null {
  const row = asRecord(value);
  if (!row || typeof row['month'] !== 'string') {
    return null;
  }
  return {
    month: row['month'],
    releases: asNumber(row['releases']),
    pctFree: asNumber(row['pctFree']),
  };
}

export function normalizeReleases(raw: unknown): ReleasesByMonth[] {
  const body = envelope(raw, 'Resposta de lançamentos inválida.');
  if (!Array.isArray(body['data'])) {
    throw new ApiError('Resposta de lançamentos inválida.', 'unknown');
  }
  return body['data'].flatMap((row) => {
    const parsed = releaseRow(row);
    return parsed ? [parsed] : [];
  });
}

export function normalizeCatalogDashboard(raw: unknown): CatalogDashboard {
  const body = envelope(raw, 'Resposta do dashboard inválida.');
  const data = asRecord(body['data']);
  const overviewRaw = asRecord(data?.['overview']);
  if (!data || !overviewRaw) {
    throw new ApiError('Resposta do dashboard inválida.', 'unknown');
  }

  const overview: OverviewKpis = {
    totalGames: asNumber(overviewRaw['totalGames']),
    pctFree: asNumber(overviewRaw['pctFree']),
    medianPrice: asNullableNumber(overviewRaw['medianPrice']),
    avgPositiveRate: asNullableNumber(overviewRaw['avgPositiveRate']),
  };

  const releases = Array.isArray(data['releases'])
    ? data['releases'].flatMap((row) => {
        const parsed = releaseRow(row);
        return parsed ? [parsed] : [];
      })
    : [];

  const genres: GamesByGenre[] = Array.isArray(data['genres'])
    ? data['genres'].flatMap((value) => {
        const row = asRecord(value);
        if (!row || typeof row['genre'] !== 'string') {
          return [];
        }
        return [
          {
            genre: row['genre'],
            games: asNumber(row['games']),
            pct: asNumber(row['pct']),
          },
        ];
      })
    : [];

  return { overview, releases, genres };
}
