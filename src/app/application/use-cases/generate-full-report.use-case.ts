import { Inject, Injectable } from '@angular/core';

import type { FullReport } from '../../domain/entities/full-report';
import type { GamePitch } from '../../domain/entities/game-pitch';
import type { IReportRepository } from '../../domain/ports/report.repository';
import { REPORT_REPOSITORY } from '../../infrastructure/tokens';

@Injectable()
export class GenerateFullReportUseCase {
  constructor(@Inject(REPORT_REPOSITORY) private readonly reports: IReportRepository) {}

  execute(pitch: GamePitch): Promise<FullReport> {
    return this.reports.generateReport(pitch);
  }
}
