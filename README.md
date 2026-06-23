# Startup Core

A reusable, product-neutral platform foundation for future startup applications. The repository is an Nx monorepo managed with pnpm and TypeScript.

## Architecture

The platform follows domain-driven design, clean/hexagonal architecture, and a functional-core, imperative-shell approach. Domain and application code are pure, dependency-injected functions. Frameworks, AWS SDKs, persistence, GraphQL resolvers, and UI are outer adapters.

Planned dependency direction:

```txt
UI / handlers → application use cases → domain functions → ports → adapters
```

`libs/core` stays generic. Business modules own their domain, application, contracts, and UI code; they may use core contracts but not core internals. Read [architecture boundaries](docs/architecture-boundaries.md) before adding a project.

## Repository Layout

```txt
apps/              Future frontend hosts and remotes
services/          Future serverless API entry points
libs/core/         Generic domain, application, and contracts libraries
libs/shared/       Generic cross-cutting libraries
libs/modules/      Future business modules
libs/adapters/     Future infrastructure integrations
infra/             Future CDK deployment code
docs/              Architecture decisions and conventions
```

Only the generic foundation exists in Phase 1. There are deliberately no apps, APIs, infrastructure stacks, authentication, product modules, or Module Federation configuration yet.

## Quality Commands

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm format:check
pnpm affected:lint
```

Prettier formats source files, ESLint enforces TypeScript and architecture rules, Vitest is the base unit-test runner, and Husky runs lint-staged before commits.
