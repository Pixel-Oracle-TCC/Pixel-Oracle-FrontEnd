import type { FullReport } from '../entities/full-report';
import type { GamePitch } from '../entities/game-pitch';

export interface IReportRepository {
  generateReport(pitch: GamePitch): Promise<FullReport>;
}
