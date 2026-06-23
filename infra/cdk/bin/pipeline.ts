import { CDKApplication } from 'opinionated-ci-pipeline';

import {
  createPipelineEnvironments,
  getFeatureBranchPrefixes,
  loadPipelineConfig,
} from '../lib/config/pipeline-config';
import { createPipelinePlatformStacks } from '../lib/pipeline/application';

const pipelineConfig = loadPipelineConfig();
const featureBranchPrefixes = getFeatureBranchPrefixes(pipelineConfig);

new CDKApplication({
  commands: {
    buildAndTest: [
      'pnpm nx affected -t lint',
      'pnpm nx affected -t typecheck',
      'pnpm nx affected -t test',
      'pnpm nx affected -t build',
      'pnpm cdk:synth',
    ],
    install: ['npm install --location=global pnpm', 'pnpm install --frozen-lockfile'],
    synthPipeline: [
      'pnpm exec cdk --app "pnpm exec tsx infra/cdk/bin/pipeline.ts" synth -c ci=true',
    ],
  },
  context: {
    environments: createPipelineEnvironments(pipelineConfig),
    projectName: pipelineConfig.projectName,
  },
  fixPathsMetadata: true,
  packageManager: 'pnpm',
  pipeline: [
    { environment: 'dev-stateless' },
    {
      environment: 'dev-stateful',
      manualApproval: true,
      pre: [
        'npm install --location=global pnpm',
        'pnpm install --frozen-lockfile',
        'pnpm exec cdk diff -c env=${ENV_NAME} --all',
      ],
    },
    { environment: 'staging-stateless' },
    {
      environment: 'staging-stateful',
      manualApproval: true,
      pre: [
        'npm install --location=global pnpm',
        'pnpm install --frozen-lockfile',
        'pnpm exec cdk diff -c env=${ENV_NAME} --all',
      ],
    },
    { environment: 'prod-stateless' },
    {
      environment: 'prod-stateful',
      manualApproval: true,
      pre: [
        'npm install --location=global pnpm',
        'pnpm install --frozen-lockfile',
        'pnpm exec cdk diff -c env=${ENV_NAME} --all',
      ],
    },
  ],
  repository: {
    defaultBranch: pipelineConfig.repository.defaultBranch,
    host: pipelineConfig.repository.host,
    name: pipelineConfig.repository.name,
    ...(featureBranchPrefixes === undefined ? {} : { featureBranchPrefixes }),
  },
  stacks: {
    create: createPipelinePlatformStacks,
  },
});
