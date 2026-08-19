---
id: DESIGN-001
status: implemented
---

# Project shell foundation

## Summary

Define the neutral visual and interaction foundation for the SPEC-000 desktop shell. The design covers one full-window introduction screen, a shared Card surface, system-responsive light and dark tokens, runtime-information states and the minimum accessibility and window behavior needed to prove the renderer shell.

This is a foundation/tokens and single-screen design. It is intentionally replaceable and does not establish product branding, canvas behavior or application navigation.

## Experience goals and principles

- Make a successful project initialization immediately legible without implying unfinished product features.
- Keep the diagram-first product direction visible through generous empty space, without drawing a fake canvas, diagram or toolbar.
- Use the default neutral shadcn/ui visual language so future design work can replace the shell without migrating a parallel token system.
- Remain calm and readable in both macOS appearance modes and at the minimum supported window size.
- Treat runtime information as secondary status, never as a blocking call to action.

## Scope

- One root application screen containing one compact introduction Card.
- Neutral light and dark semantic tokens shared from `@ai-architecture/ui`.
- Default, loading, success and safe-error presentation for runtime information.
- Window geometry, responsive spacing, semantic structure and accessibility requirements.
- The minimum shared Card component and utility required by the screen.

## Non-goals

- Product navigation, title bars, toolbars, sidebars, canvas controls or chat controls.
- Final brand colors, custom illustrations, logos, iconography or typography.
- A manual theme switch, persisted theme preference or application settings.
- Animation, onboarding steps, retry controls, links or other interactive affordances.
- Canvas grids, nodes, connectors or decorative treatments that could be mistaken for working diagram behavior.

## User context and flow

1. The desktop window opens using the current macOS appearance.
2. The introduction Card is immediately visible and identifies “AI Architecture.”
3. Runtime information begins in a polite loading state while the renderer invokes the narrow preload bridge.
4. The status resolves to either non-sensitive version/platform text or a safe unavailable message.
5. No user input is required and no product capability is implied.

## Information hierarchy and content

The screen uses this order inside a single Card:

1. Eyebrow: `Initialized desktop shell`
2. H1: `AI Architecture`
3. Supporting sentence: `A secure foundation for diagram-first architecture work with an AI collaborator.`
4. Runtime status region.

The eyebrow communicates the current delivery milestone. The heading is the product identity. The sentence communicates direction without presenting diagram or chat behavior as available. Runtime information is visually and semantically secondary.

## Layout

### Window

| Property | Requirement |
| --- | --- |
| Default content size | 1200 × 800 CSS pixels |
| Minimum content size | 720 × 520 CSS pixels |
| Initial placement | Centered using the operating system's window placement behavior |
| Overflow | No horizontal scrolling at or above the minimum size |
| Page height | At least the viewport height |

### Screen composition

- Use a `main` landmark that fills the viewport and centers the Card on both axes.
- Apply inline and block page padding with `clamp(1.5rem, 4vw, 4rem)`.
- Limit the Card to `30rem` and allow it to shrink to the available inline size.
- Use a subtle background made only from the semantic background color plus one low-contrast radial wash anchored near the upper center. Do not use an image, grid, dot field or repeated pattern.
- The Card uses a one-pixel semantic border and restrained shadow from the shared Card component.
- Card content padding is `1.5rem` below 48rem viewport width and `2rem` at or above it.
- Vertical content spacing uses the shared spacing scale: `0.5rem` between eyebrow and heading, `0.75rem` between heading and supporting text, and `1.5rem` before runtime status.

## Token contract

Tokens live in `packages/ui` and are surfaced to Tailwind CSS v4 through `@theme inline`. Values begin from the neutral shadcn/ui CSS-variable preset and are placeholders, not brand approvals.

### Shared aliases

| Semantic token | Light role | Dark role | Consumers |
| --- | --- | --- | --- |
| `--background` | Neutral page background | Neutral near-black page background | Screen root |
| `--foreground` | High-contrast primary text | High-contrast primary text | Heading and body |
| `--card` | Raised neutral surface | Raised neutral surface | Card |
| `--card-foreground` | Text on Card | Text on Card | Card descendants |
| `--muted` | Quiet neutral fill | Quiet neutral fill | Runtime status container |
| `--muted-foreground` | Secondary readable text | Secondary readable text | Eyebrow and status |
| `--border` | Subtle surface separation | Subtle surface separation | Card border |
| `--ring` | Focus-visible outline | Focus-visible outline | Shared component baseline |
| `--shell-glow` | Translucent neutral highlight | Translucent neutral highlight | Background radial wash |
| `--radius` | `0.625rem` | `0.625rem` | Shared radius aliases |

The implementation may use the current shadcn neutral OKLCH values for the standard aliases. `--shell-glow` must remain achromatic and no more visually prominent than the Card border. All foreground/background pairings must meet WCAG AA contrast.

### Typography

- Use the macOS/system sans-serif stack inherited by the shared stylesheet; do not download or bundle a font.
- Eyebrow: 0.75rem, 600 weight, 0.08em tracking, uppercase.
- H1: responsive `clamp(2rem, 5vw, 3rem)`, 650–700 weight, tight line height no smaller than 1.05.
- Supporting text: 1rem, normal weight, 1.6 line height.
- Runtime status: 0.8125rem, medium weight, 1.4 line height.

## Component anatomy

### Shared Card

Use the CLI-managed shadcn/ui Card implementation exported from `@ai-architecture/ui/components/card`.

- Reuse the Card root, header/content structure and semantic token classes.
- Do not add a shell-specific Card variant unless the standard component cannot satisfy the specified width, padding or shadow through composition.
- The Card remains a non-interactive grouping surface and must not receive a tab stop.

### Runtime status

The runtime status is a local screen composition, not a new shared component.

| State | Visible content | Accessibility behavior |
| --- | --- | --- |
| Loading | `Checking desktop runtime…` | Status region has `aria-live="polite"`; no progress spinner |
| Success | `Desktop shell ready · v{version} · macOS` | Updated content is announced politely; raw `darwin` is not shown |
| Error | `Desktop runtime details are unavailable.` | Safe message is announced politely; no exception details or retry control |

The application name is not repeated in the success string because the H1 already names the product. Version text may contain only the validated application version. Platform text maps the validated `darwin` value to `macOS`.

## Interaction and state matrix

| Element | Default | Hover/active | Focus-visible | Disabled |
| --- | --- | --- | --- | --- |
| Screen | Static | None | Not focusable | Not applicable |
| Card | Static | None | Not focusable | Not applicable |
| Runtime status | Loading, success or error | None | Not focusable | Not applicable |

No pointer target, keyboard command, link, button or context menu is introduced by this design.

## Keyboard and focus behavior

- The document uses normal browser reading order: eyebrow, H1, supporting sentence, runtime status.
- The screen creates no tab stops. Pressing Tab must not reveal hidden or accidental controls inside the renderer.
- The shared token foundation must include a visible focus-ring token for future components even though this screen has no focusable content.
- Electron/Chromium default text selection may remain available; no custom selection behavior is required.

## Motion and feedback

- Do not animate page entry, Card position, background, or runtime-state transitions.
- The loading text changes directly to success or error.
- Because there is no authored motion, reduced-motion mode requires no alternate behavior.

## Accessibility requirements

- Provide exactly one `main` landmark and one level-one heading.
- Keep all text/background combinations at WCAG AA contrast or better in both appearance modes.
- Do not rely on color alone to distinguish runtime states; each state has explicit text.
- Mark the runtime status as a polite live region without moving focus.
- Preserve text legibility and content access at 200% browser zoom within the minimum window; wrapping is allowed and horizontal overflow is not.
- Do not place meaningful content in the decorative radial background; the decorative layer is ignored by assistive technology.
- The HTML document language is `en`.

## Appearance behavior

- Follow `prefers-color-scheme` automatically on first render and as the operating-system preference changes.
- Light and dark values are defined together in the shared stylesheet.
- Do not persist an application theme choice or add a manual toggle under SPEC-000.
- Set the document `color-scheme` so native browser rendering matches the active token set.

## Content rules

- Use the exact eyebrow, heading, supporting sentence and runtime-state strings in this document.
- Do not add version links, build metadata, commit hashes, environment names or diagnostic details.
- Do not truncate the heading or supporting sentence; allow wrapping.
- Runtime version content must be validated before interpolation and must not contain HTML.

## Acceptance criteria

| ID | Criterion |
| --- | --- |
| DAC-001 | At 1200 × 800, the Card is centered within the full-window shell and its width does not exceed 30rem. |
| DAC-002 | At 720 × 520 and at 200% zoom, all content remains readable without horizontal scrolling. |
| DAC-003 | The screen follows macOS light/dark appearance using shared semantic tokens, and both modes meet WCAG AA text contrast. |
| DAC-004 | The screen contains the exact hierarchy and copy defined in this document with one `main` and one H1. |
| DAC-005 | Loading, validated success and safe error runtime states render the specified copy and update through one polite live region. |
| DAC-006 | The screen contains no interactive controls, accidental tab stops, fake canvas elements, fake diagram controls or chat controls. |
| DAC-007 | The background uses only semantic colors and a restrained achromatic radial wash, with no image, grid or repeated pattern. |
| DAC-008 | The renderer consumes shared Card and global styles through explicit `@ai-architecture/ui` subpath exports. |
| DAC-009 | No authored motion runs in any state, including when the operating-system appearance changes. |

## Acceptance audit

Audit completed on 2026-08-18 using component tests, the Electron Playwright scenario and inspected light/dark screenshots.

| ID | Evidence | Result |
| --- | --- | --- |
| DAC-001 | Electron measures a centered Card no wider than 480 CSS pixels at the 1200 × 800 default viewport. | Pass |
| DAC-002 | Electron sets a 720 × 520 viewport, applies 200% web-content zoom and verifies the document has no horizontal overflow. | Pass |
| DAC-003 | Electron switches between light/dark media modes and verifies distinct computed roles; achromatic token calculations exceed 18:1 for primary text and 6:1 for secondary text in both modes. | Pass |
| DAC-004 | Component and Electron tests verify one `main`, one H1, exact product/runtime copy and the required hierarchy. | Pass |
| DAC-005 | Component tests cover loading, validated success and safe error copy; the live Electron bridge verifies the exact success state and polite status region. | Pass |
| DAC-006 | Electron finds no links, buttons, form controls or tab stops; inspected screenshots contain no fake canvas, diagram or chat controls. | Pass |
| DAC-007 | Inspected light/dark screenshots show the specified restrained achromatic radial wash with no image, grid or repeated pattern. | Pass |
| DAC-008 | The renderer imports Card and global CSS through explicit `@ai-architecture/ui` subpaths; typecheck and production bundling pass. | Pass |
| DAC-009 | The shell authors no transitions or animation classes; Electron runs under reduced-motion emulation and reports zero document animations. | Pass |

## Related specifications and designs

- [SPEC-000: Initialize the project shell](../specs/000-initialize-project-shell.md)

No earlier design document governs this foundation.

## Deferred work

- Product branding, logo, branded palette and non-system typography.
- Manual theme controls and persistence.
- Canvas, navigation, chat, onboarding and all interactive product surfaces.
- Shared component variants beyond the minimum Card required by SPEC-000.
