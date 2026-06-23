export type GraphqlRequest = Readonly<{
  operationName: string;
  query: string;
  variables?: Record<string, unknown>;
}>;

export type GraphqlClient = Readonly<{
  execute: <TResponse>(request: GraphqlRequest) => Promise<TResponse>;
}>;

/**
 * Placeholder for the generated GraphQL SDK introduced when the API contract exists.
 */
export const graphqlClientPlaceholder: GraphqlClient = {
  execute: async <TResponse>(): Promise<TResponse> => {
    throw new Error('The GraphQL client is not configured yet.');
  },
};
