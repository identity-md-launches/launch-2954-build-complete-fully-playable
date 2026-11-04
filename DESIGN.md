# Super Pixel Bros. design system

## Overview

A single-page home arcade with the game as the main interaction. Warm original bitmap lettering and a restrained dark cabinet frame surround a bright, deliberately low-resolution world. The product, Start game action and mobile controller fit on the first 390 × 844 screen. There is no separate landing page or marketing section.

The implementation lives in `index.html`; `dist/index.html` is its identical export. Keep the game visually dominant and place instructions beside the controls they explain.

## Colors

CSS custom properties are declared at `index.html:15`.

| Token | Value | Role |
| --- | --- | --- |
| `--page` | `#10151d` | Page and letterboxing |
| `--surface` | `#1c2430` | Help dialog and compact landscape utilities |
| `--edge` | `#344050` | Utility and dialog structure |
| `--cream` | `#fff0ce` | Main text and primary button fill |
| `--muted` | `#a8b2c0` | Instructions and secondary labels |
| `--accent` | `#ef795d` | Original marquee/game coral accent |
| `--gold` | `#ffce78` | Selected state, scores and highlights |
| `--focus` | `#ffce78` | Keyboard focus |

The cabinet is `#232d3a`; the screen rim is `#0c111a`. Touch A uses `#d96e55` with dark ink; touch B uses `#e9c27c` with dark ink. These colors distinguish named A/B actions, accompanied by letters and instructions.

Canvas sprite colors come from the 16-entry `PAL` table at `index.html:54`. Theme scenery is in `THEMES` at `index.html:452`: meadow sky `#86bddd`, athletic sky `#8b9ed3`, and underground sky `#142337`. Use those tables for new art instead of adding external images.

Rendered DOM contrast measured by the probe includes cream on page **16.22:1**, muted on page **8.54:1**, cabinet status **6.50:1**, touch B **10.87:1**, and touch A **5.50:1**. Other state measurements are in `artifacts/design-measurements.json`. These results do not establish every canvas pixel/text contrast pair.

## Typography

The DOM uses `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. There are no downloaded fonts. Weights are 400, 600 and 700.

| Role | Size / behavior |
| --- | --- |
| Body and desktop primary action | 14px, 1.5 line height |
| Instructions, utility labels, credit | 12px |
| Help heading and touch letters | 24px |
| H1 fallback | 32px; 24px below 600px |
| Visible marquee | Original bitmap SVG generated from `GLYPHS`, fluid width up to 540px |
| Canvas lettering | Original 5 × 7 bitmap glyphs at 1×, 2× or 3× internal pixel scale |

The H1 has an accessible name even after the bitmap artwork is inserted. Display capitals inside the canvas and marquee follow the requested arcade direction. Ordinary DOM instructions use natural casing. Numeric HUD strings have fixed character cells and are cached when values change. There is no tracking or external font dependency.

## Layout

The page/header container is at most 1000px wide with 28px desktop side padding. The main content follows one alignment edge: marquee, cabinet, controls and footer. The cabinet has 14px padding, a 12px outer radius and a 3px screen radius. The internal canvas is always **400 × 240**; its CSS aspect ratio is **5 / 3** and nearest-neighbor rendering preserves pixels.

Spacing is based around 8px, with 12/16/20/24/28px groups and smaller optical offsets. CSS declares `--space: 8px`, `--body: 14px` and `--small: 12px`; component spacing also uses explicit values.

Responsive rules at `index.html:18`:

- Coarse pointers or widths at most 700px show the touch controller.
- At most 600px: 16px main gutters, 8px cabinet padding, icon-only utility buttons, 60px touch controls and shorter footer. The start control stays at least 44px tall. The world name hides while the world dots and cabinet status remain.
- At most 350px: 52px touch controls, 8px controller gaps and 40px-wide utilities with 44px height.
- Landscape with height at most 520px: nonessential chrome hides; canvas width is constrained by viewport height. Utilities occupy the upper right; 48px touch controls sit at the lower corners, with safe-area insets. The fixed control wrapper passes pointer events through except over buttons.

Observed widths: 320, 390, 768 and 1440px. Portrait 390 × 844 and landscape 844 × 390 were captured and exercised. No horizontal overflow was observed. Native browser zoom and physical-device safe-area behavior were not verified.

## Elevation & depth

The cabinet uses a restrained `0 14px 50px #0005` outer shadow and `0 2px 0 #424b58` inset highlight. Screen depth is a 3px dark rim. Utility buttons use borders without a shadow. Primary and touch buttons use a heavier lower border for physical depth. The native dialog backdrop is `#070d17d9`.

A static scanline layer sits over the screen with `pointer-events: none`; it never catches input. There are no continuous CSS animations. Reduced motion hides scanlines, disables scenery parallax and freezes decorative title animation. Essential game physics remains active after starting; Pause is always available.

## Shapes

Utilities: 6px radius. Cabinet: 12px desktop / 8px phone. Screen: 3px. Primary action: 2px. Touch directions: 10px rounded squares. A and B: circles. Help: 10px radius. Pixel art stays on integer grid coordinates; avoid smoothing or vector replacements for gameplay sprites.

## Components

| Pattern | Source | Behavior |
| --- | --- | --- |
| Marquee | `#logo`, `marquee()`, `GLYPHS` | Generated bitmap SVG plus semantic H1 name |
| Cabinet | `.bezel`, `.screen`, `#game` | Stable aspect ratio, static CRT treatment, canvas keyboard target |
| Utility | `.utility`, `#pause`, `#mute`, `#helpButton` | Minimum 44px height; hover, pressed and visible focus; accessible names and toggle state |
| Primary | `.primary`, `#start` | Start / Resume / Play again; 44px minimum height; hidden during active play |
| Touch controller | `.touch-key`, `[data-control]` | Independent pointer capture, held state, pointer cancellation, keyboard activation and simultaneous touches |
| Help | `dialog.help`, `openHelp()` | Native modal, automatic game pause, Escape/backdrop close and trigger focus return |
| Status | `.cabinet-foot`, `#announcement` | Visible game state plus polite announcements for lives, power-ups and level transitions |
| HUD | `drawHud()` | Score, coins, world, countdown and lives; readable original bitmap lettering |

Focus uses a 3px gold perimeter, 4px offset. The canvas also gives its screen parent a 2px gold perimeter on the dark cabinet, avoiding reliance on focus contrast against moving scenery. The screen decoration ignores pointer input. Controls have real button semantics. Space/Enter preserve native button activation rather than being consumed as game input when a native button is focused.

## Do's and don'ts

- Start with the existing single-page cabinet composition; keep the game and its main action on the first phone screen.
- Reuse palette-indexed string grids and the atlas for sprites, and `GLYPHS` for canvas lettering.
- Reuse `.utility` for a secondary control and `.primary` for the one current start/confirm action.
- Preserve minimum hit areas, distinct A/B names, keyboard paths and pointer cancellation.
- Keep all runtime art, audio and code inside the HTML. Do not add a CDN, image file, font request or wallet flow.
- Do not interpolate physics with CSS animation or convert the 400 × 240 internal canvas to device-dependent dimensions.
- This product intentionally has one page. Add states inside the cabinet; do not introduce another landing page ahead of play.

Design guidance attribution and license notices: `LICENSES/design-guidance.txt` and README.
