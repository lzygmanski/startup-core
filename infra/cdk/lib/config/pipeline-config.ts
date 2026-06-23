import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { z } from 'zod';

import { environmentNames } from './environments';

const pipelineConfigSchema = z.object({
  aws: z.object({
    account: z.string().regex(/^\d{12}$/, 'AWS account must contain 12 digits.'),
    region: z.string().min(1),
  }),
  featureBranches: z
    .object({
      enabled: z.boolean().default(false),
      prefixes: z.array(z.string().min(1)).default([]),
    })
    .default({ enabled: false, prefixes: [] }),
  projectName: z.string().min(1),
  repository: z.object({
    defaultBranch: z.string().min(1).default('main'),
    host: z.literal('github'),
    name: z.string().regex(/^[^/]+\/[^/]+$/, 'Repository must be owner/repository.'),
  }),
});

export type PipelineConfig = z.infer<typeof pipelineConfigSchema>;

const localConfigPath = resolve(process.cwd(), 'infra/cdk/pipeline.config.json');

export function loadOptionalPipelineConfig(): PipelineConfig | undefined {
  try {
    return pipelineConfigSchema.parse(JSON.parse(readFileSync(localConfigPath, 'utf8')) as unknown);
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return undefined;
    }

    throw error;
  }
}

export function loadPipelineConfig(): PipelineConfig {
  const config = loadOptionalPipelineConfig();

  if (config === undefined) {
    throw new Error(
      'Missing infra/cdk/pipeline.config.json. Copy pipeline.config.example.json and fill it locally.',
    );
  }

  return config;
}

export function createPipelineEnvironments(
  config: PipelineConfig,
): Record<string, PipelineConfig['aws']> {
  const environments = Object.fromEntries(
    environmentNames.flatMap((environmentName): [string, PipelineConfig['aws']][] => [
      [environmentName, config.aws],
      [`${environmentName}-stateful`, config.aws],
      [`${environmentName}-stateless`, config.aws],
    ]),
  );

  return {
    ...environments,
    ci: config.aws,
    default: config.aws,
  };
}

export function getFeatureBranchPrefixes(config: PipelineConfig): string[] | undefined {
  if (!config.featureBranches.enabled) {
    return ['__disabled__/'];
  }

  return config.featureBranches.prefixes.length === 0 ? undefined : config.featureBranches.prefixes;
}
