import { Injectable, inject } from '@angular/core';

import type { FullReport } from '../../domain/entities/full-report';
import type { GamePitch } from '../../domain/entities/game-pitch';
import type { IReportRepository } from '../../domain/ports/report.repository';
import { buildMockReport } from './build-mock-report';
import { MockScenario } from './mock-scenario';

@Injectable()
export class MockReportRepository implements IReportRepository {
  private readonly scenario = inject(MockScenario);

  async generateReport(pitch: GamePitch): Promise<FullReport> {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return buildMockReport(pitch, this.scenario.insufficient());
  }
}
