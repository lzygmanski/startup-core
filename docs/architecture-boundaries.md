# Architecture Boundaries

Every Nx project must declare one `type:*` tag and one `scope:*` tag in its `project.json`.

| Tag family | Values                                                                                                                  |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| Type       | `type:app`, `type:service`, `type:domain`, `type:application`, `type:adapter`, `type:contract`, `type:ui`, `type:infra` |
| Scope      | `scope:core`, `scope:shared`, or a module scope such as `scope:onboarding`                                              |

The ESLint `@nx/enforce-module-boundaries` rule enforces the type-level dependency direction. Domain code is pure and depends only on domain-safe libraries. Application code may depend on domain and contracts. Adapters may depend on application ports, domain, contracts, and external SDKs. Apps and UI libraries consume UI and contracts only.

Projects in one business-module scope may use core contracts but must not import core internals or another module's implementation. Infrastructure projects remain separate from domain code. Add or tighten scope-specific constraints as the first module is introduced.
