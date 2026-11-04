# Super Pixel Bros.

An original, fully playable pixel platformer in one HTML file. Three 256-tile worlds, original palette-grid sprites, synthesized music and effects, keyboard controls, and multitouch controls. No framework, external assets, CDN, account, or runtime dependencies.

## Play and install

Open **`dist/index.html`** in a modern browser. It also works directly from a local file with the network offline. There is nothing to install. The source `index.html` is independently playable too.

For a local HTTP preview, use Node.js 20 or newer:

```sh
npm run preview
```

Open the local URL printed by the command. The preview stays in the foreground; Ctrl+C stops it. An alternative port can be supplied with `npm run preview -- 8080`.

## Refresh the export

```sh
npm run build
```

This copies the source to `dist/index.html` byte for byte. It is a delivery/export command, not a compilation step. Playing or hosting the finished file requires no build. The package manifest and lockfile intentionally have no dependencies. No assets need copying beside the HTML file, and it can be served under any static subpath.

## Controls

| Action | Keyboard | Touch |
| --- | --- | --- |
| Move | Left / Right or A / D | Left / Right |
| Jump | Space, Z, W, or Up | A |
| Run and shoot in fire form | X or Shift | B |
| Pause / resume | P or Escape | Pause button |
| Sound | M | Speaker button |
| Start / replay / confirm | Enter | Start game / canvas |
| Controls overlay | ? | Question-mark button |

Hold jump to go higher. Hold run for long gaps. Stomp a turtle to leave a shell, then touch the still shell to kick it. Jump on a moving shell to stop it. A side hit from a moving shell hurts. Every 100 coins earns a life. The first question block in each world gives a mushroom, or a flower if already big; the next item block is another chance to power up. Other question blocks give coins. Each world has one invisible 1-up block.

The high score and sound preference are saved only in this browser's localStorage. Storage denial is handled without breaking play. Leaving the page or opening help pauses active gameplay.

## Implementation

- `index.html`: all styles, 400 × 240 canvas rendering, original 5 × 7 lettering, sprite atlas, ASCII maps, physics, collisions, enemy behavior, audio and input.
- `dist/index.html`: complete static export, identical to the source.
- `scripts/`: optional export, preview and validation utilities. They are not game dependencies.
- `DESIGN.md`: implemented visual tokens and responsive behavior.
- `VALIDATION.md`: six-domain review, fixed findings, commands, results and limitations.
- `artifacts/`: actual screenshots and machine-readable validation reports.

The simulation uses a 60 Hz accumulator with requestAnimationFrame rendering. Fireballs, particles, pickups, block bumps and audio oscillator voices are pooled. Sprites are pre-rendered once into a canvas atlas. World maps are readable 32-column chunks, assembled into three 256 × 15 maps; their legend is next to `CHUNKS` in the source. No Nintendo artwork, music, samples or font files are embedded.

## Checks and reproduction

Dependency-free source integrity, syntax, metadata and map checks:

```sh
npm run typecheck
```

Full JavaScript type checking with a separately installed TypeScript compiler:

```sh
npm run typecheck -- --typescript /path/to/typescript/lib/typescript.js
```

The actual full check used TypeScript **5.9.3**, `checkJs`, `allowJs`, `noEmit`, ES2022 and DOM libraries. It passed. The default command runs the dependency-free syntax/integrity checks; supplying the compiler adds the actual type check.

Browser validation with a separately installed Playwright module and its Chromium browser:

```sh
node scripts/validate-game.mjs /path/to/playwright/index.mjs
node scripts/validate-routes.mjs /path/to/playwright/index.mjs
```

The scripts manage their HTTP server and browser in one foreground process and close both. They write real reports and screenshots into `artifacts/`. Test mode is opt-in with `?test`; ordinary gameplay does not expose the validation bridge. Most scenarios use actual keyboard/touch events and selected entity positions with deterministic stepping through the real game update. They are not represented as a continuous human campaign playthrough.

Actual results on the delivered export:

- Production export and TypeScript checkJs: **passed**.
- Chromium gameplay, input, offline and responsive suite: **32 passed, 0 failed**, including fireball kills, shell combat, death/respawn, all three level transitions, replay, pause, mute, platform riding, coyote time and jump buffering.
- Geometric reachability: **3 of 3 flags reached** using the real simulation. Enemies and moving platforms were disabled for this geometry check; combat and moving platforms were tested separately.
- Supplied `taste@1` probe: **16 of 16 passed**, including layout at 320/390/1440, targets, measured DOM text contrast and metadata. The supplied probe command was `node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste --offline`; pinned inputs are not included in the delivery.
- Direct `file://` playback with browser networking offline: **passed**.

Run `npm run verify` to validate the delivered files, screenshots, report/export hashes and bundle budget. It requires only Node and the included evidence.

## Validation limitations

The supplied browser launcher failed on a temporary socket-path limit; a local Playwright harness completed the Chromium checks instead. WebKit could not launch because required browser runtime libraries were unavailable; an alternate WebKit bundle also could not launch. Safari/WebKit, physical phones, screen-reader gameplay, native 200% browser zoom and subjective audio listening were not verified. The short frame-rate sample is a headless Chromium observation, not a physical-device performance claim.

`og:image` is an embedded SVG data URI to preserve the single-file, offline constraint. Its presence and validity were checked; social-platform unfurl support was not verified. Pixel art and canvas text are outside the automated DOM contrast probe. No feature is represented by fabricated data or a placeholder, and no unperformed test is claimed as passed.

## Design guidance attribution

The six-domain review follows the supplied Better Interface guidance by Jakub Krehel (MIT), commit `267330e1adfc66a718fb65fa6918c1f06d0a689e`. Design documentation follows the supplied adaptation of Paul Bakaus's Impeccable documentation guidance (Apache-2.0), commit `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8`. Their notices and license texts are retained in `LICENSES/design-guidance.txt`. These references informed the interface and documentation; they are not runtime dependencies.
