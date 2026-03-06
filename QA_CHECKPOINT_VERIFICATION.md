# QA Verification - Checkpoint Mechanics (Desktop + iPhone)

Date: 2026-03-02

## Scope

- Files in scope:
  - `public/assets/asset-pack.json`
  - `src/config/tuning.ts`
  - `src/scenes/GameScene.ts`
  - `src/scenes/ResultScene.ts`
- Acceptance basis: the 9 verification groups from the approved checkpoint plan.

## Executed Checks

1. Build check:
   - Command: `npm run build`
   - Result: PASS
2. Dev server smoke check:
   - Command: `npm run start -- --host 127.0.0.1 --port 8081`
   - Result: PASS (server ready, local URL printed)

## Discrepancy Log

| ID | Priority | Steps | Expected | Actual | Target file | Status |
|---|---|---|---|---|---|---|
| P2-001 | P2 | Static UI check of progress bar position | Progress bar at top center | `HUD_LAYOUT.progressXRatio` was `0.6` (right shift) | `src/config/tuning.ts` | Fixed (`0.5`) |
| P2-002 | P2 | Static UI check of harbor x-position | `earth-3` centered at top | `LANDMARK_LAYOUT.harbor610.xRatio` was `0.58` (right shift) | `src/config/tuning.ts` | Fixed (`0.5`) |

## Code-Level Verification Matrix

Legend:
- `PASS (code)` = requirement implemented in code/config.
- `MANUAL` = must be confirmed by actual gameplay run (desktop + iPhone).

| Group | Requirement | Evidence | Status |
|---|---|---|---|
| 1 | Progress bar states `new-0..new-6` by checkpoints | `src/config/tuning.ts` (`DISTANCE_CHECKPOINTS`, `PROGRESS_BAR_NEW_KEYS`), `src/scenes/GameScene.ts` (`updateCheckpointProgress`, `updateProgressBar`) | PASS (code), MANUAL |
| 2 | Pending coins: +5 at 100, +10 at 300, +15 at 500 | `src/config/tuning.ts` (`COIN_PENDING_MILESTONES`), `src/scenes/GameScene.ts` (`updatePendingCoins`) | PASS (code), MANUAL |
| 3 | Defeat coin loss: `awarded=0`, `lost=pending` | `src/scenes/GameScene.ts` (`finishRunFailure`) | PASS (code), MANUAL |
| 4 | Success reasons and awarded coins on landmark/gate contact | `src/scenes/GameScene.ts` (`finishRunSuccess`, landmark overlaps, harbor gate overlap) | PASS (code), MANUAL |
| 5 | Island/tavern can be bypassed, pending persists | Landmark spawn positions in `src/config/tuning.ts`, no pending reset before success/failure in `src/scenes/GameScene.ts` | PASS (code), MANUAL |
| 6 | Harbor at 610 with full-width gate and `new-6` visible from 600 | `src/config/tuning.ts` (`LANDMARK_METERS.harbor610`), `src/scenes/GameScene.ts` (`spawnHarborGate`, checkpoint stage update) | PASS (code), MANUAL |
| 7 | Quiet windows `[180..220]`, `[380..420]`, `[590..630]` + smooth cleanup | `src/scenes/GameScene.ts` (`isInSpawnPauseWindow`, schedule guards, `pruneOffscreenBuoysForSpawnPauseWindow`, `isSpriteFullyOffscreen`) | PASS (code), MANUAL |
| 8 | Result UI texts and rules for success/failure/lost coins | `src/scenes/ResultScene.ts` (`reason`, title/labels, lost coins conditional) | PASS (code), MANUAL |
| 9 | Visual placement (top-center progress, island right, tavern left, harbor center/top) | `src/config/tuning.ts` (`progressXRatio=0.5`, landmark `xRatio`) | PASS (config), MANUAL |

## Contract Verification (Game -> Result)

Implemented payload:
- `distanceM`
- `coinsAwarded`
- `coinsLost`
- `reason: "out_of_assets" | "success_island_200" | "success_tavern_400" | "success_harbor_610"`

Evidence:
- `src/scenes/GameScene.ts` (`finishRunSuccess`, `finishRunFailure`)
- `src/scenes/ResultScene.ts` (`ResultPayload`, `ResultReason`, text rendering branches)

## Manual Run Checklist (to complete in gameplay)

### Desktop

- [ ] Progress bar transitions verified at 100/200/300/400/500/600
- [ ] Pending coin totals verified at 150/350/550 defeat scenarios
- [ ] Success scenarios verified: `earth-1`, `earth-2`, `earth-3`/gate
- [ ] Bypass scenarios verified: island left, tavern right
- [ ] Quiet window: новые не спавнятся, видимые остаются, оффскрин очищаются
- [ ] Result screen labels/coins/lost coins verified
- [ ] Screenshot evidence saved for each Result state
- [ ] Dynamic buoy smoke:
  - `money_change_no` is not collected on yacht contact
  - Assets do not change for `money_change_no` contact
  - `money_change_no` gets visible push/repel from yacht
  - `money_change_up/down` keep previous collect behavior

### iPhone

- [ ] Same scenario set completed as desktop
- [ ] Swipe/drag control readability and responsiveness verified
- [ ] HUD/Result overlap/readability verified for iPhone viewport

## Current Stage Summary

- Code/config implementation is consistent with the agreed logic contract.
- Two UI alignment discrepancies were found and fixed in `src/config/tuning.ts`.
- Remaining acceptance work is runtime/manual execution on desktop and iPhone.
