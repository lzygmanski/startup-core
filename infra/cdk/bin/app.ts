import * as cdk from 'aws-cdk-lib';

import { getEnvironmentConfig } from '../lib/config/environments';
import { loadOptionalPipelineConfig } from '../lib/config/pipeline-config';
import { createPlatformStacks } from '../lib/pipeline/application';

const app = new cdk.App();
const environmentConfig = getEnvironmentConfig(
  app.node.tryGetContext('env') ?? app.node.tryGetContext('environment') ?? 'dev',
);
const pipelineConfig = loadOptionalPipelineConfig();
const projectName =
  pipelineConfig?.projectName ?? app.node.tryGetContext('projectName') ?? 'startup-core';
const personalEnvironment = app.node.tryGetContext('personal') === 'true';
const awsEnvironment: cdk.Environment = {
  ...(process.env.CDK_DEFAULT_ACCOUNT === undefined
    ? {}
    : { account: process.env.CDK_DEFAULT_ACCOUNT }),
  ...(process.env.CDK_DEFAULT_REGION === undefined
    ? {}
    : { region: process.env.CDK_DEFAULT_REGION }),
};

createPlatformStacks(
  app,
  projectName,
  environmentConfig.name,
  awsEnvironment,
  personalEnvironment ? 'all' : 'stateless',
);
