import type { CoreHealth } from '@core/contracts';

export type GraphqlCoreHealth = Readonly<{
  service: string;
  status: string;
  timestamp: string;
  version: string;
}>;

export function mapCoreHealthToGraphql(coreHealth: CoreHealth): GraphqlCoreHealth {
  return {
    service: coreHealth.service,
    status: coreHealth.status,
    timestamp: coreHealth.timestamp,
    version: coreHealth.version,
  };
}
