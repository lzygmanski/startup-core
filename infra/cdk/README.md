# CDK Infrastructure

This app creates two independently deployable stacks per environment:

- `startup-core-<environment>-stateful` owns the stable platform identifier SSM parameter.
- `startup-core-<environment>-core-api` owns the AppSync API, Lambda resolver, resolver attachment, and replaceable logs.

The stateless stack reads the platform identifier from SSM; it has no CloudFormation cross-stack dependency on the stateful stack.

## Commands

```sh
pnpm cdk:synth
pnpm exec cdk diff -c environment=dev
pnpm exec cdk deploy startup-core-dev-stateful -c environment=dev
pnpm exec cdk deploy startup-core-dev-core-api -c environment=dev
```

Bootstrap the target AWS account and region with `pnpm exec cdk bootstrap` before the first deployment.

Deploy the stateful stack first. Normal application changes should deploy only the stateless stack. For production, inspect `cdk diff` before any stateful deployment; the stateful stack enables termination protection and uses `RETAIN` for its parameter. Pipeline approval for production stateful changes is intentionally deferred to Phase 5.

## CI/CD Pipeline

The CI pipeline is defined in `bin/pipeline.ts` using `opinionated-ci-pipeline`. Deployment account, region, project name, and repository are loaded from the ignored local file `pipeline.config.json`.

```txt
GitHub main → quality gates → dev stateless → approval + dev stateful
                          → staging stateless → approval + staging stateful
                          → prod stateless → approval + prod stateful
```

Stateless stages deploy the AppSync API and Lambda code. Stateful stages deploy only the stable stateful stack; each requires approval and runs an environment-specific `cdk diff` before deployment. Feature-branch deployments are deliberately disabled until their lifecycle and stateful-resource policy are reviewed.

### Required setup before the first CI deployment

1. Copy and edit the local configuration:

   ```sh
   cp infra/cdk/pipeline.config.example.json infra/cdk/pipeline.config.json
   ```

2. Create a fine-grained GitHub token for the configured repository with read access to Contents and write access to Commit statuses and Webhooks.
3. Store it as a SecureString named `/<projectName>/ci/repositoryAccessToken` in the configured AWS region. Do not commit the token or local pipeline config.
4. Bootstrap the configured target account:

   ```sh
   pnpm exec cdk bootstrap aws://<account-id>/<region>
   ```

5. Review the template and deploy the CI stack:

   ```sh
   pnpm cdk:pipeline:synth
   pnpm cdk:pipeline:deploy
   ```

The first deployment creates the GitHub webhook and AWS-native CI resources. It is intentionally a manual operator action.

### Personal environments

Personal environments are direct, isolated deployments. For example, to create an environment named `lukasz`:

```sh
pnpm exec cdk synth -c env=lukasz -c personal=true
pnpm exec cdk diff -c env=lukasz -c personal=true --all
pnpm exec cdk deploy -c env=lukasz -c personal=true --all
```

This creates `your-project-name-lukasz-stateful` and `your-project-name-lukasz-core-api`. It uses a separate SSM parameter path under `/your-project-name/lukasz/`. Remove it when no longer needed:

```sh
pnpm exec cdk destroy -c env=lukasz -c personal=true --all
```

### Feature branches

Feature-branch deployment is configured locally in `pipeline.config.json`:

```json
"featureBranches": {
  "enabled": true,
  "prefixes": ["feature/"]
}
```

Keep `enabled` as `false` to disable it. An enabled empty `prefixes` array deploys every non-default branch; otherwise only matching prefixes deploy. Dynamic environments default to stateless-only and read the stable dev platform identifier, so feature branches cannot create or modify stateful resources. Deploy the dev stateful stack once before enabling feature branches.
