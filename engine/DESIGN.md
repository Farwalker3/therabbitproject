# The Warren Engine — Design Document

**An open-source Substrate pallet suite for autonomous idle worlds.**
Reference implementation: The Rabbit Project Revival.

Status: design phase (pre-implementation). This document is the technical
backbone of a planned Web3 Foundation Grants Program application
(`research/w3f-application-draft.md`).

---

## 1. Thesis: idle worlds belong in the runtime

An idle game has one defining property: **the world advances whether or not
any player acts.** Raids resolve on timers. Injuries heal over time. Crops —
or carrots — grow.

On EVM chains, this property is faked. Contract state is inert between
transactions, so "idle" games either:

- **lazy-evaluate** — recompute elapsed time when a user finally transacts
  (the world doesn't actually run; it back-fills), or
- **pay keepers** — Chainlink Automation, Gelato, or a project-run cron bot
  poke the contract on a schedule (an off-chain dependency with ongoing cost
  and a liveness assumption). Even MUD, the leading EVM autonomous-world
  framework, needs an off-chain tick driver.

Substrate runtimes are different in kind, not degree. FRAME pallets receive
**`on_initialize` and `on_idle` hooks**: weight-budgeted logic the chain
itself executes every block, with **zero transactions in flight**. A
Substrate-based world literally keeps running when everyone logs off.

That is the entire premise of The Rabbit Project — a game whose players
vanished and whose rabbits kept grinding. The engine that revives it should
be the engine where that premise is a first-class primitive.

## 2. What exists, what's missing

- `pallet-scheduler` dispatches *individual calls* at target blocks. It is
  not designed for a game's needs: thousands of small recurring tasks,
  batch resolution under a weight budget, graceful overflow when a block is
  full, and game-defined resolution logic.
- `pallet-nfts` provides collection/item primitives but no notion of item
  *state over time* (energy, injury, cooldowns) or trait inheritance.
- No general-purpose "world tick" pallet exists. Every Substrate game team
  rebuilds this from scratch. **The Warren Engine is that missing layer,**
  built generic and published for any team to reuse.

## 3. Architecture

Four pallets, dependency-ordered. All logic weight-benchmarked; all
randomness manipulation-resistant by design (see §4).

### 3.1 `pallet-warren` — the tick engine (core deliverable)

The autonomous heart. A weight-bounded task queue processed by the runtime
itself.

- **Storage**: `TasksByBlock: StorageMap<BlockNumber, BoundedVec<TaskId>>`
  plus `Tasks: StorageMap<TaskId, TaskInfo>` — tasks scheduled for future
  blocks by other pallets through a `ScheduleTick` trait.
- **Execution**: `on_initialize` drains tasks due at the current block under
  a configurable weight budget (`MaxTickWeight`, a fraction of block
  weight). Unprocessed tasks spill to `on_idle` (consuming genuinely spare
  block weight), then roll forward to the next block — the world never
  stalls, it only stretches.
- **Extension point**: a `TickHandler` associated type lets any downstream
  pallet register resolution logic. `pallet-warren` knows nothing about
  rabbits; it is a generic autonomous-execution substrate for any game or
  agent system.
- **Guarantees documented and tested**: bounded weight per block, FIFO
  fairness within a block, deterministic ordering, overflow behavior under
  load (property tests flood the queue and assert liveness).

### 3.2 `pallet-critters` — stateful creature NFTs

- **Genome**: fixed-length trait vector (colors, patterns, stats) stored
  per critter; deterministic inheritance function over two parent genomes +
  a randomness input.
- **State machine**: `Idle → OnExpedition → Injured → Recovering → Idle`,
  plus `Breeding` cooldowns. Time-based transitions are `pallet-warren`
  tasks — healing completes because the chain ticks, not because a user
  submits a "claim healing" transaction.
- **Compatibility**: implements an adapter so critters can surface through
  `pallet-nfts` for wallet/marketplace interoperability, keeping the engine
  useful beyond our game.

### 3.3 `pallet-expeditions` — raids, injuries, loot

- `start_expedition(critters, destination)` validates party state, locks the
  critters, and schedules a resolution task N blocks ahead via
  `pallet-warren`.
- Resolution (inside the tick, no transaction): outcome computed from party
  stats + destination difficulty + randomness → rewards minted (fungible
  `$CARROT` via the `fungibles` traits, gem assets), injuries applied with
  recovery tasks scheduled.
- Hospital economics from the recovered canon: `heal(critter)` burns
  $CARROT to shorten a recovery task — the original game's loop, faithfully
  on-chain.

### 3.4 `pallet-clans` — social layer (stretch goal)

Clan registry, membership, shared treasury sub-accounts, and arena
challenge/match records. Scoped as a later milestone or follow-up grant;
the engine is complete without it.

## 4. Randomness: stated honestly

Breeding rolls and raid outcomes need randomness that players cannot grind.

- **Dev/demo**: `insecure-randomness-collective-flip`, clearly labeled
  unsafe for value decisions.
- **Production design**: BABE epoch randomness (VRF-derived) combined with a
  **commit–reveal delay**: the randomness applied to an expedition or
  breeding event is drawn from an epoch *after* the action was committed,
  so neither player nor block author can pick outcomes. The one-epoch delay
  is a natural fit — expeditions take time by design.
- Known limitations (epoch granularity, last-revealer considerations) are
  documented rather than hidden; the pallet exposes a `Randomness` config
  type so chains with stronger beacons can plug them in.

## 5. Why this is Polkadot-specific (not portable chain-shopping)

1. **Native autonomous execution** — the engine's core primitive
   (`on_initialize`/`on_idle` ticking) does not exist on EVM/WASM contract
   platforms; there it requires keeper networks. This code cannot be ported
   without losing its reason to exist.
2. **Forkless upgrades as live-ops** — game balancing (raid tables, breeding
   odds) ships as runtime upgrades, no migrations or redeployments.
3. **Fee abstraction** — core loop extrinsics can be made feeless or
   fee-sponsored at the runtime level; players never need gas tokens.
4. **Coretime economics** — an idle world's compute is small and
   predictable; on-demand coretime makes an autonomous world affordable to
   keep alive — thematically and literally.
5. **XCM future** — critters and $CARROT as cross-chain assets; other
   parachains' communities join the world without bridges.

## 6. Deliverable standards

Every milestone ships: Apache-2.0 license, rustdoc + a written tutorial,
unit + integration tests (with a testing guide), benchmarks with generated
`WeightInfo`, and a Dockerfile that spins up the demo chain. Final
deliverable includes a **"dead warren" demo**: a solochain (built from the
`polkadot-sdk` solochain template) plus a minimal web dashboard showing the
world advancing — expeditions resolving, rabbits healing — **with zero
transactions submitted**. The empty warren, running anyway.

## 7. Relationship to the wider project

- **This repo** (`therabbitproject`) holds the recovered IP, the revival
  site, and the series treatment. The engine code will live in a dedicated
  repository (`warren-engine`) once implementation starts, for clean CI and
  W3F milestone links; this design doc is its seed.
- **Funding split** (see `research/GRANTS.md`): SKALE/Sei applications fund
  the *game product and community*; the W3F application funds only this
  *open-source engine* — reusable by any Substrate team. No overlap in
  funded deliverables.
- The animated series is not part of any W3F milestone; it is the cultural
  layer that makes the reference implementation legible to a mainstream
  audience.
