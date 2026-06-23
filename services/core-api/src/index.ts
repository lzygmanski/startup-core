import { createGraphqlResolverHandler } from './handlers/graphqlResolver';

const systemClock = {
  now: (): Date => new Date(),
};

export const handler = createGraphqlResolverHandler({
  clock: systemClock,
  service: 'core-api',
  version: '0.0.0',
});
