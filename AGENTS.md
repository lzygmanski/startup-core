# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm-managed Nx monorepo in Phase 3. `apps/shell` is the generic React/Rsbuild frontend, and `services/core-api` contains the source-level GraphQL health resolver. AWS deployment, persistence, authentication, business modules, and Module Federation are not implemented yet. Follow these locations as projects are added:

- `apps/shell/` — generic React shell with TanStack Router and Query.
- `services/core-api/` — GraphQL schema, handler, mappers, and resolvers.
- `libs/core/` — reusable generic domain, application, and contracts code.
- `libs/shared/` — generic cross-cutting code.
- `libs/modules/<module>/` — module-specific domain, application, contracts, and UI.
- `libs/adapters/` and `infra/` — integrations and future CDK infrastructure.

Keep `libs/core` product-neutral. Product-specific behavior belongs in a module, not the core.

## Build, Test, and Development Commands

Use pnpm only. Install exact locked dependencies with `pnpm install --frozen-lockfile`. Run the root quality checks before submitting changes:

```sh
pnpm format:check  # verify Prettier formatting
pnpm lint          # ESLint, then Nx project lint targets
pnpm typecheck     # strict TypeScript, then Nx project targets
pnpm test          # Vitest, then Nx project test targets
pnpm build         # all Nx build targets
pnpm nx serve shell # run the local Rsbuild shell
```

For incremental CI work, use `pnpm affected:lint`, `affected:typecheck`, `affected:test`, or `affected:build`. These need a meaningful Git base/head once the repository has its first commit.

## Coding Style & Architecture

Use two-space indentation, Prettier, and ESLint. TypeScript is strict; avoid `any`, prefer `unknown` at external boundaries, and provide explicit return types for exported functions. Name files by role: `create-profile.ts`, `create-profile.test.ts`, and `profile.ts`.

Use a functional core and imperative shell. Domain/application code must be small, pure, immutable, and independent of React, GraphQL, AWS SDK, and persistence types. Validate external input in adapters/handlers; UI components and Lambda handlers only orchestrate.

GraphQL schema and resolver input are boundary contracts, not domain models. Keep AWS and GraphQL types out of `libs/core`; inject ports such as clocks into application functions.

Tag every future Nx project with one `type:*` and one `scope:*` tag; see `docs/architecture-boundaries.md`. Do not bypass the configured dependency-boundary rules or share business logic through UI composition.

## Testing Guidelines

Use Vitest with colocated `*.test.ts` or `*.test.tsx` files. Test domain and application functions directly, including expected Result/Either errors. Keep adapter tests separate from pure logic. React Testing Library, MSW, and Playwright are not configured yet.

## Commit & Pull Request Guidelines

There is no commit history yet, so use concise Conventional Commit-style messages: `feat(core): add result helper` or `chore: configure linting`. Husky runs lint-staged before commits.

Pull requests should state scope, link the plan phase or issue, list verification commands, and include screenshots for visible UI. Keep changes focused and do not advance to a later phase without review.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
