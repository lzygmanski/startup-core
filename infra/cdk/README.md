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
