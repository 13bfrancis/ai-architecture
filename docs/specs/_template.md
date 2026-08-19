---
id: SPEC-NNN
status: draft
---

<!--
Copy this file to the next unused NNN-kebab-case-name.md path.
Replace every placeholder, remove all instructional comments, and delete sections
that are genuinely not applicable. Do not leave empty headings or "N/A" filler.
A spec cannot become ready while it contains unresolved material questions.
-->

# [Specification title]

## Summary

<!-- State what will change, for whom, and the intended outcome in one or two paragraphs. -->

[Concise description of the capability or change.]

## Context and problem

<!-- Explain the current situation, evidence, pain, opportunity, and why this work matters now. -->

[Problem and relevant background.]

## Product decisions and rationale

<!-- Record consequential choices already made. Include rejected alternatives when the tradeoff matters. -->

| ID | Decision | Rationale and consequences |
| --- | --- | --- |
| DEC-001 | [Chosen behavior or constraint] | [Why it was chosen and what it implies] |

## Goals

<!-- Use outcomes that this spec is accountable for. -->

- [Goal]

## Non-goals

<!-- Name adjacent work that is deliberately excluded so scope cannot expand silently. -->

- [Non-goal]

## Assumptions and constraints

<!-- Include platform, compatibility, policy, dependency, timing, or technical constraints. -->

- [Assumption or constraint]

## Users and user stories

<!-- Keep this section for user-facing work. Delete it for purely internal work. -->

| ID | User story | Priority | Related acceptance criteria |
| --- | --- | --- | --- |
| US-001 | As a [user], I want [capability], so that [outcome]. | Must | AC-001 |

## User and system workflows

<!-- Describe the primary path, important alternate paths, and transitions. Use a diagram only when it improves clarity. -->

### Primary workflow

1. [Step]

### Alternate and recovery workflows

1. [Alternate, cancellation, retry, or recovery path]

## Requirements

### Functional requirements

<!-- Use stable IDs for traceability. Write observable behavior, not implementation aspirations. -->

- **REQ-001:** [The system must...]

### Architecture and boundaries

<!--
Define the architecture required by this change. Cover only relevant items:
- system context and responsibility boundaries;
- components/packages/processes and allowed dependencies;
- data and control flow;
- APIs, IPC, events, schemas, versioning, and compatibility;
- source of truth and ownership;
- security/trust boundaries; and
- material alternatives or tradeoffs.
-->

[Architecture decisions and boundary rules.]

| Component or boundary | Responsibility | Inputs/outputs | Must not do |
| --- | --- | --- | --- |
| [Name] | [Owned responsibility] | [Contracts or flows] | [Forbidden coupling] |

### Data contracts and lifecycle

<!-- Define schemas, validation, persistence, migration, retention, deletion, and recovery when relevant. -->

[Data model and lifecycle requirements.]

### UX and design impact

<!--
State whether the change affects visible layout, content, interaction, components,
tokens, theming, accessibility, or user-facing states. If yes, run $write-designs
and link the companion design document. Do not duplicate its token-level details.
-->

- Design impact: [Yes/No]
- Related design: [DESIGN-NNN](../designs/NNN-kebab-case-name.md)
- [Product behavior that the design must support]

### Non-functional requirements

<!-- Keep only applicable categories and make each target measurable. -->

- **Performance:** [Target and measurement conditions]
- **Reliability:** [Availability, retry, recovery, or data-integrity target]
- **Security and privacy:** [Permissions, sensitive data, threat or disclosure requirements]
- **Accessibility:** [Keyboard, focus, semantics, contrast, assistive technology, motion]
- **Compatibility:** [Platforms, versions, migrations, or backward-compatibility expectations]
- **Resource limits:** [Memory, CPU, storage, network, concurrency, or scale limits]

## Failure handling and edge cases

| Condition | Expected behavior | User/system feedback | Recovery |
| --- | --- | --- | --- |
| [Failure or edge case] | [Required behavior] | [Observable feedback] | [Retry, rollback, or safe state] |

## Testing and observability

<!-- Define the lowest useful test levels plus diagnostics needed to operate or debug the feature. -->

- Unit: [Coverage]
- Integration: [Coverage]
- End-to-end: [Coverage]
- Diagnostics/telemetry: [Events, logs, metrics, privacy limits, or explicitly none]

## Acceptance criteria

<!-- Every criterion must be independently observable and pass/fail. Link requirements or stories where useful. -->

| ID | Pass condition | Verification |
| --- | --- | --- |
| AC-001 | [Observable result under stated conditions] | [Test, inspection, or evidence] |

## Rollout, migration, and compatibility

<!-- Delete when there is no rollout or migration concern. Include rollback and existing-data behavior when relevant. -->

[Rollout sequence, migration, feature gating, rollback, and compatibility plan.]

## Dependencies and related documents

- Depends on: [SPEC-NNN](NNN-kebab-case-name.md)
- Related specs: [SPEC-NNN](NNN-kebab-case-name.md)
- Related designs: [DESIGN-NNN](../designs/NNN-kebab-case-name.md)
- External dependency: [Package, service, protocol, or decision]

## Deferred work

<!-- Record explicitly excluded follow-up work. Deferral does not imply a future design decision. -->

- [Deferred capability or decision]

## Open questions (draft only)

<!--
Use only while gathering requirements manually. The $write-specs interview should
normally resolve material questions before writing. Remove this section before
promotion to ready; moving an unanswered item to Deferred Work requires an
explicit user decision.
-->

- [Question]

