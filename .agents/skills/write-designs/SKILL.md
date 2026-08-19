---
name: write-designs
description: Create, revise, review, audit, or change the status of numbered UX, interaction, visual, component, and design-system specifications in docs/designs. Use for user-facing behavior or when write-specs detects design impact. Run a gated design interview and define implementation-ready Tailwind CSS v4, shadcn/ui, semantic-token, state, interaction, and accessibility requirements.
---

# Write design specifications

Create design documents detailed enough that separate implementers produce a consistent experience without inventing visual or interaction rules. Treat design as behavior and a tokenized system, not as decoration.

## Establish context

1. Read `AGENTS.md` and `PROJECT.md`.
2. Read the relevant specs and designs.
3. Inspect existing tokens, `components.json`, shared UI components and affected screens when they exist.
4. State whether this is a new design, revision, status change, acceptance audit or companion to an in-progress spec interview.
5. Identify existing design-system constraints and conflicts before asking questions.

When invoked as a companion to `$write-specs`, use its working brief and combined open-decision list. Do not require the spec file to exist first. Coordinate one confirmation gate, then create or update both documents in the same change.

## Enforce the interview gate

Before creating or materially editing a design file:

1. Classify the design as foundation/tokens, navigation/layout, feature flow, screen, canvas behavior, component or another explicit scope.
2. List every unresolved material design decision.
3. Ask focused questions in short rounds, starting with decisions that shape downstream tokens or components.
4. Offer concrete options and a recommended default when useful.
5. Update the open-decision list after each answer.
6. Continue until every material question is answered, explicitly deferred, or explicitly out of scope.

Treat “make it modern,” “use best practices,” “I don't know” and contradictory preferences as unresolved when they affect implementation. Translate taste language into concrete choices for confirmation. Never invent branding or product behavior simply to close the interview.

After the list is clear, summarize the design direction, token decisions, interaction model, component/state coverage, accessibility requirements, non-goals and acceptance criteria. Obtain user confirmation before material writing.

## Cover the relevant design questions

Adapt the interview to scope. Explore:

- user goal, context, frequency and priority;
- information hierarchy, content and progressive disclosure;
- window sizes, density, layout grid, panels and resizing behavior;
- canvas pan, zoom, selection, placement and spatial feedback when applicable;
- color roles, typography, spacing, sizing, radius, borders, shadows and elevation;
- z-index/layering, overlays, portals and focus containment;
- component anatomy, variants, sizes and composition rules;
- default, hover, active, selected, focus-visible, disabled and read-only states;
- loading, empty, error, success, warning, offline and partial-result states;
- keyboard shortcuts, tab order, pointer behavior and cancellation;
- motion purpose, duration, easing and reduced-motion alternatives;
- contrast, screen-reader names, landmarks, target sizes and zoom/reflow;
- theming and high-contrast behavior;
- copy tone, labels, truncation and localization pressure;
- assets/icons and whether a source asset is required; and
- testable visual and interaction acceptance criteria.

For the infinite canvas, explicitly resolve coordinate feedback, zoom limits, navigation, selection, multi-selection, connection creation, grouping, keyboard operations, overlays, minimap/grid behavior and accessibility alternatives when those concerns are in scope.

## Apply the design-system constraints

- Use Tailwind CSS v4 and shadcn/ui as the implementation foundation.
- Express shared choices as semantic CSS custom properties exposed to Tailwind utilities.
- Prefer role names such as `--background`, `--surface-raised` or `--selection-ring` over raw palette names in component contracts.
- Specify token aliases and usage rules; do not scatter unexplained hex values through component sections.
- Keep `components.json` aliases consistent between `apps/desktop` and `packages/ui`.
- Extend shared shadcn/ui components through explicit variants before creating near-duplicates.
- Define light/dark behavior only when it is in scope. Never imply that one palette automatically satisfies both.
- Include accessibility and interaction states in the component contract, not as a final note.

When a design requires a new foundational token or shared component, call out its consumers and migration impact. If an existing binding design conflicts, stop and request a decision.

## Choose the file and status

- Store designs under `docs/designs/`, nesting by domain only when an established structure requires it.
- Name new files `NNN-kebab-case-name.md`.
- Find the highest design number recursively and take the next unused number, starting at `001`.
- Design numbering is independent of spec numbering.
- Never reuse or renumber an ID.
- Start new designs as `draft` unless the user explicitly approves another valid transition.

Use this frontmatter shape:

```yaml
---
id: DESIGN-001
status: draft
---
```

Use only `draft`, `ready`, `in-progress`, `implemented` and `deferred` with the meanings defined in `PROJECT.md`. Require explicit user approval for material design changes, promotion to `ready`, or deferral. Mark `implemented` only after visual, interaction and accessibility acceptance audits pass.

## Write the design document

Use sections appropriate to the scope, normally:

1. Summary
2. Experience goals and principles
3. Scope and non-goals
4. User context and flow
5. Information hierarchy and layout
6. Token contract
7. Component anatomy and variants
8. Interaction and state matrix
9. Keyboard and focus behavior
10. Motion and feedback
11. Accessibility requirements
12. Window/responsive behavior
13. Content rules
14. Acceptance criteria
15. Related specs and designs
16. Deferred work

Use tables for exact token maps, component variants and state matrices. State concrete values, ranges or token references wherever implementation consistency depends on them. Describe visuals in words only when the description is objectively testable; request or create an appropriate reference artifact when spatial appearance cannot be specified adequately in prose.

When paired with a spec, add a Related Spec link in the design and a Related Design link in the spec. Keep requirements aligned without duplicating long passages.

## Revise or audit

For a revision, preserve the ID and run the interview gate for material changes. Update any coupled spec in the same change.

For an implementation audit:

1. Map every applicable design acceptance criterion to the implementation, tests or captured evidence.
2. Check token use, all required states, keyboard/focus behavior, accessibility and relevant window sizes.
3. Report mismatches plainly; do not bless approximate styling when exact requirements exist.
4. Change the design only after an explicit user decision, never to excuse drift.
5. Mark `implemented` only after all criteria pass.

## Self-audit before handoff

Verify numbering, frontmatter, status, token completeness, state coverage, accessibility, cross-links, consistency with specs and objectively testable acceptance criteria. Fix structural defects without weakening the design.
