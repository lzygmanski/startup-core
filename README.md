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
apps/shell/        React + Rsbuild platform shell
services/core-api/ Generic GraphQL resolver source and schema
libs/core/         Generic domain, application, and contracts libraries
libs/shared/ui/    Shared shadcn-style UI primitives
libs/modules/      Future business modules
libs/adapters/     Future infrastructure integrations
infra/             Future CDK deployment code
docs/              Architecture decisions and conventions
```

The generic shell uses TanStack Router, TanStack Query, Tailwind CSS, and a shared UI button. The source-level core API exposes a `getCoreHealth` GraphQL contract through a thin, validated resolver. There are deliberately no deployed AWS resources, persistence, authentication, product modules, or Module Federation configuration yet.

## Run the Shell

```sh
pnpm nx serve shell
pnpm nx test core-api
```

Open the local URL printed by Rsbuild (normally `http://localhost:3000`) to view the Hello World page.

## Quality Commands

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm format:check
pnpm affected:lint
```

Prettier formats source files, ESLint enforces TypeScript and architecture rules, Vitest is the base unit-test runner, and Husky runs lint-staged before commits.
