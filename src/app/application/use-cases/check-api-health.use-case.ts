import { Inject, Injectable } from '@angular/core';

import type { ApiHealth } from '../../domain/entities/full-report';
import type { IHealthRepository } from '../../domain/ports/health.repository';
import { HEALTH_REPOSITORY } from '../../infrastructure/tokens';

@Injectable()
export class CheckApiHealthUseCase {
  constructor(@Inject(HEALTH_REPOSITORY) private readonly health: IHealthRepository) {}

  execute(): Promise<ApiHealth> {
    return this.health.check();
  }
}
