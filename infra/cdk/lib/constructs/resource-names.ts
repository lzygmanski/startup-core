import type { EnvironmentName } from '../config/environments';

export function createResourceName(
  projectName: string,
  environmentName: EnvironmentName,
  resourceName: string,
): string {
  return `${projectName}-${environmentName}-${resourceName}`;
}

export function createStackName(
  projectName: string,
  environmentName: EnvironmentName,
  stackName: string,
): string {
  return createResourceName(projectName, environmentName, stackName);
}

export function createParameterName(
  projectName: string,
  environmentName: EnvironmentName,
  parameterName: string,
): string {
  return `/${projectName}/${environmentName}/${parameterName}`;
}
