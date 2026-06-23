import { getEnvironmentConfig, type EnvironmentName } from '../config/environments';
import { createStackName } from '../constructs/resource-names';
import { PlatformStatefulStack } from '../stateful/platform-stateful.stack';
import { CoreApiStack } from '../stateless/core-api.stack';

import type * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';

type DeploymentScope = 'all' | 'stateful' | 'stateless';

type DeploymentTarget = Readonly<{
  environmentName: EnvironmentName;
  scope: DeploymentScope;
  statefulEnvironmentName: EnvironmentName;
}>;

function getDeploymentTarget(value: string, fallbackScope: DeploymentScope): DeploymentTarget {
  const match = /^(dev|staging|prod)(?:-(stateful|stateless))?$/.exec(value);

  if (match !== null) {
    return {
      environmentName: match[1] as EnvironmentName,
      scope: (match[2] as DeploymentScope | undefined) ?? 'all',
      statefulEnvironmentName: match[1] as EnvironmentName,
    };
  }

  if (!/^[a-z0-9][a-z0-9-]*$/.test(value)) {
    throw new Error(`Invalid deployment environment: ${value}.`);
  }

  return {
    environmentName: value,
    scope: fallbackScope,
    statefulEnvironmentName: fallbackScope === 'stateless' ? 'dev' : value,
  };
}

export function createPlatformStacks(
  scope: Construct,
  projectName: string,
  deploymentEnvironment: string,
  env?: cdk.Environment,
  fallbackScope: DeploymentScope = 'all',
): void {
  const deploymentTarget = getDeploymentTarget(deploymentEnvironment, fallbackScope);
  const environmentConfig = getEnvironmentConfig(deploymentTarget.environmentName);
  const stackEnvironment = env === undefined ? {} : { env };

  if (deploymentTarget.scope === 'all' || deploymentTarget.scope === 'stateful') {
    new PlatformStatefulStack(
      scope,
      createStackName(projectName, environmentConfig.name, 'stateful'),
      {
        ...stackEnvironment,
        environmentConfig,
        projectName,
      },
    );
  }

  if (deploymentTarget.scope === 'all' || deploymentTarget.scope === 'stateless') {
    new CoreApiStack(scope, createStackName(projectName, environmentConfig.name, 'core-api'), {
      ...stackEnvironment,
      environmentConfig,
      platformIdentifierParameterName: `/${projectName}/${deploymentTarget.statefulEnvironmentName}/stateful/platform-identifier`,
      projectName,
    });
  }
}

export function createPipelinePlatformStacks(
  scope: Construct,
  projectName: string,
  deploymentEnvironment: string,
): void {
  createPlatformStacks(scope, projectName, deploymentEnvironment, undefined, 'stateless');
}
