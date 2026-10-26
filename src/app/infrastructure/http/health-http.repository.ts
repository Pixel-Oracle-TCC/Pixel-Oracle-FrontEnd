import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, timeout } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { ApiHealth } from '../../domain/entities/full-report';
import type { IHealthRepository } from '../../domain/ports/health.repository';
import { mapHttpError } from './map-http-error';

@Injectable()
export class HealthHttpRepository implements IHealthRepository {
  private readonly http = inject(HttpClient);

  async check(): Promise<ApiHealth> {
    try {
      return await firstValueFrom(
        this.http.get<ApiHealth>(`${environment.apiUrl}/api/health`).pipe(timeout(8_000)),
      );
    } catch (error) {
      throw mapHttpError(error);
    }
  }
}
