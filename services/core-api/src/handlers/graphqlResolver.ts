import { z } from 'zod';

import { mapCoreHealthToGraphql, type GraphqlCoreHealth } from '../mappers/graphql.mapper';
import {
  createGetCoreHealthResolver,
  type GetCoreHealthResolverDependencies,
} from '../resolvers/getCoreHealth';

const graphqlResolverEventSchema = z.object({
  info: z.object({
    fieldName: z.literal('getCoreHealth'),
  }),
});

export class InvalidGraphqlResolverEventError extends Error {
  public constructor() {
    super('Unsupported GraphQL resolver event.');
    this.name = 'InvalidGraphqlResolverEventError';
  }
}

export function createGraphqlResolverHandler(
  dependencies: GetCoreHealthResolverDependencies,
): (event: unknown) => GraphqlCoreHealth {
  const resolveCoreHealth = createGetCoreHealthResolver(dependencies);

  return (event: unknown): GraphqlCoreHealth => {
    const parsedEvent = graphqlResolverEventSchema.safeParse(event);

    if (!parsedEvent.success) {
      throw new InvalidGraphqlResolverEventError();
    }

    return mapCoreHealthToGraphql(resolveCoreHealth());
  };
}
