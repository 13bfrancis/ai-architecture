# AI Architecture agent instructions

Read `PROJECT.md` before planning substantive work. It contains the product direction, architecture boundaries and repository map. Keep this file small: add only rules that should affect nearly every task.

## Specs and designs are authoritative

- Product and technical specs live in `docs/specs/`; UX and visual designs live in `docs/designs/`.
- Use `$write-specs` whenever creating, materially updating, reviewing or changing the status of a spec.
- Use `$write-designs` whenever creating, materially updating, reviewing or changing the status of a design file.
- If a spec has visual, interaction, component, token, accessibility or other user-facing impact, run both skills. Resolve both interview gates, create/update both documents in the same change and cross-reference them.
- `ready`, `in-progress` and `implemented` documents are binding. Do not violate one without explicit user approval.
- Before implementation, identify the relevant binding documents. If requirements conflict or are ambiguous, stop and ask.
- When the user approves a changed requirement, update the governing documents before changing code.
- Keep pertinent specs/designs and statuses synchronized with implementation. Never weaken documentation to excuse nonconforming code.
- Move applicable documents to `in-progress` when implementation begins and to `implemented` only after a targeted acceptance audit passes.

## Repository boundaries

- `apps/desktop` is the Electron composition root; keep main, preload and renderer responsibilities separate.
- Renderer code must not import Electron, Node built-ins, database code or provider adapters.
- Expose only narrow typed preload APIs through `contextBridge`; validate IPC values with owning Zod schemas.
- Keep `packages/database` and `packages/ai-provider-*` Node-only.
- Keep `packages/ui` browser-safe and independent of Electron.
- Keep `packages/core` and `packages/diagram-language` platform-independent unless a spec explicitly changes that boundary.
- Add packages only for meaningful runtime, reuse, ownership or testing boundaries.

## Engineering conventions

- Use pnpm and Turborepo. Do not introduce another package manager or commit another lockfile.
- Consume internal packages through `workspace:*` and explicit source exports under `@ai-architecture/*`.
- Use strict TypeScript, kebab-case files/directories and named exports except where a framework requires otherwise.
- Do not add barrel files. Do not hand-edit TanStack Router's generated `routeTree.gen.ts`.
- Use React-local state first, Zustand for shared client state and TanStack Query for async resource state.
- Use Tailwind CSS v4, shadcn/ui and semantic CSS-variable tokens; do not hard-code a parallel design system.
- Use Biome for formatting/linting, Vitest for unit/component integration and Playwright for Electron end-to-end tests.
- Commit encrypted `.env*` files only. Never commit `.env.keys`, private keys or secrets, and never expose them to the renderer.

## Standard checks

Run the relevant subset during development and all applicable checks before handoff:

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
```

If a command does not yet exist because `SPEC-000` is not implemented, follow that spec rather than inventing a competing convention.

## Definition of done

- Behavior and architecture conform to every applicable binding spec and design.
- Pertinent documents and statuses are current.
- Process boundaries and external data are validated; no privileged capability leaks into the renderer.
- Tests cover the change at the lowest useful level and include end-to-end coverage when user-visible behavior or process integration changes.
- Relevant standard checks pass, and the final report names the checks run plus any explicitly approved exceptions.

