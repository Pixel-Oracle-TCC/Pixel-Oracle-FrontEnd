import { Inject, Injectable } from '@angular/core';

import type { CatalogDashboard, ReleasesByMonth } from '../../domain/entities/catalog-dashboard';
import type { ICatalogDashboardRepository } from '../../domain/ports/catalog-dashboard.repository';
import { CATALOG_DASHBOARD_REPOSITORY } from '../../infrastructure/tokens';

@Injectable()
export class LoadCatalogDashboardUseCase {
  constructor(
    @Inject(CATALOG_DASHBOARD_REPOSITORY)
    private readonly catalog: ICatalogDashboardRepository,
  ) {}

  overview(genre?: string): Promise<CatalogDashboard> {
    return this.catalog.getOverview(genre);
  }

  releases(from: string, to: string, genre?: string): Promise<ReleasesByMonth[]> {
    return this.catalog.getReleases(from, to, genre);
  }

  heatmap(): Promise<Blob> {
    return this.catalog.getHeatmap();
  }
}
