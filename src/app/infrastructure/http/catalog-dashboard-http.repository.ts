import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApiError } from '../../domain/entities/api-error';
import type { CatalogDashboard, ReleasesByMonth } from '../../domain/entities/catalog-dashboard';
import type { ICatalogDashboardRepository } from '../../domain/ports/catalog-dashboard.repository';
import { mapHttpError } from './map-http-error';
import { normalizeCatalogDashboard, normalizeReleases } from './normalize-catalog-dashboard';

@Injectable()
export class CatalogDashboardHttpRepository implements ICatalogDashboardRepository {
  private readonly http = inject(HttpClient);

  async getOverview(genre?: string): Promise<CatalogDashboard> {
    try {
      const raw = await firstValueFrom(
        this.http
          .get<unknown>(`${environment.apiUrl}/kpis/dashboard`, { params: this.genreParam(genre) })
          .pipe(timeout(20_000)),
      );
      return normalizeCatalogDashboard(raw);
    } catch (error) {
      throw this.mapCatalogError(error, '/kpis/dashboard');
    }
  }

  async getReleases(from: string, to: string, genre?: string): Promise<ReleasesByMonth[]> {
    try {
      const raw = await firstValueFrom(
        this.http
          .get<unknown>(`${environment.apiUrl}/kpis/releases`, {
            params: { from, to, ...this.genreParam(genre) },
          })
          .pipe(timeout(20_000)),
      );
      return normalizeReleases(raw);
    } catch (error) {
      throw this.mapCatalogError(error, '/kpis/releases');
    }
  }

  async getHeatmap(): Promise<Blob> {
    try {
      const blob = await firstValueFrom(
        this.http
          .get(`${environment.apiUrl}/kpis/correlation-heatmap`, { responseType: 'blob' })
          .pipe(timeout(60_000)),
      );
      if (!blob.type.startsWith('image/')) {
        throw new ApiError(
          'O mapa de correlação não voltou como imagem. Confira se o ml-service está no ar.',
          'ml_offline',
        );
      }
      return blob;
    } catch (error) {
      throw this.mapCatalogError(error, '/kpis/correlation-heatmap');
    }
  }

  private genreParam(genre?: string): { genre?: string } {
    return genre ? { genre } : {};
  }

  private mapCatalogError(error: unknown, path: string): ApiError {
    if (error instanceof ApiError) {
      return error;
    }
    if (error instanceof HttpErrorResponse && error.status === 404) {
      const message = path.includes('correlation-heatmap')
        ? 'O ml-service na porta 8000 não tem /correlation-heatmap. Esse mapa está na branch alteracoesDashboard.'
        : `A API em execução não expõe ${path}. Essas rotas estão na branch alteracoesDashboard.`;
      return new ApiError(message, 'unknown', 404);
    }
    return mapHttpError(error);
  }
}
