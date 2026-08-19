---
id: SPEC-000
status: implemented
---

# Initialize the project shell

## Summary

Initialize a runnable, tested macOS Electron project shell for AI Architecture. The result is a pnpm/Turborepo monorepo containing the desktop app and all agreed internal package shells, with the core toolchain installed and wired. The desktop app displays one simple, presentable introduction route and intentionally provides no diagram, chat, AI, database or DSL product behavior.

This specification is implemented and passed its acceptance audit.

## Context

The project needs a stable foundation before product capabilities are specified. The shell must prove that the package manager, task graph, Electron process boundaries, Vite renderer, file-based routing, shared UI, cross-workspace source imports, validation, tests and environment conventions work together.

[DESIGN-001](../designs/001-project-shell-foundation.md) governs the placeholder shell's layout, neutral token foundation, runtime-information states and accessibility behavior. Its styling is deliberately neutral and must not be treated as permanent branding. If implementation introduces material interaction or visual decisions beyond that design, revise the design through `$write-designs` before implementing them.

## Goals

- Create a macOS-only Electron Forge application using Vite, React and strict TypeScript.
- Establish pnpm workspaces and Turborepo across `apps/*` and `packages/*`.
- Create every agreed internal package as a resolvable TypeScript-source workspace.
- Establish secure, typed main/preload/renderer boundaries with one harmless IPC proof.
- Wire TanStack Router file-based routing, Tailwind CSS v4 and shadcn/ui.
- Install the agreed state, AI, validation, environment and test dependencies.
- Provide consistent root commands and green smoke tests.
- Leave the repository ready for later, numbered product specs.

## Non-goals

- Infinite canvas, diagram rendering, selection or editing.
- Diagram DSL grammar, parsing, formatting or validation behavior.
- Chat UI, Codex app-server process launch or any functional AI provider.
- Database selection, schema, migrations or persistence behavior.
- Real application settings, telemetry, collaboration, import/export or updater behavior.
- Production branding or a final design system.
- Code signing, notarization, distribution, auto-update, App Store packaging, Intel/universal builds or non-macOS targets.

## Required repository structure

| Path | Required shell content |
| --- | --- |
| `apps/desktop` | Private Electron Forge workspace with Vite configs, Forge config and desktop scripts |
| `apps/desktop/src/main` | Electron startup, window creation, security policy and typed IPC handler |
| `apps/desktop/src/preload` | Narrow `contextBridge` exposure for the proof IPC call |
| `apps/desktop/src/renderer` | React entry, Router setup, routes and global styles |
| `packages/ai` | Private `@ai-architecture/ai` source package shell |
| `packages/ai-provider-codex` | Private Node-only `@ai-architecture/ai-provider-codex` source package shell |
| `packages/contracts` | Private browser/process-safe `@ai-architecture/contracts` source package with proof IPC schema |
| `packages/core` | Private platform-independent `@ai-architecture/core` source package shell |
| `packages/database` | Private Node-only `@ai-architecture/database` source package shell |
| `packages/diagram-language` | Private platform-independent `@ai-architecture/diagram-language` source package shell |
| `packages/ui` | Private browser-safe `@ai-architecture/ui` source package with shared styles and initial shadcn/ui component(s) |
| `docs/specs` | This spec and future numbered specs |
| `docs/designs` | Empty directory ready for numbered design documents |
| `.agents/skills/write-specs` | Repository spec-writing skill |
| `.agents/skills/write-designs` | Repository design-writing skill |

Each workspace must have a `package.json`, strict TypeScript configuration appropriate to its runtime, explicit package exports and at least one intentional source export. Workspace dependencies use `workspace:*`. Internal packages are bundled/transpiled from TypeScript source by their consumers; do not add a separate package build/publish pipeline in this spec.

## Toolchain requirements

### Runtime and workspace

- Use an active Node.js LTS release and record it in a conventional version file.
- Pin pnpm through the root `packageManager` field and commit `pnpm-lock.yaml`.
- Define `apps/*` and `packages/*` in `pnpm-workspace.yaml`.
- Configure `.npmrc` with `node-linker=hoisted`, as required by Electron Forge's pnpm support.
- Configure Turborepo tasks for build, development, lint, typecheck and test workflows with correct dependency edges and outputs.
- Use current stable, mutually compatible dependency versions at implementation time; record exact resolution in the lockfile.

### Required dependency families

| Area | Required packages or tools |
| --- | --- |
| Desktop | `electron`, Electron Forge CLI, Vite plugin, fuses support and a macOS-appropriate ZIP maker |
| Renderer | `react`, `react-dom`, `vite`, `@vitejs/plugin-react` |
| Routing/state | `@tanstack/react-router`, `@tanstack/router-plugin`, `@tanstack/react-query`, `zustand` |
| UI | `tailwindcss` v4, `@tailwindcss/vite`, `shadcn`, and CLI-managed shadcn/ui dependencies including Lucide icons and class utilities |
| AI foundation | AI SDK packages `ai` and `@ai-sdk/react`; do not add a model-provider SDK yet |
| Contracts | `zod` v4 |
| Environment | `@dotenvx/dotenvx` |
| Quality | `typescript`, `@biomejs/biome`, `vitest`, `@playwright/test`, and required React/Node type packages |
| Monorepo | `turbo` and `pnpm` through Corepack/package metadata |

Keep dependencies in the narrowest workspace that owns them. Root dependencies are limited to repository-wide tooling. Do not install a database driver, canvas library or direct AI provider package under this spec.

## Root commands

The root package must expose these commands and route them through Turbo or the owning workspace as appropriate:

| Command | Behavior |
| --- | --- |
| `pnpm dev` | Start the Electron desktop app in development mode |
| `pnpm build` | Produce compile/bundle outputs required to prove the repository builds |
| `pnpm lint` | Run Biome lint checks across governed source files |
| `pnpm format` | Apply Biome formatting |
| `pnpm format:check` | Check formatting without mutation |
| `pnpm typecheck` | Run strict TypeScript checks across workspaces |
| `pnpm test` | Run Vitest suites once |
| `pnpm test:e2e` | Run the Playwright Electron smoke suite |

Workspace-level scripts may exist, but the root commands are the supported human and agent interface.

## Electron shell requirements

### Process security

The desktop window must:

- use `nodeIntegration: false`;
- use `contextIsolation: true`;
- enable renderer sandboxing unless a documented Forge limitation prevents it;
- load only the expected local Vite development URL or packaged renderer file;
- apply a restrictive content security policy appropriate to development and packaged modes;
- deny unexpected navigation and new-window creation;
- expose no raw `ipcRenderer`, filesystem, subprocess or environment access; and
- dispose registered handlers/listeners cleanly during shutdown and reload.

### Typed boundary proof

Implement one read-only proof capability named conceptually `getRuntimeInfo`:

1. `packages/contracts` owns Zod schemas for the request/response and inferred TypeScript types.
2. The main process returns non-sensitive application name, version and platform information.
3. The preload exposes one narrow Promise-returning method through `contextBridge`.
4. The renderer calls the method without importing Electron or Node APIs.
5. Values are parsed at the receiving boundary, and failures produce a safe renderer-visible error state.

This capability exists only to prove the architecture. It must not become a generic bridge.

## Renderer shell requirements

- Configure TanStack Router's Vite plugin before the React Vite plugin.
- Use file-based routes under `apps/desktop/src/renderer/routes` with an index route.
- Generate `routeTree.gen.ts`; exclude it from manual formatting/linting and never hand-edit it.
- Mount `QueryClientProvider` and a Router provider at the application entry.
- Install Zustand without creating a meaningless global store solely to demonstrate installation.
- Import shared styles and at least one component from `@ai-architecture/ui`.

The index route must render a polished but restrained full-window shell:

- the product name “AI Architecture”;
- a short label making clear that this is the initialized desktop shell;
- a subtle neutral background treatment suitable as a future canvas placeholder;
- a compact shared shadcn/ui surface such as a Card; and
- optional non-sensitive runtime version/platform text from the proof bridge.

The page must have correct semantic heading structure, visible keyboard focus where applicable, sufficient color contrast, no horizontal overflow at a reasonable minimum macOS window size, and no fake diagram/chat controls.

## UI and design-system initialization

- Initialize shadcn/ui for a Vite monorepo with `apps/desktop` and `packages/ui` configurations.
- Use a neutral base color, CSS variables and the same style/icon/base-color settings in both `components.json` files.
- For Tailwind CSS v4, leave the legacy Tailwind config path empty and use the Vite integration.
- Store global token definitions and shared component styling in `packages/ui`.
- Export shared UI through explicit subpath exports rather than a barrel file.
- Treat generated initial tokens as replaceable placeholders, not approved brand tokens.

## Package shell rules

- `packages/ai` may contain provider-neutral placeholder types but no provider implementation.
- `packages/ai-provider-codex` must declare a Node runtime boundary but must not spawn Codex yet.
- `packages/contracts` contains the only functional shell contract: the runtime-info IPC schema.
- `packages/core` contains no Electron, React or persistence dependencies.
- `packages/database` contains no selected database dependency or fake repository implementation.
- `packages/diagram-language` contains no grammar or speculative AST.
- `packages/ui` contains only the minimum shared styles/utilities/components required by the intro shell.

Add focused import-resolution tests that prove browser-safe packages resolve in the renderer/test environment and Node-only packages resolve in a Node test environment. Do not import Node-only packages into the renderer as a smoke test.

## Environment configuration

- Install dotenvx and route future environment-aware scripts through it only when variables are actually needed.
- Commit a comment-only `.env` explaining that secrets must be added with dotenvx and encrypted before commit.
- Add `.env.keys` and any plaintext secret variants to `.gitignore`.
- Do not run encryption merely to create a key for an empty file.
- Do not add placeholder secrets or expose environment values to the renderer.

## Code quality configuration

- Enable strict TypeScript across every workspace with runtime-appropriate DOM/Node libraries.
- Configure Biome as the only formatter/linter for supported TypeScript, TSX, JSON and configuration files.
- Ignore generated route trees and generated/build output.
- Use kebab-case files/directories and named exports except for framework-required config conventions.
- Do not create barrel files.

## Testing requirements

### Vitest

Provide focused tests for:

- runtime-info Zod contract acceptance and rejection;
- the renderer intro route/component;
- internal TypeScript-source package resolution in browser-safe and Node environments; and
- any non-trivial shell utility introduced during setup.

Do not add empty tests that assert constants only to inflate coverage.

### Playwright

Centralize the experimental Playwright Electron launch helper. The end-to-end smoke test must launch the built or test-configured Electron app on macOS and verify:

- a window opens;
- the “AI Architecture” heading is visible;
- runtime information arrives through the preload boundary or its explicit safe error state renders;
- the renderer has no uncaught page errors; and
- the app closes cleanly.

## Acceptance criteria

| ID | Criterion |
| --- | --- |
| AC-001 | A clean checkout on the pinned Node/pnpm versions completes `pnpm install --frozen-lockfile`. |
| AC-002 | `pnpm dev` opens the macOS Electron app and shows the presentable shell index route. |
| AC-003 | Electron security settings, navigation restrictions and the narrow preload bridge meet this spec; the renderer has no Node/Electron access. |
| AC-004 | The runtime-info proof crosses renderer, preload and main using the owning Zod contracts and handles invalid/failure results safely. |
| AC-005 | Every required package exists, resolves directly from TypeScript source in an appropriate environment and respects its runtime boundary. |
| AC-006 | TanStack file-based routing generates and renders the index route without manual edits to `routeTree.gen.ts`. |
| AC-007 | Tailwind CSS v4 and shadcn/ui are initialized as a monorepo; the shell consumes shared tokenized UI from `packages/ui`. |
| AC-008 | `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` all exit successfully. |
| AC-009 | `pnpm test:e2e` passes the macOS Electron smoke scenario and shuts the process down cleanly. |
| AC-010 | The comment-only `.env` is committed, `.env.keys` is ignored, and the repository contains no secret or generated private key. |
| AC-011 | No canvas, diagram, chat, Codex runtime, database or other product feature is implemented. |
| AC-012 | An acceptance audit records evidence for AC-001 through AC-011 before this spec is marked `implemented`. |

## Acceptance audit

Audit completed on 2026-08-18 against the implementation and DESIGN-001.

| ID | Evidence | Result |
| --- | --- | --- |
| AC-001 | Node 24.14.0 and pnpm 10.32.1 are pinned; a full `pnpm install --frozen-lockfile` reinstall completed from `pnpm-lock.yaml`. | Pass |
| AC-002 | `pnpm dev` started the Vite renderer server, built main/preload targets and reported `Launched Electron app`; the shell was also visually inspected through the Electron smoke harness. | Pass |
| AC-003 | `main-window-options.test.ts` locks `nodeIntegration: false`, `contextIsolation: true` and sandboxing; the Electron test verifies absent Node globals, the one-method API and denied window creation; `window-security.ts` denies navigation. | Pass |
| AC-004 | Contract tests cover accepted/rejected request and response values, component tests cover the safe error state, and Electron verifies `Desktop shell ready · v0.1.0 · macOS` across the live bridge. | Pass |
| AC-005 | All required workspaces expose intentional TypeScript-source subpaths; browser-safe and Node-only resolution tests pass, as do all eight strict workspace typechecks. | Pass |
| AC-006 | TanStack Router generated `routeTree.gen.ts` from the root/index route files during Vite builds; the generated file is excluded from Biome and renders in Electron. | Pass |
| AC-007 | Both `components.json` files use matching new-york/lucide/neutral settings; Tailwind CSS v4 compiles shared semantic styles and the renderer consumes the shared Card export. | Pass |
| AC-008 | `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` all completed successfully. | Pass |
| AC-009 | `pnpm test:e2e` launches the built Electron app, validates heading/runtime/security/layout/appearance/zoom behavior, records no page errors and closes cleanly. | Pass |
| AC-010 | `.env` is comment-only, `.env.keys` and plaintext variants are ignored, and a repository scan found no API key, token or private-key material. | Pass |
| AC-011 | Source/package review confirms only shell metadata, runtime-info proof, shared Card/styles and infrastructure exist; no deferred product feature or dependency was introduced. | Pass |
| AC-012 | This audit maps AC-001 through AC-011 to passing command, test, inspection and repository evidence before the status transition to `implemented`. | Pass |

## Implementation sequence

1. After explicit approval, change this spec from `draft` to `ready`.
2. When implementation begins, change it to `in-progress`.
3. Establish root workspace/tooling configuration and package shells.
4. Configure Electron main/preload/renderer boundaries and the proof contract.
5. Initialize routing and shared UI, then implement the intro route.
6. Add unit and Electron smoke tests.
7. Run every acceptance command and perform a spec audit.
8. Change the status to `implemented` only when all criteria pass.

## Deferred work

All product capabilities and packaging/distribution concerns listed under Non-goals remain deferred to future numbered specs. Deferral here does not choose a technology or architecture for those features.

## References

- [DESIGN-001: Project shell foundation](../designs/001-project-shell-foundation.md)
- [Electron Forge getting started](https://www.electronforge.io/)
- [Electron Forge Vite plugin](https://www.electronforge.io/config/plugins/vite)
- [Electron security checklist](https://www.electronjs.org/docs/latest/tutorial/security)
- [TanStack Router Vite installation](https://tanstack.com/router/latest/docs/installation/with-vite)
- [shadcn/ui monorepo requirements](https://ui.shadcn.com/docs/monorepo)
- [dotenvx encryption](https://dotenvx.com/docs/quickstart/encryption/)
