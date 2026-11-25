import type { CatalogDashboard, ReleasesByMonth } from '../entities/catalog-dashboard';

export interface ICatalogDashboardRepository {
  getOverview(genre?: string): Promise<CatalogDashboard>;
  getReleases(from: string, to: string, genre?: string): Promise<ReleasesByMonth[]>;
  getHeatmap(): Promise<Blob>;
}
