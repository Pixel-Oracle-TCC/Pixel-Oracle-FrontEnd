import { InjectionToken } from '@angular/core';

import type { ICatalogDashboardRepository } from '../domain/ports/catalog-dashboard.repository';
import type { IHealthRepository } from '../domain/ports/health.repository';
import type { IReportRepository } from '../domain/ports/report.repository';

export const REPORT_REPOSITORY = new InjectionToken<IReportRepository>('REPORT_REPOSITORY');
export const HEALTH_REPOSITORY = new InjectionToken<IHealthRepository>('HEALTH_REPOSITORY');
export const CATALOG_DASHBOARD_REPOSITORY = new InjectionToken<ICatalogDashboardRepository>(
  'CATALOG_DASHBOARD_REPOSITORY',
);
