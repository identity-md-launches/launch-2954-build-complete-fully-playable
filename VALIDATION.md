# Delivery validation

Date: 2026-11-04. Worker-side evidence, not an independent certification.

| Area | Result |
| --- | --- |
| Implementation | All requested game systems implemented; no known remaining functional defect from these checks |
| Chromium gameplay / input / offline checks | 32 passed, 0 failed |
| Geometric level routes | All 3 flags reached |
| Product and main action at 390 × 844 | Yes; actual screenshot reviewed |
| Supplied taste@1 checks | 16 passed, 0 failed |
| JavaScript syntax and TypeScript checkJs | Passed |
| Missing or fabricated product features identified | 0; test coverage limitations below |
| Cross-engine browser validation | Incomplete: WebKit runtime could not launch |

The site is one original pixel adventure inside a dark arcade cabinet. The implemented idea is the contrast between a quiet physical frame and a bright, fully playable pixel world.

## Scope and assumptions

Reviewed the exact production export `dist/index.html`, served under a local `/preview/` subpath and opened directly as an offline local file. Runtime is one HTML file with all code, styles, sprites, lettering, metadata and sound generation inline. No build is required to play. The optional export command makes a byte-identical delivery copy.

The game starts with three lives, three 256 × 15 worlds and 400 seconds per world. Holding run is required for some athletic gaps. Moving platforms are useful alternative landings; no jump requires waiting longer than a short platform cycle. High scores and mute preference belong to this browser only. No wallet, account, backend, hosting or publication was requested or added.

Browser gameplay tests use real keyboard and pointer events, selected entity positions, and deterministic calls into the same update loop used during play. This isolates collisions and transitions without claiming a continuous human campaign playthrough. Geometry search disables enemies and moving platforms, uses selected grounded starts at run speed and tries jumps through the real simulation. It establishes reachable static routes, not combat difficulty or player skill.

## Requirement coverage

| Requirement from the brief | Implementation / evidence |
| --- | --- |
| “Single index.html with all CSS and JS inline” / offline | Source and export identical; no runtime asset requests; file playback with browser networking offline passed |
| “400×240” / “Fixed-timestep … 60 Hz” | Canvas attributes, `STEP`, accumulator; observed 60.2 render fps and 60.2 physics Hz in the final short headless sample |
| “ORIGINAL pixel art … palette-indexed string grids … offscreen atlas” | `ART`, `PAL`, original bitmap `GLYPHS`, one atlas created before gameplay |
| Small / big / fire, “power-down one step” | Real item collisions, 12 × 16 / 12 × 28 hitboxes, fire → big → small tests, 120-frame hit invincibility |
| Variable jump / coyote time / buffer / skid | Held-vs-tapped jump, coyote and buffered jump tests; acceleration, friction, directional skid and animation code |
| “3 complete levels, each 200+ tiles wide” | Three validated 256 × 15 ASCII maps; route witness for every flag |
| Sunny / sky / underground worlds | Actual meadow, floating-platform sky and dark ceiling/corridor maps; theme screenshots |
| Brick, question, used, hidden blocks, coins, pipes, stairs | Physical head collision tests, four pooled brick fragments, item emergence and one-up test; ASCII map invariants and source review |
| Mushroom walker | Actual falling stomp squashes, bounces and adds 100; side collision uses player damage |
| Turtle / still and sliding shell / “100-200-400-800” | Stomp/kick/enemy-kill and six-second wake tests; capped doubling combo in `updateEnemies()` |
| Piranhas in at least 2 pipes | At least two per map; suppression while standing on the pipe and subsequent emergence tested |
| First question gives mushroom / flower | Item test grows player, next item gives fire; minimum horizontal question position selected per map |
| “100 coins = extra life” / hidden 1-up | Five pickups add five coins/1000 score; 100-coin rollover and hidden one-up add actual lives |
| “max 2 fireballs … bounce … explode on walls” | Pool cap, launch, ground-bounce, wall explosion and enemy-kill tests |
| Flag bonus / slide / castle / next world / final win | Flag collision, height bonus and timed progression tested for all three worlds; final win and replay tested |
| HUD / time up / life loss / game over / high score | Countdown, life loss, respawn, zero-lives Game Over → title and persistent high-score tests |
| Original WebAudio effects and theme loops | All requested effect hooks and three original note sequences reviewed; gesture-created running AudioContext, mute and pooled oscillators checked; subjective listening not performed |
| Keyboard, pause, mute, controls overlay | Actual key/button tests, frozen pause timer, native Space/Enter activation, dialog Escape and focus restoration |
| Mobile multitouch and both orientations | Touch-enabled mobile browser context, two simultaneous CDP touch contacts; movement/jump active together; controls visible in 844 × 390 landscape |
| Metadata / export / source / lockfile / docs | Title, favicon, description, og:title and data-URI og:image checked; complete source, dependency-free manifest/lockfile, export and design/rebuild documentation provided |

## Better Interface coverage

| Domain | Coverage and evidence | Remaining limits |
| --- | --- | --- |
| Accessibility | **Checked:** semantic buttons and dialog, accessible names through browser role selectors, keyboard play, native Space/Enter activation, Escape, focus return, held touch cancellation, visible focus screenshots, reduced-motion scanlines/parallax behavior, stable polite announcements. At 390 all 8 visible controls meet the comfortable 44px target size. | No screen-reader session, axe scan, physical device or native zoom test. Real-time canvas gameplay is not a fully nonvisual game interface. |
| Layout | **Checked:** actual screenshots at 390 × 844, desktop 1440, 844 × 390 landscape, intermediate 768; probe at 320/390/1440. No horizontal overflow. Product and primary action appear on the first 390 screen. Dialog wraps within phone width. | Native 200% browser zoom not verified. RTL/localization not applicable to this English-only assignment. |
| Writing | **Checked:** concise adjacent controls, clear Start/Resume/Play again labels, sound state and English HUD/status copy. “Built on IMD” credit present. Local-only persistence documented. | Retro capitals are deliberate canvas/marquee art required by the brief. No external-data claims or fictional results. |
| Typography | **Checked:** 12/14/24/32px source roles, one system family, three weights, original grid lettering, fixed-width HUD numerals, phone help wrapping, no clipping in measured views. | Browser-native text enlargement and all OS font substitutions not verified. |
| Colors | **Checked:** source tokens and rendered solid DOM pairs. Probe passes all measured text; body 16.22:1, secondary page text 8.54:1, start button 12.69:1, canvas focus against cabinet 9.52:1. Letter/action labels supplement color. | Canvas art, translucent scene overlays and every possible animation state are not covered by the DOM contrast probe. |
| UI | **Checked:** restrained bezel, ignored-pointer scanlines, original icons, native dialog, hover/active/selected/focus styles, visible mute icon, game pause and reduced-motion treatment. Focus is visibly clear in captured states. | No physical tactile/device test, WebKit rendering, slowed Animations-panel review or subjective audio session. Essential gameplay retains motion. |

## Findings and repairs

1. **Medium, layout:** `index.html:16`, `index.html:543`, `.primary` / title rendering. The first phone capture showed Start covering the high-score line. Centered the start control, moved the canvas instruction/high-score lines and made the touch target 44px tall. Rechecked at 320 and 390; the final phone screenshot shows all lines and the action separately.
2. **High, level geometry:** `index.html:84`, `CHUNKS`. A sky-level gap from the late island to the raised platform had no static route in the real-physics search. Added intermediate landings. Final route validation reaches tile 244 and the flag in every world; sky explores 184 reachable surface states.
3. **High, progression:** `index.html:479`, `loadLevel()`. Source review found the “first question” selected by row order, allowing a later high block to precede the first block encountered horizontally. Select the minimum x coordinate instead. The physical first-question/mushroom/growth scenario passes.
4. **High, projectile collision:** `index.html:518`, `updateFireballs()`. Source review found a center collision sample could classify a floor impact as a wall. Separate horizontal wall checking from vertical floor resolution. The final actual ground-bounce, wall explosion, pool-cap and enemy-hit scenarios all pass.
5. **High, keyboard accessibility:** `index.html:547`, `index.html:548`. The browser test reproduced Space failing to activate the focused help button because global game handlers consumed native button defaults. Preserve native Enter/Space behavior on both keydown and keyup; touch buttons retain their own held keyboard path. Native help/sound keyboard test now passes.
6. **Medium, sprite placement:** `index.html:479`, `index.html:535`. Source review found the plant origin/clipping did not align its stem to the pipe top. Align the base with the following pipe tile and clip the 28px plant drawing above that surface. Emergence suppression tests pass and the underground screenshot shows the plant attached to its pipe.
7. **Low, probe false positive:** `index.html:29`. The first probe treated literal canvas fallback text as visible text overlapping Start, although the screenshot showed raster content instead. Removed the unused fallback string and retained the canvas accessible name/instructions. The final probe has no overlap finding.

The canvas focus perimeter was also placed on the dark screen surround so its contrast does not depend on changing scenery. `artifacts/focus-game.png` and the rendered 9.52:1 adjacent-color measurement document the final state.

## Commands and actual results

Executed on the final source/export:

```sh
node scripts/check.mjs --typescript test/scratch/typescript/lib/typescript.js
node scripts/build.mjs
PLAYWRIGHT_BROWSERS_PATH=test/scratch/browsers node scripts/validate-game.mjs test/scratch/pw/index.mjs
PLAYWRIGHT_BROWSERS_PATH=test/scratch/browsers node scripts/validate-routes.mjs test/scratch/pw/index.mjs
TMPDIR=test/scratch/tmp IMD_PLAYWRIGHT=test/scratch/pw/index.mjs PLAYWRIGHT_BROWSERS_PATH=test/scratch/browsers node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste --offline
```

All five final commands exited 0. TypeScript 5.9.3 checked the exact inline JavaScript with `allowJs`, `checkJs`, `noEmit`, ES2022, DOM and DOM.Iterable libraries. No runtime code compilation or dependency installation is needed to play. Scratch tools/downloads are not delivered.

The final `node scripts/verify-delivery.mjs` check also validates every PNG with chunk checksums and decompression, parses JSON, checks required documents, compares report/export hashes and enforces the 8 MiB budget. Its result is `artifacts/integrity.json`.

The game and route reports include the production HTML SHA-256; the final integrity report checks these against the delivered file. Raw check outcomes are in `artifacts/game-validation.json`, `artifacts/routes-validation.json` and `artifacts/design-probe.json`. The 2-second frame sample is **60.2 render fps / 60.2 physics Hz**; it is stationary headless Chromium evidence, not a universal 60 fps claim.

Reviewed screenshots include `title-desktop.png`, `title-mobile.png`, `gameplay-mobile.png`, `gameplay-desktop.png`, `landscape.png`, `win-screen.png`, `help-mobile.png`, `focus-controls.png`, `focus-game.png`, `world-2.png` and `world-3.png`, all under `artifacts/`. These are actual browser captures, including selected test positions where described above.

## Failures and remaining limitations

The supplied browser tool failed with **“Socket path too long”** before loading the game. A locally downloaded Playwright Core 1.56.1 / Chromium harness completed the browser checks. The first WebKit launch reported unavailable browser runtime libraries. An alternate WebKit bundle also failed to launch with **“libwayland-server.so.0: cannot open shared object file”** on 2026-11-04. No WebKit rendering or interaction result is claimed. Re-run the developer checks with a fully provisioned WebKit runtime to close that coverage gap; no requester credential or game configuration is missing.

No continuous human playthrough, physical iPhone/Android session, native 200% zoom, screen-reader session, subjective listening test, long-duration stress benchmark or heap/GC profile was performed. Geometric reachability is not claimed as combat balance proof. The synthesized audio hooks and AudioContext state were checked, but audible quality remains a listening task.

The share-card image is a valid embedded SVG data URI to satisfy the one-file/offline constraint. Actual social-platform unfurl support was not verified. None of the implementation or validation results uses fabricated data, placeholder behavior, simulated external services or invented passes.

**Completion:** Complete playable game delivery with passing Chromium, source/type, route and design checks. Cross-engine verification remains incomplete because WebKit could not launch; the other unperformed checks are explicitly scoped above. Source, static export, documentation and actual evidence are delivered.
