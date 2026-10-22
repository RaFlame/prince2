# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: the candidate for *Sérfræðingur í tækniþróun eftirlits* at Fiskistofa, presenting and refining the onboard camera-monitoring (EM) project plan in an interview setting.

Secondary (same product): Fiskistofa project / steering audiences who may reuse the tool as a lightweight project office for the learning-phase EM programme (one vessel first; not fleet rollout).

Jobs: scan justification, objectives, stages, risks, documents, glossary, and RACI; switch Icelandic/English; edit card content where needed.

## Product Purpose

PRINCE2 Control is a bilingual governance dashboard for Fiskistofa’s onboard camera-based monitoring project (*Myndgreiningareftirlit um borð*): meal-plant conveyor image analysis with human-in-the-loop, toward a scale-ready specification for vessels over 20 m.

Success means (both):
- Interviewers grasp scope, stages, risks, and technical ownership within a few minutes.
- The same surface remains usable as an ongoing project-office overview for the learning phase.

## Positioning

A single-project PRINCE2 control surface grounded in the real Fiskistofa EM plan (IS default, EN toggle), not a generic multi-project PMO template. Content and structure encode the candidate’s technical ownership thesis and the learning-phase constraints (one ship, P0–P3, human-in-the-loop).

## Operating Context

Used in browser (local and Vercel). Sections: Overview, Stage plans, Risk register, Documents, Wiki (glossary), Team & roles, Settings (locale). Editable cards persist via Supabase when configured, otherwise localStorage. Icelandic is the default locale.

## Capabilities and Constraints

- Confirmed: section navigation; IS/EN; project data for justification, objectives, benefits, scope, products, tolerances, stages, risks, documents, team/RACI, wiki glossary; editable card text/style with optional Supabase `card_content`.
- Constraints: one focused project (not fleet PMO); public anon RLS on cards is acceptable for demo — tighten with auth later if productionised.
- Undecided: official Fiskistofa visual brand kit / logo assets (none committed in-repo).

## Brand Commitments

Product name: **PRINCE2 Control**. Organisation: **Fiskistofa** / Directorate of Fisheries. Subject: onboard camera-based monitoring.

Binding tone: Icelandic public-sector seriousness — credible, calm, institutional; not playful consumer SaaS. No requirement to reproduce official Fiskistofa brand marks until assets are supplied.

## Evidence on Hand

Real plan content in `lib/project-data.ts`, UI strings in `lib/i18n.ts`, glossary in `lib/glossary.ts`. Do not invent testimonials, budgets, vendor awards, or fleet-deployment claims beyond what those sources state.

## Product Principles

1. Interview clarity first: hierarchy and scan paths must serve a short verbal walkthrough.
2. Bilingual by default: Icelandic primary; English must stay in sync on every durable string.
3. Governance over decoration: PRINCE2 structure (stages, risks, tolerances, products) stays legible.
4. Reusable office tool: patterns that work in interview should still work for ongoing status reading.
5. Public-sector gravity: calm, precise, trustworthy — never gimmicky.

## Accessibility & Inclusion

No formal WCAG target locked yet. Preserve keyboard-reachable navigation, readable contrast, and respect for reduced motion in future design work. Bilingual content must remain equally usable in both locales.
