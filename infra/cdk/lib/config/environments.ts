export const environmentNames = ['dev', 'staging', 'prod'] as const;

export type EnvironmentName = string;

export type EnvironmentConfig = Readonly<{
  isProduction: boolean;
  name: EnvironmentName;
}>;

function isEnvironmentName(value: unknown): value is EnvironmentName {
  return typeof value === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(value);
}

export function getEnvironmentConfig(value: unknown): EnvironmentConfig {
  if (!isEnvironmentName(value)) {
    throw new Error(`Invalid CDK environment: ${String(value)}.`);
  }

  return {
    isProduction: value === 'prod',
    name: value,
  };
}
