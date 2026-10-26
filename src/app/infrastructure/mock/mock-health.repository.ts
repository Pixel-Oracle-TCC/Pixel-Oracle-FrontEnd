import { Injectable } from '@angular/core';

import type { ApiHealth } from '../../domain/entities/full-report';
import type { IHealthRepository } from '../../domain/ports/health.repository';

@Injectable()
export class MockHealthRepository implements IHealthRepository {
  async check(): Promise<ApiHealth> {
    return {
      status: 'online',
      modo: 'prototipo-mock',
      database_ok: false,
    };
  }
}
