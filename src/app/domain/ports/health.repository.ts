import type { ApiHealth } from '../entities/full-report';

export interface IHealthRepository {
  check(): Promise<ApiHealth>;
}
