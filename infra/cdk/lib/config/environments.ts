export const environmentNames = ['dev', 'staging', 'prod'] as const;

export type EnvironmentName = (typeof environmentNames)[number];

export type EnvironmentConfig = Readonly<{
  isProduction: boolean;
  name: EnvironmentName;
}>;

function isEnvironmentName(value: unknown): value is EnvironmentName {
  return typeof value === 'string' && environmentNames.includes(value as EnvironmentName);
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
