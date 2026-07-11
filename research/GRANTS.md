# Funding the Revival — Crypto Grant Targets

Compiled 2026-07-11. Ranked by fit for this project: reviving an abandoned
Sei-chain NFT idle game as a story/TV series with a community site.

A note on framing before applying anywhere: **crypto grants fund building,
not television production.** The winning pitch is the on-chain half of the
plan — reviving the game/community/IP — with the show as the cultural payoff
that makes the ecosystem look good.

---

## Tier 1 — Apply first (strong natural fit)

### 1. Sei Creator Fund — $10M (Sei Foundation + Gitcoin)
**The best fit on the list.** The Rabbit Project was a Sei game
(@RabbitsOnSei); "reviving a dormant Sei NFT project and its community" is
precisely the kind of story an ecosystem fund wants to tell.

- **What it funds**: new and existing **NFT and Social projects on Sei** —
  collections, applications, content creation, fan engagement, creator
  collectives, even IRL events.
- **How**: Phase 1 direct applications to the Foundation; Phase 2
  community-directed Gitcoin rounds (recent round had a $250k matching pool).
- **Where**: https://www.sei.io/grants-and-funding · https://www.seifdn.org/ ·
  https://builder.gitcoin.co · announcement: https://blog.sei.io/creator-fund/
- **Our pitch**: revive the collection/community on Sei, rebuild the site,
  seasonal story drops with the show treatment as the flagship content.

### 2. Story (Story Protocol) ecosystem grants
**The thematic bullseye.** Story is the "World's IP Blockchain" ($140M
raised, a16z-led) — built exactly for registering, licensing, and remixing
IP on-chain. Filmmaker David S. Goyer (Blade, The Dark Knight, Foundation)
advises them; they *want* IP-to-screen stories.

- **What it funds**: 38.4% of token supply is allocated to
  Ecosystem + Community (grants, growth programs); creator and dev grants
  flow from this.
- **Where**: https://www.story.foundation/ (ecosystem/grants page) ·
  https://x.com/StoryProtocol
- **Our pitch**: register The Rabbit Project revival as on-chain IP, license
  chapters/characters openly, co-develop the show bible in public — an
  archetypal "dead IP resurrected as licensable on-chain canon" case study.

---

## Tier 2 — Gaming ecosystem funds (fit if we rebuild the game on their chain)

### 3. Arbitrum Gaming Catalyst Program — ~$215M (225M ARB)
- Up to **500,000 ARB (~$480k)** for new/early-stage game developers; larger
  deals for established studios.
- https://arbitrum.foundation/grants
- Fit: strong money, but requires committing the revived game to Arbitrum.

### 4. Polygon Community Grants — Consumer Crypto Track (1B POL over a decade)
- Track explicitly covers **gaming, NFT innovations, content co-creation,
  distributed communities**. Recent season window: June 11 – Aug 31, rolling
  review, ~4-week turnaround — check the current season.
- https://polygon.technology/grants
- Fit: the content/community angle fits without needing a full game rebuild.

### 5. Base Builder Grants — $2M pool
- Small, fast, low-friction grants for shipping builders on Base.
- https://www.base.org/builders (grants section)
- Fit: good "first grant" size for the site + community launch if
  chain-agnostic.

### 6. SKALE $5M P2E / Metaverse / NFT game grants (your bookmark — still live)
- Part of SKALE's $100M ecosystem incentive program; zero-gas gaming chain;
  Typeform application on the page.
- https://p2e.skale.network/mp
- Fit: page is up, but the program dates from the SKALEverse push — confirm
  it's still funding before investing effort. Treat as backup.
- **Status: application submitted (July 2026).**

### 7. Web3 Foundation Grants — via the Warren Engine strategy
- **Reassessed** (was previously ruled out as chain-shopping). The viable
  path is not porting the game — it's funding **Warren Engine**, an
  open-source Substrate pallet suite for autonomous idle worlds, with our
  game as reference implementation. Substrate's `on_initialize`/`on_idle`
  runtime hooks are the only place "the world keeps running when everyone
  logs off" is a native primitive — genuine Polkadot differentiation, in
  the committee's own terms.
- **Level 1, $10k, 3 milestones.** Application: PR to
  https://github.com/w3f/Grants-Program. ≥50% paid in DOT vesting over
  2 years; KYC required. Draft ready: `research/w3f-application-draft.md`;
  design doc: `engine/DESIGN.md`.
- **Funding-split discipline**: W3F money funds only the open-source
  engine; SKALE/Sei money funds the game product and community. No
  overlapping deliverables — disclosed in all applications.
- **Before submitting**: scaffold `pallet-warren` with passing tests
  (prior work matters to their committee), and dry-run the pitch at their
  office hours.

---

## Tier 3 — Infrastructure & discovery (not cash, still valuable)

### 8. Google Cloud for Startups — Web3 program (your bookmark — still live)
- Cloud credits (historically up to ~$200k over 2 years for funded startups,
  smaller tiers for pre-seed), technical support, partner perks. Not a cash
  grant — but it can host the site, game backend, and community infra free.
- https://cloud.google.com/startup/web3

### 9. AlphaGrowth (your bookmark — sign-in wall)
- A grants/BD directory that tracks live programs across ecosystems. Worth
  creating the profile you started and browsing their grants database for
  deadlines this list can't see.
- https://alphagrowth.io

### Directories to sweep monthly
- https://blockchaingrants.org/
- https://www.web3grants.fyi/
- https://coinlaunch.space/events-contests/grant/
- https://rocknblock.io/blog/blockchain-ecosystem-grants-list

---

## Ruled out (from the old bookmarks)

| Bookmark | Verdict |
|---|---|
| ciglop.com.co/404.html | Dead — a bare hosting-panel 404; whatever it hosted is gone. |
| web3.foundation | ~~Ruled out~~ **Reassessed → Tier 2 #7** via the Warren Engine strategy (open-source Substrate engine, not a game port). |

---

## What to prepare before the first application

1. **The live site** — merge PR #1 and enable GitHub Pages; the site *is* the
   pitch deck's front door.
2. **One-page budget & milestones** — e.g., M1 community relaunch (site,
   socials, Discord), M2 collection/IP revival on-chain, M3 story bible +
   pilot script, M4 animated teaser.
3. **Team & rights story** — who you are; the state of the original IP
   (abandoned, domains dead — document the revival claim honestly);
   partnership status with The Rabbit's Club.
4. **Chain decision** — Sei (heritage) vs Story (IP thesis) vs a gaming chain
   (money). Applying to Sei + Story first doesn't require choosing yet;
   Tier 2 does.
5. **The Rabbit's Club partnership** (see RESEARCH.md §8) — a signed or even
   informal collaboration makes every application stronger: living community
   + recovered IP is the whole story.
