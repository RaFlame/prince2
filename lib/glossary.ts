type L = { is: string; en: string }

export const glossaryTerms: {
  abbr: string
  expansion: L
  definition: L
}[] = [
  {
    abbr: "SOP",
    expansion: {
      is: "Standard Operating Procedure (staðlað verklag)",
      en: "Standard Operating Procedure",
    },
    definition: {
      is: "Rekstrarhandbók / staðlað verklag um borð — t.d. hreinsun linsa, viðbrögð við bilun og hvernig uppsetning og notkun er skráð.",
      en: "Onboard operating manual — e.g. lens cleaning, fault response, and how installation and use are documented.",
    },
  },
  {
    abbr: "SRS-lite",
    expansion: {
      is: "Software/System Requirements Specification (létt útgáfa)",
      en: "Software/System Requirements Specification (lightweight)",
    },
    definition: {
      is: "Stutt kröfulýsing fyrir eftirlitskerfið: umhverfi um borð, myndsvið, gagnanotkun, varðveislutími o.fl. — ekki full formleg SRS.",
      en: "Short requirements document for the monitoring stack: onboard environment, camera view, data use, retention, etc. — not a full formal SRS.",
    },
  },
  {
    abbr: "FOV",
    expansion: {
      is: "Field of View (sjónsvið myndavélar)",
      en: "Field of View",
    },
    definition: {
      is: "Það sem myndavélin sér — hér yfir færibandið að mjölverksmiðju (horn, þekja, að fiskur haldist í ramma).",
      en: "What the camera can see — here over the conveyor to the meal plant (angle, coverage, fish staying in frame).",
    },
  },
  {
    abbr: "EM",
    expansion: {
      is: "Electronic Monitoring (rafrænt eftirlit)",
      en: "Electronic Monitoring",
    },
    definition: {
      is: "Rafrænt eftirlit með myndavélum og tengdum kerfum um borð í fiskiskipum.",
      en: "Electronic monitoring using cameras and related systems on fishing vessels.",
    },
  },
  {
    abbr: "CV",
    expansion: {
      is: "Computer Vision (tölvusjón)",
      en: "Computer Vision",
    },
    definition: {
      is: "Sjálfvirk greining mynda/myndskeiða — t.d. tegund, stærð/vigt og frávik á færibandi.",
      en: "Automatic analysis of images/video — e.g. species, size/weight, and anomalies on the conveyor.",
    },
  },
  {
    abbr: "PoC",
    expansion: {
      is: "Proof of Concept (sönnunarhugmynd / tilraun)",
      en: "Proof of Concept",
    },
    definition: {
      is: "Takmörkuð sannprófun á tækni (hér áfangi P2) áður en ákveðið er að skala.",
      en: "Limited validation of the technology (here stage P2) before deciding to scale.",
    },
  },
  {
    abbr: "TCO",
    expansion: {
      is: "Total Cost of Ownership (heildarkostnaður eignarhalds)",
      en: "Total Cost of Ownership",
    },
    definition: {
      is: "Heildarkostnaður yfir líftíma — búnaður, leyfi, rekstur, viðhald og útbreiðsla — ekki aðeins kaupverð.",
      en: "Full lifetime cost — kit, licences, operations, maintenance, and rollout — not just purchase price.",
    },
  },
  {
    abbr: "API",
    expansion: {
      is: "Application Programming Interface",
      en: "Application Programming Interface",
    },
    definition: {
      is: "Tæknilegt viðmót til að tengja kerfi (t.d. útflutning gagna til UT / PowerBI).",
      en: "Technical interface to connect systems (e.g. data export to IT / PowerBI).",
    },
  },
  {
    abbr: "RACI",
    expansion: {
      is: "Responsible, Accountable, Consulted, Informed",
      en: "Responsible, Accountable, Consulted, Informed",
    },
    definition: {
      is: "Hlutverkalykill: R framkvæmir, A ber endanlega ábyrgð, C er ráðgefandi, I er upplýstur.",
      en: "Role key: R does the work, A is ultimately answerable, C is consulted, I is informed.",
    },
  },
  {
    abbr: "UT",
    expansion: {
      is: "Upplýsingatækni",
      en: "IT (Information Technology)",
    },
    definition: {
      is: "Upplýsingatæknideild Fiskistofu — net, geymsla, aðgangur og rekstur kerfa.",
      en: "The Directorate’s IT unit — network, storage, access, and system operations.",
    },
  },
  {
    abbr: "FTE",
    expansion: {
      is: "Full-Time Equivalent (fullt stöðugildi)",
      en: "Full-Time Equivalent",
    },
    definition: {
      is: "Eitt fullt stöðugildi — hér einn sérfræðingur til tveggja ára.",
      en: "One full-time post — here one specialist for two years.",
    },
  },
  {
    abbr: "AI",
    expansion: {
      is: "Artificial Intelligence (gervigreind)",
      en: "Artificial Intelligence",
    },
    definition: {
      is: "Sjálfvirk greining (hér myndgreining) sem leggur til tegund/vigt/frávik — með manni í lykkju í learning phase.",
      en: "Automated analysis (here image recognition) proposing species/weight/anomalies — with a human in the loop in the learning phase.",
    },
  },
  {
    abbr: "PRINCE2",
    expansion: {
      is: "PRojects IN Controlled Environments",
      en: "PRojects IN Controlled Environments",
    },
    definition: {
      is: "Verkefnastjórnunaraðferð — áfangar, þolmörk, áhætta, hlutverk og stjórnunarafhurðir.",
      en: "Project management method — stages, tolerances, risk, roles, and management products.",
    },
  },
  {
    abbr: "Hafró",
    expansion: {
      is: "Hafrannsóknastofnun",
      en: "Marine and Freshwater Research Institute",
    },
    definition: {
      is: "Vísindastofnun sem getur nýtt samantektir gagna úr verkefninu.",
      en: "Science institute that may use aggregated data products from the project.",
    },
  },
]
