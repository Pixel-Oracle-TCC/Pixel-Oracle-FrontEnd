import { normalizeCatalogDashboard, normalizeReleases } from './normalize-catalog-dashboard';

describe('normalizeCatalogDashboard', () => {
  it('lê KPIs, lançamentos e gêneros do envelope da API', () => {
    const dashboard = normalizeCatalogDashboard({
      status: 'sucesso',
      data: {
        overview: {
          totalGames: 110,
          pctFree: 12.5,
          medianPrice: 29.99,
          avgPositiveRate: null,
        },
        releases: [{ month: '2025-10', releases: '4', pctFree: 25 }],
        genres: [{ genre: 'Indie', games: 80, pct: 72.7 }],
      },
    });

    expect(dashboard.overview.totalGames).toBe(110);
    expect(dashboard.overview.avgPositiveRate).toBeNull();
    expect(dashboard.releases[0]).toEqual({ month: '2025-10', releases: 4, pctFree: 25 });
    expect(dashboard.genres[0]?.genre).toBe('Indie');
  });
});

describe('normalizeReleases', () => {
  it('lê a série mensal', () => {
    const rows = normalizeReleases({
      status: 'sucesso',
      data: [{ month: '2024-01', releases: 8, pctFree: 12.5 }],
    });

    expect(rows).toEqual([{ month: '2024-01', releases: 8, pctFree: 12.5 }]);
  });
});
