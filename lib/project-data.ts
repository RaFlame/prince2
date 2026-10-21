import type { Locale } from "./i18n"
import { loc } from "./i18n"

type L = { is: string; en: string }

export const projectMeta = {
  name: {
    is: "Myndgreiningareftirlit um borð",
    en: "Onboard camera-based monitoring",
  } satisfies L,
  organisation: {
    is: "Fiskistofa",
    en: "Directorate of Fisheries",
  } satisfies L,
  roleFocus: {
    is: "Sérfræðingur í tækniþróun eftirlits",
    en: "Specialist in monitoring technology development",
  } satisfies L,
  status: "onTrack" as const,
  lastUpdated: {
    is: "21. okt. 2026",
    en: "21 Oct 2026",
  } satisfies L,
  duration: {
    is: "24 mánuðir (learning phase)",
    en: "24 months (learning phase)",
  } satisfies L,
}

export const justification: L = {
  is: "Óbeint framhald af tilraunaverkefni um rafrænt eftirlit í fiskiskipum sem gekk vel. Samkomulag var gert við útgerðir um myndgreiningarbúnað á færiböndum að mjölverksmiðju, en verkefnið hefur ekki komist af stað hjá útgerðinni. Fiskistofa telur brýnt að stofnunin taki leiðandi hlutverk, með fjármagni til að hefja og viðhalda verkefninu — sem mikilvægt skref að myndavélaeftirliti á skipum yfir 20 m.",
  en: "An indirect continuation of a successful electronic monitoring pilot on fishing vessels. Agreements were made with vessel operators to install image-analysis equipment on conveyors feeding the onboard meal plant, but the work has not started on the operators’ side. The Directorate considers it urgent to take a leading role, with funding to start and sustain the project — a key step toward camera monitoring on vessels over 20 m.",
}

export const objectives: L[] = [
  {
    is: "Styrkja eftirlit og auka sjálfvirkni í sjóeftirliti, ásamt því að gera það kostnaðarminna.",
    en: "Strengthen monitoring and increase automation in at-sea surveillance, while reducing cost.",
  },
  {
    is: "Finna lausnir á vandamálum sem vitað er að geta komið upp vegna smáfisks og verðlítilla tegunda.",
    en: "Find solutions to known issues linked to small fish and low-value species.",
  },
  {
    is: "Styrkja gagnaöflun í þágu vísindanna.",
    en: "Strengthen data collection in support of science.",
  },
]

export const benefits: L[] = [
  {
    is: "Auka eftirlitsþekju og gera veiðar gagnsærri.",
    en: "Increase monitoring coverage and make fishing more transparent.",
  },
  {
    is: "Efla traust milli aðila í greininni.",
    en: "Build trust among stakeholders in the sector.",
  },
  {
    is: "Sýna að Ísland sé leiðandi í eftirliti og samstarfi hagsmunaaðila, ekki aðeins í veiðum og vinnslu.",
    en: "Demonstrate that Iceland leads in monitoring and stakeholder cooperation, not only in fishing and processing.",
  },
  {
    is: "Til lengri tíma heildarávinningur fyrir útgerð og þjóðarbú — vernd fiskistofna.",
    en: "Long-term net benefit for industry and the nation — protecting fish stocks.",
  },
]

export const scope: L = {
  is: "Í upphafi eitt skip (einn undirritaður samningur; markmið um tvö). Learning phase með einum starfsmanni til tveggja ára. Að auki má reikna með að allt að fjórum starfsmönnum Fiskistofu (Eftirlit og UT) hafi aðkomu — ekki fast í hendi. Ekki innleiðing alls flotans í þessu verkefni.",
  en: "Initially one vessel (one signed contract; aim for two). Learning phase with one hire for two years. Up to four Directorate staff (Inspection and IT) may be involved — not locked in. This project is not a full fleet rollout.",
}

export const productsSummary: L = {
  is: "Velja réttan hug- og vélbúnað sem getur sjálfvirkt greint fisk og fiskhluta, ákvarðað tegund og áætlað vigt. Byggja áreiðanlega tækni sem greinir eða merkir frávik í vinnsluferlinu um borð (færiband að mjöl).",
  en: "Select the right software and hardware to automatically detect fish and fish parts, identify species, and estimate weight. Build reliable technology that detects or flags anomalies in the onboard processing flow (conveyor to meal plant).",
}

export const thesis: L = {
  is: "Sem sérfræðingur í tækniþróun eftirlits á ég tæknilega leiðina: endurræsi uppsetningu á einu skipi, skilgreini kröfur og matsspjald, vel og sannreyni hug-/vélbúnað sem greinir tegund og áætlar vigt á færibandi að mjöl, með manni í lykkju — og skil af rekstrarhæfri forskrift að myndavélaeftirliti á skipum yfir 20 m.",
  en: "As specialist in monitoring technology development I own the technical path: restart installation on one vessel, define requirements and an evaluation matrix, select and validate software/hardware that identifies species and estimates weight on the meal-plant conveyor, with a human in the loop — and deliver an operational specification for camera monitoring on vessels over 20 m.",
}

export type ToleranceId = "time" | "cost" | "scope" | "risk"

export const tolerances: {
  id: ToleranceId
  value: L
  detail: L
  tone: "good" | "neutral" | "watch"
}[] = [
  {
    id: "time",
    value: { is: "24 mán.", en: "24 mo." },
    detail: {
      is: "Áætlun frá endurræsingu til scale-forskriftar",
      en: "Plan from restart through scale-readiness specification",
    },
    tone: "neutral",
  },
  {
    id: "cost",
    value: { is: "1 staða + búnaður", en: "1 FTE + kit" },
    detail: {
      is: "Fjármagn til að hefja og viðhalda í 2 ár (auk hlutastarfa Eftirlits/UT)",
      en: "Funding to start and sustain for 2 years (plus part-time Inspection/IT)",
    },
    tone: "watch",
  },
  {
    id: "scope",
    value: { is: "1 skip → 2", en: "1 vessel → 2" },
    detail: {
      is: "Learning phase; leið að >20 m er afurð, ekki innleiðing núna",
      en: "Learning phase; path to >20 m is a product, not rollout now",
    },
    tone: "good",
  },
  {
    id: "risk",
    value: { is: "2 háar", en: "2 high" },
    detail: {
      is: "Útgerðartöf og ofmetin AI — sjá áhættuskrá",
      en: "Operator delay and overstated AI — see risk register",
    },
    tone: "watch",
  },
]

export type StageStatus = "notStarted" | "inProgress" | "complete"

export const stages: {
  id: string
  name: L
  owner: L
  progress: number
  endDate: L
  status: StageStatus
  gate: L
  outcomes: L[]
}[] = [
  {
    id: "P0",
    name: {
      is: "P0 — Endurræsing og kröfur (mán. 0–3)",
      en: "P0 — Restart & requirements (mo. 0–3)",
    },
    owner: {
      is: "Sérfræðingur tækniþróun (+ yfirstjórn/útgerð)",
      en: "Tech development specialist (+ exec / operator)",
    },
    progress: 0,
    endDate: { is: "mán. 3", en: "mo. 3" },
    status: "notStarted",
    gate: {
      is: "Samþykkt kröfulýsing, endurstart með útgerð, fjárþörf til yfirstjórnar",
      en: "Approved requirements, operator restart, funding ask to leadership",
    },
    outcomes: [
      {
        is: "SRS-lite kröfulýsing (umhverfi um borð, FOV, gagnanotkun, varðveisla)",
        en: "SRS-lite requirements (onboard environment, FOV, data use, retention)",
      },
      {
        is: "Drög að matsspjald og birgjalista",
        en: "Draft evaluation matrix and vendor long-list",
      },
      {
        is: "Endurskoðaður samstarfssamningur (eign, aðgangur, nám vs. eftirlit)",
        en: "Revised cooperation agreement (ownership, access, learning vs enforcement)",
      },
    ],
  },
  {
    id: "P1",
    name: {
      is: "P1 — Uppsetning og human baseline (mán. 3–9)",
      en: "P1 — Install & human baseline (mo. 3–9)",
    },
    owner: {
      is: "Sérfræðingur + UT + Eftirlit",
      en: "Specialist + IT + Inspection",
    },
    progress: 0,
    endDate: { is: "mán. 9", en: "mo. 9" },
    status: "notStarted",
    gate: {
      is: "Nægileg gagnagæði (% usable footage); SOP um borð; engar traustsbrot",
      en: "Sufficient data quality (% usable footage); onboard SOP; no trust breaches",
    },
    outcomes: [
      {
        is: "Myndavél(ar) yfir færibandi að mjöl, edge-geymsla, dulkóðun, upphal",
        en: "Camera(s) over meal conveyor, edge storage, encryption, upload",
      },
      {
        is: "Handvirkar merkingar (ground truth) með Eftirliti",
        en: "Manual labels (ground truth) with Inspection",
      },
      {
        is: "Grunnmælikvarðar: uptime, daga án gagna, skýrleiki mynda",
        en: "Baseline metrics: uptime, days without data, image clarity",
      },
    ],
  },
  {
    id: "P2",
    name: {
      is: "P2 — PoC sjálfvirkni (mán. 9–18)",
      en: "P2 — Automation PoC (mo. 9–18)",
    },
    owner: {
      is: "Sérfræðingur tækniþróun (mat) + Eftirlit (yfirferð)",
      en: "Tech specialist (evaluation) + Inspection (review)",
    },
    progress: 0,
    endDate: { is: "mán. 18", en: "mo. 18" },
    status: "notStarted",
    gate: {
      is: "Tækniskýrsla: hvað AI getur/getur ekki; tillaga um framhald",
      en: "Technical report: what AI can/cannot do; recommendation to continue",
    },
    outcomes: [
      {
        is: "Kaupa/aðlaga þroskaða EM/CV-lausn með opnum viðmótum",
        en: "Buy/adapt mature EM/CV solution with open interfaces",
      },
      {
        is: "Matsspjald: tegundanákvæmni, vigtarvilla, false positives, TCO, stigmótanleiki",
        en: "Scorecard: species accuracy, weight error, false positives, TCO, scalability",
      },
      {
        is: "Human-in-the-loop yfirferðarröð fyrir frávik",
        en: "Human-in-the-loop review queue for anomalies",
      },
    ],
  },
  {
    id: "P3",
    name: {
      is: "P3 — Scale readiness (mán. 18–24)",
      en: "P3 — Scale readiness (mo. 18–24)",
    },
    owner: {
      is: "Sérfræðingur + yfirstjórn",
      en: "Specialist + executive",
    },
    progress: 0,
    endDate: { is: "mán. 24", en: "mo. 24" },
    status: "notStarted",
    gate: {
      is: "Ákvörðunarskjal: continue / redesign / pause — með gögnum",
      en: "Decision memo: continue / redesign / pause — with evidence",
    },
    outcomes: [
      {
        is: "Skip 2 ef samningur næst; ella skjalaðar hindranir",
        en: "Vessel 2 if contracted; otherwise documented blockers",
      },
      {
        is: "Staðlað uppsetningarferli, þjálfun Eftirlits, rekstrarlíkan UT",
        en: "Standard install process, Inspection training, IT operating model",
      },
      {
        is: "Tæknileg forskrift að myndavélaeftirliti á >20 m",
        en: "Technical specification for camera monitoring on >20 m vessels",
      },
    ],
  },
]

export type RiskSeverity = "high" | "medium" | "low"
export type RiskStatus = "open" | "mitigating" | "monitoring"

export const risks: {
  ref: string
  description: L
  owner: L
  category: L
  severity: RiskSeverity
  status: RiskStatus
  target: L
  mitigation: L
}[] = [
  {
    ref: "R-01",
    description: {
      is: "Útgerð dregst aftur eða tefur uppsetningu (eins og áður).",
      en: "Operator delays again or stalls installation (as before).",
    },
    owner: { is: "Yfirstjórn / sérfræðingur", en: "Executive / specialist" },
    category: { is: "Hagsmunaaðilar", en: "Stakeholders" },
    severity: "high",
    status: "open",
    target: { is: "P0", en: "P0" },
    mitigation: {
      is: "Fiskistofa leiðir og fjármagnar búnað þar sem hægt er; skýr learning-window; nafngreindur tengiliður.",
      en: "Directorate leads and funds kit where possible; clear learning window; named contact.",
    },
  },
  {
    ref: "R-02",
    description: {
      is: "Aðeins einn samningur — annað skip næst ekki.",
      en: "Only one contract — second vessel not secured.",
    },
    owner: { is: "Yfirstjórn", en: "Executive" },
    category: { is: "Umfang", en: "Scope" },
    severity: "medium",
    status: "monitoring",
    target: { is: "P3", en: "P3" },
    mitigation: {
      is: "Ná árangri á einu skipi; samhliða mild nálgun fyrir skip 2; ekki loka P1 á öðrum samningi.",
      en: "Succeed loudly on one vessel; soft parallel outreach for #2; do not block P1 on second contract.",
    },
  },
  {
    ref: "R-03",
    description: {
      is: "Ofmetin geta gervigreindar / of lág gagnagæði.",
      en: "Overstated AI capability / insufficient data quality.",
    },
    owner: { is: "Sérfræðingur tækniþróun", en: "Tech development specialist" },
    category: { is: "Tækni", en: "Technical" },
    severity: "high",
    status: "open",
    target: { is: "P1–P2", en: "P1–P2" },
    mitigation: {
      is: "Human baseline áður en PoC; forgangstegundir; birta villutölur; P1 go/no-go.",
      en: "Human baseline before PoC; priority species; publish error rates; P1 go/no-go.",
    },
  },
  {
    ref: "R-04",
    description: {
      is: "False positives auka álag á Eftirlit.",
      en: "False positives overload Inspection review capacity.",
    },
    owner: { is: "Eftirlit", en: "Inspection" },
    category: { is: "Rekstrarhæfni", en: "Operations" },
    severity: "medium",
    status: "open",
    target: { is: "P2", en: "P2" },
    mitigation: {
      is: "Stillanleg þröskuldur; mæla yfirferðartíma vikulega.",
      en: "Tunable thresholds; measure review hours weekly.",
    },
  },
  {
    ref: "R-05",
    description: {
      is: "Læsing hjá birgja / léleg viðmót til UT.",
      en: "Vendor lock-in / poor interfaces for IT.",
    },
    owner: { is: "Sérfræðingur + UT", en: "Specialist + IT" },
    category: { is: "Innkaup", en: "Procurement" },
    severity: "medium",
    status: "open",
    target: { is: "P2", en: "P2" },
    mitigation: {
      is: "Krefjast API/útflutnings í samningi; UT samþykki viðmót.",
      en: "Require API/export in contract; IT sign-off on interfaces.",
    },
  },
  {
    ref: "R-06",
    description: {
      is: "Fjármögnun næst ekki eða fellur niður.",
      en: "Funding not secured or withdrawn.",
    },
    owner: { is: "Yfirstjórn", en: "Executive" },
    category: { is: "Fjármál", en: "Financial" },
    severity: "high",
    status: "mitigating",
    target: { is: "P0", en: "P0" },
    mitigation: {
      is: "Áfangaskipt innkaup; TCO fyrir >20 m; tengja við ábyrgð á fiskistofnum.",
      en: "Phased spend; TCO for >20 m; tie to stock stewardship narrative.",
    },
  },
]

export const team: {
  role: L
  responsibility: L
  raci: "R" | "A" | "C" | "I"
}[] = [
  {
    role: {
      is: "Sérfræðingur í tækniþróun eftirlits",
      en: "Specialist in monitoring technology development",
    },
    responsibility: {
      is: "Kröfur, arkitektúr, birgjamat, PoC, mælikvarðar, tækniskýrslur, scale-playbook",
      en: "Requirements, architecture, vendor evaluation, PoC, metrics, tech reports, scale playbook",
    },
    raci: "R",
  },
  {
    role: { is: "Eftirlit", en: "Inspection" },
    responsibility: {
      is: "Hvað telst frávik; ground truth; SOP; tenging við áhættugreiningu",
      en: "What counts as an anomaly; ground truth; SOP; link to risk-based control",
    },
    raci: "A",
  },
  {
    role: { is: "Upplýsingatækni (UT)", en: "IT" },
    responsibility: {
      is: "Net, geymsla, aðgangsstýring, rekstur, tenging við PowerBI/innri kerfi",
      en: "Network, storage, access control, operations, PowerBI / internal systems",
    },
    raci: "C",
  },
  {
    role: { is: "Útgerð", en: "Vessel operator" },
    responsibility: {
      is: "Aðgangur að skipi, áhöfn, viðhald linsa/umhverfi skv. samningi",
      en: "Vessel access, crew practices, lens/environment maintenance per agreement",
    },
    raci: "C",
  },
  {
    role: { is: "Yfirstjórn / stýrihópur", en: "Executive / steering group" },
    responsibility: {
      is: "Fjármögnun, forgangur, pólitískt/samfélagslegt umboð",
      en: "Funding, prioritisation, political / public mandate",
    },
    raci: "A",
  },
]

export const documents: {
  name: L
  type: L
  stage: string
  status: "planned" | "draft"
}[] = [
  {
    name: {
      is: "Kröfulýsing (SRS-lite)",
      en: "Requirements specification (SRS-lite)",
    },
    type: { is: "Stjórnunarskjal", en: "Management product" },
    stage: "P0",
    status: "planned",
  },
  {
    name: {
      is: "Matsspjald hug-/vélbúnaðar",
      en: "Hardware/software evaluation matrix",
    },
    type: { is: "Tækniáætlun", en: "Technical product" },
    stage: "P0–P2",
    status: "planned",
  },
  {
    name: {
      is: "Samstarfssamningur við útgerð",
      en: "Operator cooperation agreement",
    },
    type: { is: "Samningur", en: "Agreement" },
    stage: "P0",
    status: "draft",
  },
  {
    name: {
      is: "Vessel Installation Plan / SOP um borð",
      en: "Vessel Installation Plan / onboard SOP",
    },
    type: { is: "Rekstrarhandbók", en: "Operating manual" },
    stage: "P1",
    status: "planned",
  },
  {
    name: {
      is: "Tækniskýrsla PoC (nákvæmni, frávik, takmarkanir)",
      en: "PoC technical report (accuracy, anomalies, limits)",
    },
    type: { is: "Tækniáætlun", en: "Technical product" },
    stage: "P2",
    status: "planned",
  },
  {
    name: {
      is: "Kostnaðarlíkan (TCO) og scale-forskrift >20 m",
      en: "Cost model (TCO) and >20 m scale specification",
    },
    type: { is: "Ákvörðunarskjal", en: "Decision product" },
    stage: "P3",
    status: "planned",
  },
  {
    name: {
      is: "Gagnaafurð fyrir vísindi (samantektir)",
      en: "Science data product (aggregates)",
    },
    type: { is: "Gagnaafurð", en: "Data product" },
    stage: "P2–P3",
    status: "planned",
  },
]

export function pick(locale: Locale, value: L): string {
  return loc(locale, value)
}
