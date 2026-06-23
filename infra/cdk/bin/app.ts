import * as cdk from 'aws-cdk-lib';

import { getEnvironmentConfig } from '../lib/config/environments';
import { createStackName } from '../lib/constructs/resource-names';
import { PlatformStatefulStack } from '../lib/stateful/platform-stateful.stack';
import { CoreApiStack } from '../lib/stateless/core-api.stack';

const app = new cdk.App();
const environmentConfig = getEnvironmentConfig(app.node.tryGetContext('environment'));
const projectName = app.node.tryGetContext('projectName') ?? 'startup-core';
const awsEnvironment: cdk.Environment = {
  ...(process.env.CDK_DEFAULT_ACCOUNT === undefined
    ? {}
    : { account: process.env.CDK_DEFAULT_ACCOUNT }),
  ...(process.env.CDK_DEFAULT_REGION === undefined
    ? {}
    : { region: process.env.CDK_DEFAULT_REGION }),
};

const statefulStack = new PlatformStatefulStack(
  app,
  createStackName(projectName, environmentConfig.name, 'stateful'),
  {
    env: awsEnvironment,
    environmentConfig,
    projectName,
  },
);

new CoreApiStack(app, createStackName(projectName, environmentConfig.name, 'core-api'), {
  env: awsEnvironment,
  environmentConfig,
  platformIdentifierParameterName: statefulStack.platformIdentifierParameterName,
  projectName,
});
