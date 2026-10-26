import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { environment } from '../environments/environment';
import { CheckApiHealthUseCase } from './application/use-cases/check-api-health.use-case';
import { GenerateFullReportUseCase } from './application/use-cases/generate-full-report.use-case';
import { routes } from './app.routes';
import { HealthHttpRepository } from './infrastructure/http/health-http.repository';
import { ReportHttpRepository } from './infrastructure/http/report-http.repository';
import { MockHealthRepository } from './infrastructure/mock/mock-health.repository';
import { MockReportRepository } from './infrastructure/mock/mock-report.repository';
import { HEALTH_REPOSITORY, REPORT_REPOSITORY } from './infrastructure/tokens';

const useMock = environment.useMockApi;

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: REPORT_REPOSITORY, useClass: useMock ? MockReportRepository : ReportHttpRepository },
    { provide: HEALTH_REPOSITORY, useClass: useMock ? MockHealthRepository : HealthHttpRepository },
    GenerateFullReportUseCase,
    CheckApiHealthUseCase,
  ],
};
