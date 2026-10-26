import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { FullReport } from '../../domain/entities/full-report';
import type { GamePitch } from '../../domain/entities/game-pitch';
import type { IReportRepository } from '../../domain/ports/report.repository';
import { mapHttpError } from './map-http-error';
import { normalizeFullReport } from './normalize-report';

@Injectable()
export class ReportHttpRepository implements IReportRepository {
  private readonly http = inject(HttpClient);

  async generateReport(pitch: GamePitch): Promise<FullReport> {
    try {
      const raw = await firstValueFrom(
        this.http
          .post<unknown>(`${environment.apiUrl}/api/report`, pitch)
          .pipe(timeout(environment.reportTimeoutMs)),
      );
      return normalizeFullReport(raw);
    } catch (error) {
      throw mapHttpError(error);
    }
  }
}
