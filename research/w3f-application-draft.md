# W3F Grant Application — DRAFT (do not submit yet; see "Pre-submission checklist" at bottom)

> Target: Level 1 (up to $10,000), submitted as a PR to
> https://github.com/w3f/Grants-Program following their
> `applications/application-template.md`. Field names below mirror the
> template.

---

- **Project Name:** Warren Engine
- **Team Name:** Kodair (Farwalker3)
- **Payment Details:**
  - **DOT**: [Polkadot address — create before submitting]
  - **Payment**: [AssetHub USDC address], 50% DOT / 50% USDC
- **Level:** 1

## Project Overview :page_facing_up:

### Overview

**Warren Engine is an open-source Substrate pallet suite for autonomous
idle worlds — game worlds whose state advances every block, in the runtime
itself, with zero transactions.**

On EVM platforms, "idle" games either lazy-evaluate elapsed time when a
user finally transacts or pay off-chain keeper networks to poke contracts.
FRAME's `on_initialize`/`on_idle` hooks make autonomous world-advancement a
native primitive — a capability unique to the Substrate stack. Warren
Engine packages it as reusable infrastructure: a weight-bounded tick engine,
stateful creature NFTs with trait inheritance, and timed expedition
resolution.

The reference implementation revives **The Rabbit Project**, an abandoned
NFT idle game whose canon and artwork we have recovered and archived
(https://github.com/Farwalker3/therabbitproject) and which is being
developed into an animated series. The engine's flagship demo is the show's
premise made executable: a world that keeps running after everyone logs
off.

### Project Details

Full design document:
https://github.com/Farwalker3/therabbitproject/blob/main/engine/DESIGN.md

- **`pallet-warren`** — generic tick engine: task queue keyed by block
  number, drained in `on_initialize` under a configurable weight budget,
  spilling to `on_idle`, rolling forward under load. Downstream pallets
  register resolution logic through a `TickHandler` trait.
- **`pallet-critters`** — creature NFTs with genomes (deterministic trait
  inheritance), a time-based state machine (idle / expedition / injured /
  recovering / breeding-cooldown) driven by warren tasks, and a
  `pallet-nfts` adapter for wallet/marketplace interoperability.
- **`pallet-expeditions`** — timed raids: lock party → schedule resolution
  N blocks ahead → outcome from stats + manipulation-resistant randomness
  (commit–reveal over BABE epoch randomness; pluggable `Randomness` config)
  → rewards via `fungibles` traits, injuries with scheduled recovery.
- **Demo**: a solochain (polkadot-sdk solochain template) + minimal web
  dashboard displaying expeditions resolving and rabbits healing with zero
  transactions submitted.

Technology: Rust, FRAME/polkadot-sdk, TypeScript (demo UI via polkadot.js).

**What Warren Engine is not**: not a token launch (no token in any
milestone; $CARROT in the demo is a plain `pallet-assets` asset), not a
game economy design, not the animated series — those are funded and
developed separately (disclosed below).

### Ecosystem Fit

- **Gap**: no general-purpose autonomous-execution layer for games exists
  in the ecosystem; every Substrate game team hand-rolls scheduling.
  `pallet-scheduler` dispatches individual calls, not weight-bounded batch
  game ticks.
- **Audience**: Substrate game developers, autonomous-worlds builders, and
  agent-simulation projects needing on-chain time.
- **Comparable work**: MUD (EVM) requires off-chain tick drivers; nothing
  equivalent ships as reusable FRAME pallets.
- **Why Polkadot specifically**: the core primitive (runtime hooks) exists
  only here; plus forkless upgrades as live-ops, runtime-level fee
  abstraction for playerless onboarding, and coretime economics that make
  keeping a small autonomous world alive affordable.

## Team :busts_in_silhouette:

- **Team Leader:** John C. Barr (Farwalker3)
- **Contact:** [name / email]
- **Website:** https://github.com/Farwalker3 · https://github.com/kodarize

Independent builder; nine years of public GitHub work (63+ repos):
consumer mobile apps (Flutter/Dart), web games, AI/automation tooling (MCP
servers, media pipelines), and web3 onboarding (Nearzy — free NEAR
wallets). Executed The Rabbit Project recovery end-to-end: archives,
reconstructed canon, revival site, and series treatment, all public.

**Honest disclosure**: this is the team's first Substrate/Rust project.
Development is done in partnership with AI engineering tooling (Claude,
Anthropic), with all code delivered against W3F's milestone review —
working, tested, benchmarked code or no payment. We have scoped Level 1
conservatively for exactly this reason.

### Team Code Repos

- https://github.com/Farwalker3/therabbitproject (this project)
- https://github.com/kodarize (org)
- Engine repo on grant start: https://github.com/Farwalker3/warren-engine

## Development Status :open_book:

- Design document complete: `engine/DESIGN.md` (link above)
- Recovered game canon defining the reference implementation's mechanics:
  `research/RESEARCH.md`
- [Update before submitting: pallet-warren skeleton + passing tests — see
  pre-submission checklist]

## Development Roadmap :nut_and_bolt:

- **Total Estimated Duration:** 3.5 months
- **Full-Time Equivalent (FTE):** 1
- **Total Costs:** 10,000 USD
- **DOT %:** 50%

### Milestone 1 — `pallet-warren` (tick engine) — 1.5 months — 4,000 USD

| Number | Deliverable | Specification |
| -----: | ----------- | ------------- |
| 0a. | License | Apache 2.0 |
| 0b. | Documentation | Inline rustdoc + tutorial: "add an autonomous tick to your runtime" |
| 0c. | Testing and Testing Guide | Unit tests incl. weight-budget overflow & ordering property tests; guide to run them |
| 0d. | Docker | Dockerfile running a node with the pallet + tests |
| 1. | `pallet-warren` | Task scheduling API (`ScheduleTick` trait), weight-bounded `on_initialize` drain, `on_idle` spillover, roll-forward under load, `TickHandler` extension point |
| 2. | Benchmarks | FRAME benchmarks + generated `WeightInfo` |

### Milestone 2 — `pallet-critters` — 1 month — 3,000 USD

| Number | Deliverable | Specification |
| -----: | ----------- | ------------- |
| 0a–0d. | (as above) | License, docs+tutorial, tests+guide, Docker |
| 1. | `pallet-critters` | Genome storage, deterministic trait inheritance, time-based state machine driven by warren tasks |
| 2. | Randomness design | Commit–reveal breeding over pluggable `Randomness`; documented threat model & limitations |
| 3. | `pallet-nfts` adapter | Critters exposed for wallet/marketplace interop |

### Milestone 3 — `pallet-expeditions` + autonomous world demo — 1 month — 3,000 USD

| Number | Deliverable | Specification |
| -----: | ----------- | ------------- |
| 0a–0d. | (as above) | License, docs+tutorial, tests+guide, Docker |
| 0e. | Article | Public write-up: "Worlds that keep running: autonomous idle games on Substrate" |
| 1. | `pallet-expeditions` | Party lock, scheduled resolution, rewards via `fungibles`, injury/recovery loop, heal-with-burn extrinsic |
| 2. | Demo chain + dashboard | Solochain runtime with all three pallets + web dashboard showing the world advancing with zero transactions |

## Future Plans

- Deploy the reference world as the revived Rabbit Project (game product
  funded separately — see disclosure), evaluate coretime deployment.
- `pallet-clans` (clan treasuries, arena) as a follow-up grant or
  community contribution.
- Maintenance commitment: the engine underpins our own game; it stays
  maintained because we ship on it.

## Additional Information :heavy_plus_sign:

**How did you hear about the Grants Program?** Web3 Foundation website /
grants repo.

**Disclosures**: The Rabbit Project revival (game product, community,
animated series) is separately seeking ecosystem funding (SKALE gaming
grant application submitted; Sei Creator Fund planned). **No deliverable in
this application overlaps with those**: this grant funds only the
open-source, chain-generic-within-Substrate engine described above. The
series and game economy are explicitly out of scope here.

---

## Pre-submission checklist (internal — delete before PR)

1. **Build prior work first.** W3F: "better chances… with some prior work
   shown." Create `warren-engine` repo, scaffold `pallet-warren` with a
   compiling skeleton + first passing tests, then submit. Target: 2–3
   sessions of work.
2. **Office hours dry-run.** Book https://grants.web3.foundation/docs/office-hours
   and pitch the concept before the public PR — free committee signal.
3. Create Polkadot + AssetHub addresses; fill payment fields.
4. Fill contact name/email; complete KYC when requested (Sumsub links in
   their README).
5. Re-verify template headings against the current
   `application-template.md` on submission day.
6. Check their RFP list for an adjacent RFP worth citing.
