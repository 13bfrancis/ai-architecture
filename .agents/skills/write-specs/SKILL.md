---
name: write-specs
description: Create, revise, review, audit, or change the status of numbered product and technical specifications in docs/specs. Use whenever work defines what the project must do, prepares implementation requirements, or checks implementation against a spec. Run a gated requirements interview before material writing and trigger the write-designs workflow whenever the spec has design impact.
---

# Write specifications

Produce specifications that leave no material product or engineering decision to the implementer. Question the user rigorously, but ask only questions that can change scope, behavior, architecture, risk, verification or a coupled design.

## Establish context

1. Read `AGENTS.md` and `PROJECT.md`.
2. Read the relevant files under `docs/specs/` and `docs/designs/`.
3. Inspect relevant implementation only when revising or auditing an existing behavior.
4. State whether the request is a new spec, a revision, a status change or an acceptance audit.
5. Identify contradictions, dependencies and binding documents before interviewing.

Do not ask the user to repeat a decision already established by an authoritative document. Surface conflicts instead of choosing a side.

## Detect design impact

Treat a spec as design-impacting when it defines or changes any of the following:

- visible layout, content, navigation or information hierarchy;
- user interaction, keyboard behavior or focus behavior;
- components, variants, states or responsive/window behavior;
- design tokens, theming, typography, color, spacing, motion or iconography;
- loading, empty, error, success, disabled or offline presentation; or
- accessibility behavior or user-facing feedback.

When design impact exists:

1. Announce that a companion design document is required.
2. Run the `$write-designs` workflow using the same working brief.
3. Maintain one combined list of unresolved spec and design decisions.
4. Do not write either document until both interview gates are clear.
5. Present one combined decision summary for user confirmation.
6. Create or update the spec and design together and cross-reference them in their bodies.

Do not trigger a companion design for purely internal work with no user-visible or interaction effect. When uncertain, ask the user whether the behavior is observable rather than silently skipping design work.

## Enforce the interview gate

Before creating or materially editing a file:

1. Build a visible list of open material decisions.
2. Ask focused questions in short rounds, prioritizing blockers and high-cost choices.
3. Explain meaningful options and recommend a default when that helps the user decide.
4. Update the open-decision list from each answer.
5. Continue until every material question is answered, explicitly deferred, or explicitly placed out of scope by the user.

Treat “I don't know,” vague agreement and conflicting answers as unresolved. Offer concrete options, but never choose a material answer merely to finish faster. A question is material when different answers could change observable behavior, public contracts, data ownership, security/privacy, architecture, dependencies, migration, performance targets, accessibility or acceptance criteria.

Minor wording, formatting and non-semantic corrections are not material.

When the list is clear, summarize the proposed scope, key decisions, non-goals, coupled design work and acceptance criteria. Ask the user to confirm that summary. Do not begin material file writing before confirmation.

## Cover the relevant question areas

Adapt the interview; do not mechanically ask irrelevant questions.

- problem, users and desired outcome;
- goals, non-goals and boundaries;
- primary, alternate and failure workflows;
- states, transitions, cancellation, retry and recovery;
- inputs, outputs, ownership and source of truth;
- public APIs, IPC, events, schemas and compatibility;
- persistence, migration, deletion and lifecycle;
- security, privacy, permissions and trust boundaries;
- performance, scale and resource limits;
- accessibility and user-visible behavior;
- telemetry, diagnostics and supportability;
- rollout, compatibility and deferred work;
- test strategy and objectively verifiable acceptance criteria; and
- impact on existing specs and designs.

## Choose the file and status

- Store specs under `docs/specs/`, nesting by domain only when an established structure requires it.
- Name new files `NNN-kebab-case-name.md`.
- Find the highest spec number recursively and take the next unused number.
- Reserve `000` for project-shell initialization. Normal specs begin at `001`.
- Never reuse or renumber an ID.
- Start new specs as `draft` unless the user explicitly approves another valid transition.

Use this frontmatter shape:

```yaml
---
id: SPEC-001
status: draft
---
```

Use only these statuses:

- `draft`: unresolved or awaiting approval; not binding for implementation;
- `ready`: explicitly approved and binding;
- `in-progress`: binding implementation has begun;
- `implemented`: implementation passed the acceptance audit; or
- `deferred`: explicitly excluded until the user approves revival.

Require explicit user approval for material requirement changes, promotion to `ready`, or transition to `deferred`. Move `ready` to `in-progress` when implementation starts. Move to `implemented` only after every acceptance criterion and applicable design audit passes.

## Write the specification

Use sections appropriate to the work, normally:

1. Summary
2. Context
3. Goals
4. Non-goals
5. User workflows or system behavior
6. Functional requirements
7. Architecture and boundaries
8. Data contracts and lifecycle
9. Failure handling and edge cases
10. Security, privacy and accessibility
11. Testing and observability
12. Acceptance criteria
13. Dependencies, related specs and related designs
14. Deferred work

Write requirements with stable labels such as `REQ-001` when individual traceability adds value. Write acceptance criteria as observable pass/fail statements. Record explicitly deferred choices in Deferred Work, not in an unresolved catch-all section.

Do not prescribe internal implementation detail unless it is an agreed constraint, required boundary or necessary for interoperability. Do not include an unresolved material “Open Questions” section in a spec that is being presented as ready to implement.

## Revise or audit

For a revision, preserve the existing ID and confirm material changes through the same interview gate. Update coupled design documents in the same change.

For an implementation audit:

1. Read only the relevant binding specs and designs plus the affected code and tests.
2. Map each acceptance criterion to evidence.
3. Report every gap; do not reinterpret requirements to create a pass.
4. Fix documentation only when behavior was explicitly re-decided by the user.
5. Mark `implemented` only when all criteria pass or the user explicitly changes the governing requirements first.

## Self-audit before handoff

Verify numbering, frontmatter, status meaning, links, cross-document consistency, testability and acceptance-criteria coverage. Fix structural defects. Never weaken a requirement during self-audit.
