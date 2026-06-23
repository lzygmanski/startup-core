import { getCoreHealth, type Clock } from '@core/application';

import type { CoreHealth } from '@core/contracts';

export type GetCoreHealthResolverDependencies = Readonly<{
  clock: Clock;
  service: string;
  version: string;
}>;

export function createGetCoreHealthResolver(
  dependencies: GetCoreHealthResolverDependencies,
): () => CoreHealth {
  return (): CoreHealth => {
    const result = getCoreHealth(dependencies);

    if (!result.ok) {
      throw new Error('Unexpected failure while retrieving core health.');
    }

    return result.value;
  };
}
