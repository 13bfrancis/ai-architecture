# AI Architecture

AI Architecture is a macOS desktop application for designing architecture and flow diagrams with an AI collaborator. The primary artifact is the diagram: users work on an infinite canvas, open a floating chat when useful, and ask an LLM to create or revise the diagram through a small semantic diagram language.

This document is the durable project brief. Numbered specifications define implementable behavior, numbered design documents define the user experience and visual system, and `AGENTS.md` defines the small set of rules an agent must follow on every task.

## Product principles

1. **Diagram first.** Chat supports the canvas; it is not the product's primary artifact.
2. **Semantic before visual.** The LLM edits a validated diagram model rather than pixels or React components.
3. **Provider independence.** Product code depends on an application-owned AI contract, not on Codex app-server or any one model vendor.
4. **Portable core.** Domain, diagram, AI, data, and UI code live in reusable packages when they form a real runtime or reuse boundary.
5. **Secure desktop boundaries.** Privileged Node and Electron capabilities stay outside the renderer.
6. **Specs govern implementation.** Binding specs and designs cannot be silently contradicted by code.

## Repository shape

The project is a strict TypeScript monorepo managed by pnpm workspaces and Turborepo.

| Path | Responsibility |
| --- | --- |
| `apps/desktop` | Electron Forge application and composition root |
| `apps/desktop/src/main` | Electron lifecycle, privileged services, database and AI adapter orchestration |
| `apps/desktop/src/preload` | Narrow, typed `contextBridge` API |
| `apps/desktop/src/renderer` | React UI, TanStack Router routes, canvas and chat presentation |
| `packages/ai` | Provider-neutral AI contracts, events, capabilities and errors |
| `packages/ai-provider-codex` | Node-only Codex app-server adapter |
| `packages/contracts` | Zod contracts safe to share across process boundaries |
| `packages/core` | Platform-independent domain rules and workflows |
| `packages/database` | Node-only persistence schema, migrations and repositories |
| `packages/diagram-language` | Diagram DSL grammar, AST, parser, formatter, validation and migrations |
| `packages/ui` | Browser-safe shared UI, tokens, styles and shadcn/ui components |
| `docs/specs` | Numbered product and technical specifications |
| `docs/designs` | Numbered UX, interaction and visual design specifications |

Create a package only for a meaningful runtime, reuse, ownership, or testing boundary. Do not turn ordinary source folders into packages. Internal packages are initially private and consumed directly from TypeScript source through workspace dependencies and package exports.

## Desktop architecture

The renderer is an unprivileged web application. It calls the preload API, the preload validates and forwards typed messages, and the main process owns Electron, filesystem, database, subprocess, credential and AI-provider access.

| Layer | May depend on | Must not depend on |
| --- | --- | --- |
| Renderer | React, Router, Query, Zustand, `ui`, browser-safe `contracts`, browser-safe core/diagram APIs | Electron, Node built-ins, database, provider adapters |
| Preload | Electron `contextBridge`, IPC contracts, Zod | React UI, database implementation, broad Node APIs exposed to the page |
| Main | Electron, Node, database, AI providers, shared contracts/core | Renderer implementation |
| Reusable packages | Only dependencies appropriate to the package's declared runtime | Accidental Electron or React coupling |

Electron windows use `nodeIntegration: false`, `contextIsolation: true`, sandboxing where compatible, a restrictive content security policy, blocked unexpected navigation/window creation, and an allowlisted preload surface. All external and cross-process values are untrusted until validated.

## Front-end foundation

- React and Vite power the Electron renderer.
- TanStack Router provides file-based routing. Generated route-tree files are build artifacts and must not be hand-edited.
- TanStack Query owns asynchronous state that represents remote, process or persisted resources.
- Zustand owns shared client-only state when React-local state is insufficient.
- Tailwind CSS v4 and shadcn/ui form the styling and component foundation.
- CSS custom properties expose semantic design tokens. Components consume semantic tokens rather than hard-coded palette values.
- The initial theme is a neutral, accessible placeholder. Branding is intentionally deferred.

Design documents must be detailed enough to implement consistently. When relevant they define token names and values, layout geometry, typography, component variants, states, focus behavior, keyboard behavior, motion, responsive/window behavior, empty/loading/error states and accessibility requirements.

## Diagram language direction

The diagram DSL is the stable seam between user intent, AI output, domain behavior, persistence and rendering. It should be small enough for reliable structured generation and expressive enough for architecture and flow diagrams.

The language is expected to model:

- stable identifiers;
- nodes, ports, edges, groups and system boundaries;
- semantic node and relationship types;
- labels, annotations and metadata;
- hierarchy and containment;
- layout intent and constraints, with optional pinned positions;
- semantic design-token references rather than raw presentation values;
- format versioning and migrations;
- deterministic parsing, formatting and validation;
- actionable validation diagnostics; and
- patch operations so AI revisions do not require replacing an entire document.

The grammar, concrete syntax, canvas engine and persistence representation require later specs. The DSL package must remain independent of Electron and React.

## AI architecture direction

Application code talks to an `AiProvider`-style contract owned by `packages/ai`. The contract must cover provider status, conversations, streaming chat, structured object generation, cancellation, normalized errors and explicit capability discovery.

The first adapter is `packages/ai-provider-codex`. The Electron main process launches the locally authenticated `codex app-server` process over its default JSONL stdio transport and translates its threads, turns and streamed events into the application contract. App-owned conversation identifiers must not be identical to provider identifiers; provider thread IDs are adapter metadata.

Codex app-server is isolated because the protocol is evolving. Renderer code must never speak its protocol directly. A future API-key or subscription-backed adapter can use AI SDK Core without changing application consumers. AI SDK UI may use a custom Electron IPC transport for chat.

Structured generation follows one validation path:

1. Define the application contract in Zod.
2. Convert the supported schema to JSON Schema for the model/provider.
3. Receive the structured result.
4. Validate the result again with Zod before domain code sees it.

AI-bound schemas must stay within reliably representable JSON Schema types. Unsupported JavaScript-specific values or transforms must fail explicitly rather than weaken validation.

## Data contracts

Zod v4 is the runtime source of truth for:

- renderer/preload/main IPC payloads;
- AI requests, stream events and structured results;
- imported or external data;
- environment and configuration values; and
- persisted JSON documents.

Infer TypeScript types from their owning schemas. Colocate schemas with the package that owns the contract; do not build an unrelated global schema dump.

## Environment management

Use dotenvx only when configuration is needed. Encrypted `.env*` files may be committed. Private keys in `.env.keys` and `DOTENV_PRIVATE_KEY*` values must never be committed or exposed to the renderer, logs or error messages. The project shell may contain a comment-only `.env` without generating a key.

## Quality strategy

- Vitest covers unit, component and code-level integration tests.
- Playwright covers Electron integration and end-to-end behavior. Its Electron support is experimental, so keep launch helpers centralized and thin.
- Biome owns formatting and linting; TypeScript owns type checking.
- Every implementation performs a targeted acceptance audit against the applicable binding specs and designs.

## Specification and design system

### Files and identifiers

- Specs use `docs/specs/NNN-kebab-case-name.md` and IDs such as `SPEC-001`.
- Designs use `docs/designs/NNN-kebab-case-name.md` and IDs such as `DESIGN-001`.
- `docs/specs/_template.md` is an unnumbered scaffold, not a specification. Copy it for new specs, remove irrelevant sections and never include it when selecting the next ID.
- Each collection has an independent, monotonically increasing three-digit sequence.
- `SPEC-000` is reserved for project-shell initialization. Designs begin at `DESIGN-001`.
- Never reuse or renumber an identifier, including after a document is deferred.
- Each document starts with minimal YAML frontmatter containing `id` and `status`.

### Statuses

| Status | Meaning |
| --- | --- |
| `draft` | Being defined; not approved or binding for implementation |
| `ready` | Approved, binding and available for implementation |
| `in-progress` | Binding and currently being implemented |
| `implemented` | Implementation passed the document's acceptance audit |
| `deferred` | Intentionally excluded; do not implement without explicit approval |

Only `ready`, `in-progress` and `implemented` documents are binding. Material requirement changes, promotion to `ready`, and deferral require explicit user approval. Begin implementation by moving the governing documents to `in-progress`; mark them `implemented` only after their acceptance criteria pass.

### Coupled spec and design work

A specification has design impact when it changes visible layout, content, interaction, component behavior, tokens, theming, accessibility or user-facing states. In that case the spec-writing workflow must also run the design-writing workflow. Resolve both interviews before writing, create or update both documents in the same change, and cross-reference them. Neither document may leave a material decision to the implementer.

Before changing code, identify the applicable specs and designs. If they conflict, are ambiguous or cannot all be honored, stop and ask the user. If the user approves a deviation, update the governing document first. Never rewrite or weaken a document merely to make nonconforming code appear compliant.

## Naming and code conventions

- Project/package slug: `ai-architecture`.
- Internal package scope: `@ai-architecture/*`.
- Use kebab-case for files and directories.
- Prefer named exports for authored modules; framework-required configuration is exempt.
- Avoid barrel files. Define explicit package exports instead.
- Keep strict TypeScript enabled and avoid unsafe boundary casts.

## Known deferred decisions

The following are intentionally not selected by the project-shell spec: canvas/rendering engine, database technology and schema, exact DSL syntax, document persistence/lifecycle, collaboration, import/export formats, non-Codex providers, signing/notarization, distribution, Intel/universal packaging and non-macOS support.

## Implementation references

- [Codex app-server](https://developers.openai.com/codex/app-server)
- [Electron security](https://www.electronjs.org/docs/latest/tutorial/security)
- [Electron Forge Vite plugin](https://www.electronforge.io/config/plugins/vite)
- [TanStack Router with Vite](https://tanstack.com/router/latest/docs/installation/with-vite)
- [shadcn/ui monorepo setup](https://ui.shadcn.com/docs/monorepo)
- [dotenvx encryption](https://dotenvx.com/docs/quickstart/encryption/)
