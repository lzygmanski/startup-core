import { ok, type CoreHealth, type Result } from '@core/contracts';
import { createHealthyStatus } from '@core/domain';

import type { Clock } from './ports/clock';

export type GetCoreHealthDependencies = Readonly<{
  clock: Clock;
  service: string;
  version: string;
}>;

export function getCoreHealth(dependencies: GetCoreHealthDependencies): Result<CoreHealth, never> {
  return ok({
    service: dependencies.service,
    status: createHealthyStatus(),
    timestamp: dependencies.clock.now().toISOString(),
    version: dependencies.version,
  });
}
