import { describe, expect, it } from 'vitest';

import { createGraphqlResolverHandler, InvalidGraphqlResolverEventError } from './graphqlResolver';

describe('createGraphqlResolverHandler', () => {
  const handler = createGraphqlResolverHandler({
    clock: { now: (): Date => new Date('2026-01-01T00:00:00.000Z') },
    service: 'core-api',
    version: '0.0.0',
  });

  it('maps the pure use-case response to the GraphQL response', (): void => {
    expect(handler({ info: { fieldName: 'getCoreHealth' } })).toEqual({
      service: 'core-api',
      status: 'ok',
      timestamp: '2026-01-01T00:00:00.000Z',
      version: '0.0.0',
    });
  });

  it('rejects events outside the GraphQL boundary contract', (): void => {
    expect((): void => {
      handler({ info: { fieldName: 'unexpectedField' } });
    }).toThrow(InvalidGraphqlResolverEventError);
  });
});
