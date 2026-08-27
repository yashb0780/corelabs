/* ==========================================================================
   ALL DUMMY COMPANY DATA LIVES HERE. Nowhere else.
   No content strings belong in component files.

   !! PROTOTYPE DISPLAY DATA ONLY !!
   The company names, domains and logos below are real, so the table reads
   like a genuine prospect list. Everything else about them is invented for
   demonstration: the ICP fit scores, decision phases, windows, signals, ERP
   landscape verdicts, momentum counts, contacts and job postings are
   ILLUSTRATIVE, not real classifications, and not research. Contact names
   are fictional and do not refer to real people at these companies. Do not
   quote any of it as fact, and do not put it in front of a customer as
   though it were.

   TO CHANGE THE TABLE OR AN ACCOUNT PAGE: edit the `companies` array below.

   Shape of a company (see section 5 of BRIEF.md):

     id, name, domain, city, state, industry, employees, revenue, founded, hq,
     icpFitScore, phase, evidenceConfidence, segments: [],
     brief: { whatTheySell, revenueDrivers, fitNote, milestones: [] },
     signalsFired: [ { label, points } ],
     phaseNote,
     landscape: {
       verdict, state,
       stack: [ { name, layer, provenance, source } ],
       evidence: [ { source, observed, implies } ]
     },
     momentum: [ { term, counts: [n, n, n] } ],
     whyNow: { title, chip, body },
     ecosystem: [ string ],
     contacts: [ { name, title, tenure, prior, likelyChampion } ],
     jobPostings: [ { title, team, ageDays, snippet, keywords: [] } ]

   `domain` drives the logo: it is turned into a CDN image URL by
   src/lib/logo.js. If the image fails, the table falls back to the monogram
   tile drawn from `monogram` and `monogramColor`.

   A field set to null or [] renders as an honest empty state, using the copy
   in src/data/emptyStates.js. CoreWeave is the worked example.

   NOTE: Window is NOT stored here. It is computed from phase plus the
   selected archetype in src/lib/window.js.
   ========================================================================== */

/* --- Decision Phase -------------------------------------------------------
   Six phases plus one non-phase state, from section 2 of BRIEF.md.
   `tone` picks the pill colour from the tone palette in tokens.css.
   ------------------------------------------------------------------------ */
export const DECISION_PHASES = [
  {
    id: 'latent',
    label: 'Latent',
    tone: 'grey',
    description: 'ECC present, maintenance-only hiring, no program exists.',
  },
  {
    id: 'evaluating',
    label: 'Evaluating',
    tone: 'blue',
    description:
      'Architects, roadmap and business-case language, readiness checks.',
  },
  {
    // The highest-value phase, so it is the one tone that fills with the
    // accent instead of tinting. See BRIEF.md section 2.
    id: 'mobilizing',
    label: 'Mobilizing',
    tone: 'accent',
    description:
      'Program governance cluster, budget language, partner not signed.',
  },
  {
    id: 'executing',
    label: 'Executing',
    tone: 'amber',
    description: 'Module consultants, build and data roles, partner named.',
  },
  {
    id: 'landed',
    label: 'Landed',
    tone: 'green',
    description: 'S/4 live, hypercare and AMS language.',
  },
  {
    id: 're-expanding',
    label: 'Re-expanding',
    tone: 'teal',
    description: 'Parent modern, subsidiaries still legacy, wave 2 rollout.',
  },
  {
    id: 'unclassified',
    label: 'Unclassified',
    tone: 'grey',
    dashed: true,
    isPhase: false,
    description: 'Insufficient evidence. This is not a phase.',
  },
]

/** The five real steps on the timeline. Re-expanding branches off Landed. */
export const PHASE_TIMELINE = [
  'latent',
  'evaluating',
  'mobilizing',
  'executing',
  'landed',
]
export const PHASE_BRANCH = 're-expanding'

/** Falls back to Unclassified rather than guessing a phase. */
export function getPhase(id) {
  return (
    DECISION_PHASES.find((p) => p.id === id) ??
    DECISION_PHASES.find((p) => p.id === 'unclassified')
  )
}

/* --- Selling archetypes -------------------------------------------------
   The "Selling as:" dropdown. Which window each one produces is decided by
   the table in src/lib/window.js, not here.
   ---------------------------------------------------------------------- */
export const SELLING_ARCHETYPES = [
  { id: 'migration-si', label: 'Migration SI' },
  { id: 'ecc-continuity', label: 'ECC continuity' },
  { id: 'alternative-erp', label: 'Alternative ERP' },
]

export const DEFAULT_ARCHETYPE = SELLING_ARCHETYPES[0].id

/* --- Provenance ----------------------------------------------------------
   The dot in front of each stack chip. Legend is rendered once per card.
   ----------------------------------------------------------------------- */
export const PROVENANCE = {
  observed: { id: 'observed', label: 'Observed in technographic data' },
  posting: { id: 'posting', label: 'Inferred from job posting language' },
  hire: { id: 'hire', label: 'Inferred from new-hire backgrounds' },
}

/** The four layers stack chips are grouped under, in display order. */
export const STACK_LAYERS = [
  'ERP core',
  'Data and analytics',
  'Supply chain',
  'Finance and HCM',
]

/** Every monogram tile uses the accent, so it follows the token. */
const MONOGRAM = 'var(--lp-accent)'

/* ========================================================================== */

export const companies = [
  /* ------------------------------------------------------------------------
     HERO ACCOUNT. Mobilizing plus Narrowing is the account this product
     exists to find, so this one is populated in full.
     ---------------------------------------------------------------------- */
  {
    id: 'coca-cola',
    name: 'Coca-Cola',
    domain: 'coca-colacompany.com',
    monogram: 'CC',
    monogramColor: MONOGRAM,
    city: 'Atlanta',
    state: 'GA',
    hq: 'Atlanta, GA',
    industry: 'Beverages',
    employees: 70000,
    revenue: '$47.1B est.',
    founded: 1892,
    icpFitScore: 91,
    phase: 'mobilizing',
    evidenceConfidence: {
      level: 'High',
      detail:
        '4 independent signal families, 12 source records, dates present on most.',
    },
    segments: ['scm'],

    brief: {
      whatTheySell:
        'Concentrates and finished beverages sold through a global network of independent bottling partners and retail accounts.',
      revenueDrivers:
        'Concentrate volume and pricing through the bottler system, where margin turns on route-to-market efficiency and packaging cost.',
      fitNote:
        'Multiple ERP instances across the bottler estate, a transformation office standing up, and no implementation partner named anywhere. This is a partner-selection window, not a technology-evaluation window.',
      milestones: [
        'Founded 1892',
        '70,000 employees',
        '200+ markets',
        '$47.1B est. revenue',
        'FY26 10-K filed',
      ],
    },

    signalsFired: [
      { label: 'Transformation Director role posted 6 days ago', points: 22 },
      {
        label:
          'Two Global Process Owner roles open, order-to-cash and record-to-report',
        points: 18,
      },
      {
        label: 'ECC end-of-support named in FY26 10-K risk factors',
        points: 15,
      },
      { label: 'Director, ERP Program hired from a global SI', points: 13 },
      {
        label: 'S/4HANA mentions up 4x across the trailing 90 days',
        points: 11,
      },
      { label: 'New CIO appointed within the trailing 9 months', points: 8 },
      { label: 'On-premise Basis administration still referenced', points: 4 },
    ],

    phaseNote:
      'A transformation office, PMO lead and two global process owner roles all appeared within one quarter. Budget language is present but no implementation partner is named anywhere. The decision to go has been made and the partner seat is still open.',

    landscape: {
      verdict:
        'Running SAP ECC 6.0 (EHP 7) as the core with a second ERP in at least one bottling subsidiary. A migration program is forming but no target platform is locked and no partner is named. Deployment is on-premise today with no RISE or GROW commitment detected.',
      state: 'Confirmed legacy · migrating',
      stack: [
        {
          name: 'SAP ECC 6.0',
          layer: 'ERP core',
          provenance: 'observed',
          source:
            'Technographic record, licence footprint, refreshed 3 days ago',
        },
        {
          name: 'Infor M3',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, subsidiary domain scan',
        },
        {
          name: 'Snowflake',
          layer: 'Data and analytics',
          provenance: 'observed',
          source: 'Technographic record, careers page tooling disclosure',
        },
        {
          name: 'SAP SLT',
          layer: 'Data and analytics',
          provenance: 'posting',
          source: 'Named in Data Engineer posting, 18 days ago',
        },
        {
          name: 'Blue Yonder',
          layer: 'Supply chain',
          provenance: 'observed',
          source: 'Technographic record, integration partner listing',
        },
        {
          name: 'Coupa',
          layer: 'Finance and HCM',
          provenance: 'hire',
          source: 'Two procurement hires list Coupa administration experience',
        },
        {
          name: 'Workday',
          layer: 'Finance and HCM',
          provenance: 'observed',
          source: 'Technographic record, HR systems footprint',
        },
      ],
      evidence: [
        {
          source: 'Technographics',
          observed:
            'SAP ECC 6.0 and a second ERP both present. No S/4HANA licence record.',
          implies:
            'Core is still legacy. Multi-ERP estate, not a single-instance shop.',
        },
        {
          source: 'Job postings (3 recent)',
          observed:
            '"Stand up the transformation office ahead of ERP platform selection" (Transformation Director, 6 days ago). "Own the global process design for order-to-cash across both ERP instances" (Global Process Owner, 11 days ago). On-premise Basis administration referenced. No SAP GROW or RISE language.',
          implies:
            'Governance is standing up before any platform or partner is chosen.',
        },
        {
          source: 'People movement',
          observed:
            'A Director, ERP Program joined 5 months ago from a global SI. New CIO within the trailing 9 months.',
          implies:
            'SI-side practitioners moving client-side. A program is being staffed.',
        },
        {
          source: 'Public filings',
          observed:
            'SAP ECC end-of-support referenced in the FY26 10-K risk factors. No partner or spend figure disclosed.',
          implies: 'Board-visible pressure, budget not yet publicly committed.',
        },
      ],
    },

    momentum: [
      { term: 'SAP ECC', counts: [4, 6, 7] },
      { term: 'S/4HANA', counts: [3, 7, 12] },
      { term: 'go-live', counts: [1, 3, 5] },
    ],

    whyNow: {
      title: 'Program forming · partner not named',
      chip: 'Partner seat open',
      body: 'Governance roles landed this quarter and no implementation partner appears in any posting or release. Assume two to four competitors are already circling. Multi-thread immediately.',
    },

    ecosystem: [
      'Runs SAP alongside Blue Yonder. Any platform decision drags a supply chain integration workstream with it, which widens the scope of the eventual RFP.',
    ],

    contacts: [
      {
        name: 'Arun Patel',
        title: 'Director, ERP Program',
        tenure: 'Joined 5 months ago',
        prior: 'Global SI',
        likelyChampion: true,
      },
      {
        name: 'Dana Whitfield',
        title: 'VP Supply Chain Systems',
        tenure: 'Joined 4 years ago',
        prior: null,
        likelyChampion: false,
      },
      {
        name: 'Grace Lindqvist',
        title: 'Head of Finance Ops',
        tenure: 'Joined 2 years ago',
        prior: null,
        likelyChampion: false,
      },
      {
        name: 'Marcus Oyelaran',
        title: 'Chief Information Officer',
        tenure: 'Joined 9 months ago',
        prior: 'Consumer goods peer',
        likelyChampion: false,
      },
    ],

    jobPostings: [
      {
        title: 'Transformation Director',
        team: 'Corporate IT',
        ageDays: 6,
        snippet:
          'Stand up the transformation office ahead of ERP platform selection and own the readiness assessment.',
        keywords: ['transformation office', 'ERP platform selection'],
      },
      {
        title: 'Global Process Owner, Order to Cash',
        team: 'Finance',
        ageDays: 11,
        snippet:
          'Own the global process design for order-to-cash across both ERP instances.',
        keywords: ['global process design', 'both ERP instances'],
      },
      {
        title: 'SAP Basis Administrator',
        team: 'Platform Engineering',
        ageDays: 18,
        snippet:
          'Maintain on-premise Basis administration for ECC 6.0 and support SLT replication into Snowflake.',
        keywords: ['on-premise', 'ECC 6.0', 'SLT'],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    id: 'john-deere',
    name: 'John Deere',
    domain: 'deere.com',
    monogram: 'JD',
    monogramColor: MONOGRAM,
    city: 'Moline',
    state: 'IL',
    hq: 'Moline, IL',
    industry: 'Agricultural Machinery',
    employees: 83000,
    revenue: '$61.3B est.',
    founded: 1837,
    icpFitScore: 86,
    phase: 'executing',
    evidenceConfidence: {
      level: 'High',
      detail: '4 independent signal families, 9 source records, dates present.',
    },
    segments: ['multi-erp'],

    brief: {
      whatTheySell:
        'Agricultural, construction and forestry equipment, plus the precision technology and financing that go with it.',
      revenueDrivers:
        'Large equipment unit volume tied to farm income cycles, with precision ag subscriptions growing as recurring revenue.',
      fitNote:
        'Partner is already named and build roles are open at volume. The platform decision is behind them, so the opening is scope expansion rather than selection.',
      milestones: [
        'Founded 1837',
        '83,000 employees',
        'Partner named',
        '$61.3B est. revenue',
      ],
    },

    signalsFired: [
      {
        label: 'Six S/4HANA build and data roles open concurrently',
        points: 26,
      },
      { label: 'Implementation partner named in a press release', points: 21 },
      { label: 'Multiple ERP instances referenced across postings', points: 17 },
      { label: 'Cutover and data migration language present', points: 13 },
      { label: 'Programme director hired 14 months ago', points: 9 },
    ],

    phaseNote:
      'Module consultants and data migration roles are open at volume and an implementation partner is named publicly. The programme is in build.',

    landscape: {
      verdict:
        'A multi-instance ECC estate consolidating onto S/4HANA with a named partner. Migration is underway rather than being evaluated.',
      state: 'Confirmed legacy · migrating',
      stack: [
        {
          name: 'SAP ECC 6.0',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, licence footprint',
        },
        {
          name: 'SAP S/4HANA',
          layer: 'ERP core',
          provenance: 'posting',
          source: 'Named in six current build postings',
        },
        {
          name: 'Snowflake',
          layer: 'Data and analytics',
          provenance: 'observed',
          source: 'Technographic record',
        },
        {
          name: 'Kinaxis',
          layer: 'Supply chain',
          provenance: 'hire',
          source: 'Planning lead lists Kinaxis implementation experience',
        },
      ],
      evidence: [
        {
          source: 'Technographics',
          observed:
            'ECC 6.0 present. S/4HANA appears in postings but not yet in licence records.',
          implies: 'Mid-migration. The legacy estate is still live.',
        },
        {
          source: 'Job postings (6 recent)',
          observed:
            'Module consultants for FICO and MM, plus two data migration engineers. Partner named in the posting body.',
          implies: 'Build phase, staffed. Selection is closed.',
        },
      ],
    },

    momentum: [
      { term: 'S/4HANA', counts: [8, 11, 14] },
      { term: 'cutover', counts: [1, 4, 6] },
      { term: 'data migration', counts: [3, 5, 6] },
    ],

    whyNow: {
      title: 'Mid-build · scope expanding',
      chip: 'Partner named',
      body: 'The selection window has closed but a multi-instance estate means wave two is inevitable. Position for the divisions not in the current scope.',
    },

    ecosystem: [
      'Kinaxis planning sits alongside the SAP core, so any wave two rollout carries a planning integration workstream.',
    ],

    contacts: [
      {
        name: 'Priya Raman',
        title: 'Enterprise Architect',
        tenure: 'Joined 14 months ago',
        prior: 'Big four consultancy',
        likelyChampion: true,
      },
      {
        name: 'Marcus Feldt',
        title: 'Chief Information Officer',
        tenure: 'Joined 6 years ago',
        prior: null,
        likelyChampion: false,
      },
      {
        name: 'Neil Vasquez',
        title: 'Programme Director, ERP',
        tenure: 'Joined 14 months ago',
        prior: 'Global SI',
        likelyChampion: false,
      },
    ],

    jobPostings: [
      {
        title: 'SAP FICO Consultant',
        team: 'ERP Programme',
        ageDays: 4,
        snippet:
          'Configure FICO for the S/4HANA build stream ahead of the phase two cutover.',
        keywords: ['S/4HANA', 'cutover'],
      },
      {
        title: 'Data Migration Engineer',
        team: 'ERP Programme',
        ageDays: 9,
        snippet:
          'Move master data from the legacy ERP instances into the new single instance.',
        keywords: ['legacy ERP instances', 'single instance'],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    id: 'cummins',
    name: 'Cummins',
    domain: 'cummins.com',
    monogram: 'CU',
    monogramColor: MONOGRAM,
    city: 'Columbus',
    state: 'IN',
    hq: 'Columbus, IN',
    industry: 'Industrial Machinery',
    employees: 75000,
    revenue: '$34.1B est.',
    founded: 1919,
    icpFitScore: 79,
    phase: 'mobilizing',
    evidenceConfidence: {
      level: 'High',
      detail: '3 independent signal families, 8 source records, dates present.',
    },
    segments: ['multi-erp'],

    brief: {
      whatTheySell:
        'Engines, power generation systems and the aftermarket parts and service that follow them through a long asset life.',
      revenueDrivers:
        'Engine and component volume to truck and equipment makers, with aftermarket carrying the steadier margin.',
      fitNote:
        'Governance roles are landing and budget language has appeared, but no partner is named. A selection process is forming now.',
      milestones: [
        'Founded 1919',
        '75,000 employees',
        'Multi-instance estate',
        '$34.1B est. revenue',
      ],
    },

    signalsFired: [
      { label: 'ERP programme governance roles posted this quarter', points: 24 },
      { label: 'Budget approval language in two postings', points: 20 },
      { label: 'Three ERP instances referenced across divisions', points: 16 },
      { label: 'No implementation partner named anywhere', points: 12 },
      { label: 'Enterprise architect hired 7 months ago', points: 7 },
    ],

    phaseNote:
      'A programme office and two process owner roles appeared within a quarter, and budget language is present. No partner has been named, so the seat is still open.',

    landscape: {
      verdict:
        'SAP ECC 6.0 across most divisions with a separate instance from an acquisition. Consolidation is being scoped and no target platform is locked.',
      state: 'Confirmed legacy',
      stack: [
        {
          name: 'SAP ECC 6.0',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, licence footprint',
        },
        {
          name: 'Oracle EBS',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, acquired division domain',
        },
        {
          name: 'Power BI',
          layer: 'Data and analytics',
          provenance: 'observed',
          source: 'Technographic record',
        },
        {
          name: 'Coupa',
          layer: 'Finance and HCM',
          provenance: 'posting',
          source: 'Named in a procurement systems posting',
        },
      ],
      evidence: [
        {
          source: 'Job postings (4 recent)',
          observed:
            'Programme office and process owner roles, with budget approval referenced. No build or module roles.',
          implies: 'Mobilizing. Governance before selection.',
        },
        {
          source: 'Technographics',
          observed: 'ECC 6.0 and Oracle EBS both present. No S/4HANA record.',
          implies: 'Multi-ERP estate, still entirely legacy.',
        },
      ],
    },

    momentum: [
      { term: 'SAP ECC', counts: [3, 5, 6] },
      { term: 'S/4HANA', counts: [2, 5, 9] },
      { term: 'programme office', counts: [0, 2, 4] },
    ],

    whyNow: {
      title: 'Governance landed · partner not named',
      chip: 'Partner seat open',
      body: 'Budget language and programme roles arrived in the same quarter and nobody has been appointed to deliver. This is the window.',
    },

    ecosystem: [
      'Coupa in procurement means a core decision pulls a source-to-pay workstream along with it.',
    ],

    contacts: [
      {
        name: 'Helena Voss',
        title: 'Director, Enterprise Applications',
        tenure: 'Joined 7 months ago',
        prior: 'Industrial peer',
        likelyChampion: true,
      },
      {
        name: 'Raymond Cho',
        title: 'VP Information Technology',
        tenure: 'Joined 5 years ago',
        prior: null,
        likelyChampion: false,
      },
      {
        name: 'Anita Brenner',
        title: 'Global Process Owner, Finance',
        tenure: 'Joined 3 months ago',
        prior: null,
        likelyChampion: false,
      },
    ],

    jobPostings: [
      {
        title: 'ERP Programme Manager',
        team: 'Corporate IT',
        ageDays: 7,
        snippet:
          'Stand up the ERP programme office and prepare the platform business case for budget approval.',
        keywords: ['programme office', 'budget approval'],
      },
      {
        title: 'Global Process Owner, Finance',
        team: 'Finance',
        ageDays: 15,
        snippet:
          'Define target process design across three ERP instances ahead of consolidation.',
        keywords: ['three ERP instances', 'consolidation'],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    id: 'whirlpool',
    name: 'Whirlpool',
    domain: 'whirlpoolcorp.com',
    monogram: 'WH',
    monogramColor: MONOGRAM,
    city: 'Benton Harbor',
    state: 'MI',
    hq: 'Benton Harbor, MI',
    industry: 'Home Appliances',
    employees: 44000,
    revenue: '$16.6B est.',
    founded: 1911,
    icpFitScore: 74,
    phase: 'evaluating',
    evidenceConfidence: {
      level: 'Medium',
      detail: '3 independent signal families, 7 source records, some undated.',
    },
    segments: ['scm'],

    brief: {
      whatTheySell:
        'Major home appliances sold through retail channels and directly to homebuilders across several regional brands.',
      revenueDrivers:
        'Unit volume tied to housing turnover and replacement cycles, with promotional cadence and freight cost setting margin.',
      fitNote:
        'Supply chain pain is the trigger, not finance. Any ERP conversation here starts from planning and fulfilment.',
      milestones: [
        'Founded 1911',
        '44,000 employees',
        'Multiple brands',
        '$16.6B est. revenue',
      ],
    },

    signalsFired: [
      { label: 'Supply chain systems roadmap role posted', points: 25 },
      { label: 'Planning replacement study referenced in a posting', points: 20 },
      { label: 'Two enterprise architect roles naming ERP readiness', points: 16 },
      { label: 'Freight and fulfilment cost cited in earnings call', points: 13 },
    ],

    phaseNote:
      'Roadmap and architecture roles are open and a planning system study is referenced, but there is no budget language and no programme structure.',

    landscape: {
      verdict:
        'SAP ECC 6.0 as the core with a separate legacy planning system under review. No target platform named and no partner engaged.',
      state: 'Confirmed legacy',
      stack: [
        {
          name: 'SAP ECC 6.0',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, licence footprint',
        },
        {
          name: 'Blue Yonder',
          layer: 'Supply chain',
          provenance: 'observed',
          source: 'Technographic record, planning systems footprint',
        },
        {
          name: 'Databricks',
          layer: 'Data and analytics',
          provenance: 'posting',
          source: 'Named in a data platform engineer posting',
        },
        {
          name: 'Workday',
          layer: 'Finance and HCM',
          provenance: 'observed',
          source: 'Technographic record',
        },
      ],
      evidence: [
        {
          source: 'Job postings (3 recent)',
          observed:
            'Supply chain systems roadmap owner plus two architects. Study language, no build roles.',
          implies: 'Evaluating. Supply chain is holding the pen, not finance.',
        },
        {
          source: 'Technographics',
          observed: 'ECC 6.0 present. No S/4HANA record.',
          implies: 'Core is legacy and untouched.',
        },
      ],
    },

    momentum: [
      { term: 'SAP ECC', counts: [2, 3, 4] },
      { term: 'S/4HANA', counts: [0, 2, 5] },
      { term: 'roadmap', counts: [3, 4, 6] },
    ],

    whyNow: {
      title: 'Planning study open · scope undefined',
      chip: 'Supply chain led',
      body: 'A planning replacement study is live and the ERP question is riding alongside it. Whoever frames the planning scope frames the ERP scope.',
    },

    ecosystem: [
      'Blue Yonder runs planning, so a core platform decision pulls a fulfilment integration workstream with it.',
    ],

    contacts: [
      {
        name: 'Jonah Weiss',
        title: 'VP Supply Chain Systems',
        tenure: 'Joined 5 years ago',
        prior: null,
        likelyChampion: true,
      },
      {
        name: 'Camille Duarte',
        title: 'Director, Supply Chain IT',
        tenure: 'Joined 2 years ago',
        prior: null,
        likelyChampion: false,
      },
      {
        name: 'Peter Halloran',
        title: 'ERP Lead',
        tenure: 'Joined 8 years ago',
        prior: null,
        likelyChampion: false,
      },
    ],

    jobPostings: [
      {
        title: 'Director, Supply Chain Systems Roadmap',
        team: 'Supply Chain',
        ageDays: 16,
        snippet:
          'Own the multi-year roadmap for planning and fulfilment systems, including the ERP dependency.',
        keywords: ['roadmap', 'ERP dependency'],
      },
      {
        title: 'Enterprise Architect',
        team: 'Corporate IT',
        ageDays: 24,
        snippet:
          'Assess the current planning estate against target architecture options.',
        keywords: ['target architecture'],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    id: 'colgate-palmolive',
    name: 'Colgate-Palmolive',
    domain: 'colgatepalmolive.com',
    monogram: 'CP',
    monogramColor: MONOGRAM,
    city: 'New York',
    state: 'NY',
    hq: 'New York, NY',
    industry: 'Consumer Products',
    employees: 34000,
    revenue: '$20.1B est.',
    founded: 1806,
    icpFitScore: 69,
    phase: 'evaluating',
    evidenceConfidence: {
      level: 'Medium',
      detail: '3 independent signal families, 6 source records, some undated.',
    },
    segments: ['fico'],

    brief: {
      whatTheySell:
        'Oral care, personal care and home care brands, plus a pet nutrition business sold through vets and specialty retail.',
      revenueDrivers:
        'Brand pricing power in oral care and steady pet nutrition growth, with raw material cost the main margin swing.',
      fitNote:
        'Finance is driving. A business case is being written and no governance structure exists yet, so the entry point is the CFO organisation.',
      milestones: [
        'Founded 1806',
        '34,000 employees',
        'Finance led',
        '$20.1B est. revenue',
      ],
    },

    signalsFired: [
      { label: 'Finance transformation business case role posted', points: 24 },
      { label: 'Close cycle and consolidation language in postings', points: 19 },
      { label: 'ECC end-of-support named in an investor deck', points: 15 },
      { label: 'No architecture or build roles open', points: 11 },
    ],

    phaseNote:
      'A business case lead and readiness assessment language appear repeatedly. No budget has been named and no governance cluster has formed.',

    landscape: {
      verdict:
        'SAP ECC 6.0 in finance with regional instances elsewhere. Evaluation is active and finance-led, with no target platform named and no partner engaged.',
      state: 'Confirmed legacy',
      stack: [
        {
          name: 'SAP ECC 6.0',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, finance systems footprint',
        },
        {
          name: 'Snowflake',
          layer: 'Data and analytics',
          provenance: 'observed',
          source: 'Technographic record',
        },
        {
          name: 'SAP IBP',
          layer: 'Supply chain',
          provenance: 'posting',
          source: 'Named in a demand planning posting',
        },
        {
          name: 'Workday',
          layer: 'Finance and HCM',
          provenance: 'observed',
          source: 'Technographic record, HR systems footprint',
        },
      ],
      evidence: [
        {
          source: 'Job postings (4 recent)',
          observed:
            'Business case and readiness assessment language across two finance transformation roles. No implementation roles.',
          implies: 'Evaluating, not yet mobilising. Finance holds the pen.',
        },
        {
          source: 'Public filings',
          observed:
            'ECC end-of-support named as a risk in the most recent investor deck.',
          implies: 'Timeline pressure is understood at board level.',
        },
      ],
    },

    momentum: [
      { term: 'SAP ECC', counts: [3, 4, 5] },
      { term: 'S/4HANA', counts: [1, 3, 6] },
      { term: 'business case', counts: [2, 4, 5] },
    ],

    whyNow: {
      title: 'Business case forming · finance led',
      chip: 'No partner engaged',
      body: 'The business case is being written now, which is the last moment the scope can still be shaped from outside. Wait, and you inherit assumptions written by someone else.',
    },

    ecosystem: [
      'Workday already owns HCM, so the finance scope of any migration is narrower than it first appears.',
    ],

    contacts: [
      {
        name: 'Elena Marsh',
        title: 'SVP Finance Transformation',
        tenure: 'Joined 3 years ago',
        prior: null,
        likelyChampion: true,
      },
      {
        name: 'Tobias Nguyen',
        title: 'Corporate Controller',
        tenure: 'Joined 7 years ago',
        prior: null,
        likelyChampion: false,
      },
      {
        name: 'Sam Delacroix',
        title: 'Programme Manager, Finance Systems',
        tenure: 'Joined 11 months ago',
        prior: null,
        likelyChampion: false,
      },
    ],

    jobPostings: [
      {
        title: 'Manager, Finance Transformation',
        team: 'Corporate Finance',
        ageDays: 8,
        snippet:
          'Build the business case for the finance ERP roadmap and run the readiness assessment.',
        keywords: ['business case', 'readiness assessment'],
      },
      {
        title: 'Enterprise Architect',
        team: 'Corporate IT',
        ageDays: 21,
        snippet:
          'Define the target architecture for finance systems beyond ECC end-of-support.',
        keywords: ['target architecture', 'ECC end-of-support'],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    id: 'kimberly-clark',
    name: 'Kimberly-Clark',
    domain: 'kimberly-clark.com',
    monogram: 'KC',
    monogramColor: MONOGRAM,
    city: 'Irving',
    state: 'TX',
    hq: 'Irving, TX',
    industry: 'Consumer Products',
    employees: 40000,
    revenue: '$20.1B est.',
    founded: 1872,
    icpFitScore: 64,
    phase: 'evaluating',
    evidenceConfidence: {
      level: 'Medium',
      detail: '2 independent signal families, 6 source records, dates present.',
    },
    segments: ['scm'],

    brief: {
      whatTheySell:
        'Tissue, personal care and professional hygiene products sold through grocery, club and business-to-business channels.',
      revenueDrivers:
        'Volume through a small number of large retail accounts, where pulp cost and mill utilisation set the margin.',
      fitNote:
        'Network and planning redesign is the live conversation. The ERP question sits underneath it and has not surfaced on its own yet.',
      milestones: [
        'Founded 1872',
        '40,000 employees',
        'Network redesign live',
        '$20.1B est. revenue',
      ],
    },

    signalsFired: [
      { label: 'Supply network redesign programme referenced', points: 22 },
      { label: 'Two planning systems architect roles open', points: 18 },
      { label: 'ECC named alongside a planning study', points: 14 },
      { label: 'No budget or partner language present', points: 10 },
    ],

    phaseNote:
      'A network redesign is underway and planning architecture roles are open, with ERP named as a dependency rather than a programme of its own.',

    landscape: {
      verdict:
        'SAP ECC 6.0 as the core with a separate planning estate being reviewed as part of a network redesign. No platform decision taken.',
      state: 'Confirmed legacy',
      stack: [
        {
          name: 'SAP ECC 6.0',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, licence footprint',
        },
        {
          name: 'Kinaxis',
          layer: 'Supply chain',
          provenance: 'observed',
          source: 'Technographic record, planning systems footprint',
        },
        {
          name: 'Snowflake',
          layer: 'Data and analytics',
          provenance: 'posting',
          source: 'Named in a supply chain analytics posting',
        },
      ],
      evidence: [
        {
          source: 'Job postings (3 recent)',
          observed:
            'Planning systems architects and a network design lead. ERP named as a dependency.',
          implies: 'The ERP conversation is downstream of the network redesign.',
        },
        {
          source: 'Technographics',
          observed: 'ECC 6.0 present. No S/4HANA record.',
          implies: 'Legacy core, no migration signal yet.',
        },
      ],
    },

    momentum: [
      { term: 'SAP ECC', counts: [2, 3, 3] },
      { term: 'network redesign', counts: [1, 3, 5] },
      { term: 'S/4HANA', counts: [0, 1, 3] },
    ],

    whyNow: {
      title: 'Network redesign live · ERP downstream',
      chip: 'Dependency, not programme',
      body: 'The network programme will force the ERP question within a year. Get in on the planning workstream before the ERP scope is written by someone else.',
    },

    ecosystem: [
      'Kinaxis is embedded in planning, which will shape the integration scope of any core decision.',
    ],

    contacts: [
      {
        name: 'Rosalind Fyfe',
        title: 'VP Supply Chain Strategy',
        tenure: 'Joined 4 years ago',
        prior: null,
        likelyChampion: true,
      },
      {
        name: 'Owen Castellanos',
        title: 'Director, Planning Systems',
        tenure: 'Joined 18 months ago',
        prior: null,
        likelyChampion: false,
      },
    ],

    jobPostings: [
      {
        title: 'Planning Systems Architect',
        team: 'Supply Chain',
        ageDays: 12,
        snippet:
          'Design the target planning architecture for the network redesign, including the ERP dependency.',
        keywords: ['network redesign', 'ERP dependency'],
      },
      {
        title: 'Supply Chain Analytics Lead',
        team: 'Supply Chain',
        ageDays: 29,
        snippet: 'Build reporting on the Snowflake platform against ECC data.',
        keywords: ['Snowflake', 'ECC'],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    id: 'emerson-electric',
    name: 'Emerson Electric',
    domain: 'emerson.com',
    monogram: 'EE',
    monogramColor: MONOGRAM,
    city: 'St. Louis',
    state: 'MO',
    hq: 'St. Louis, MO',
    industry: 'Industrial Automation',
    employees: 67000,
    revenue: '$17.5B est.',
    founded: 1890,
    icpFitScore: 58,
    phase: 're-expanding',
    evidenceConfidence: {
      level: 'Medium',
      detail: '3 independent signal families, 6 source records, dates present.',
    },
    segments: ['greenfield'],

    brief: {
      whatTheySell:
        'Automation hardware, control software and measurement instruments for process and discrete manufacturing.',
      revenueDrivers:
        'Project-driven automation spend plus a growing software base that smooths the capital cycle.',
      fitNote:
        'The parent is already on S/4. Acquired businesses are still on legacy, and wave two scoping language has started appearing.',
      milestones: [
        'Founded 1890',
        '67,000 employees',
        'S/4 live at parent',
        '$17.5B est. revenue',
      ],
    },

    signalsFired: [
      { label: 'Wave two rollout language in two postings', points: 21 },
      {
        label: 'Acquired businesses still on legacy ERP after parent go-live',
        points: 16,
      },
      { label: 'Template rollout lead role open', points: 13 },
      { label: 'AMS contract renewal referenced', points: 8 },
    ],

    phaseNote:
      'The parent went live on S/4 and is in steady state. Several acquired businesses remain on legacy systems and template rollout roles have started appearing.',

    landscape: {
      verdict:
        'S/4HANA live at the parent, with acquired businesses still on legacy Oracle. A wave two rollout is being scoped but not yet staffed.',
      state: 'Confirmed modern',
      stack: [
        {
          name: 'SAP S/4HANA',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, licence footprint',
        },
        {
          name: 'Oracle EBS',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, acquired business domain scan',
        },
        {
          name: 'SAP BW/4HANA',
          layer: 'Data and analytics',
          provenance: 'posting',
          source: 'Named in a reporting analyst posting',
        },
        {
          name: 'SAP Ariba',
          layer: 'Finance and HCM',
          provenance: 'hire',
          source: 'Procurement lead lists Ariba rollout experience',
        },
      ],
      evidence: [
        {
          source: 'Technographics',
          observed:
            'S/4HANA licence at the parent. Oracle EBS still present on acquired business domains.',
          implies: 'Modern core, unfinished estate. Wave two is real.',
        },
        {
          source: 'Job postings (2 recent)',
          observed:
            'Template rollout lead and a divisional finance systems analyst, both referencing wave two.',
          implies: 'Scoping has started. Staffing has not.',
        },
      ],
    },

    momentum: [
      { term: 'wave two', counts: [0, 2, 4] },
      { term: 'template rollout', counts: [1, 2, 4] },
      { term: 'S/4HANA', counts: [4, 5, 6] },
    ],

    whyNow: {
      title: 'Wave two scoping · acquisitions on legacy',
      chip: 'Rollout not staffed',
      body: 'The parent has a template and the acquired businesses have a deadline. Rollout work is being scoped right now and nobody has been appointed to run it.',
    },

    ecosystem: [
      'Ariba is already in place at the parent, so divisional procurement is likely in scope for the same wave.',
    ],

    contacts: [
      {
        name: 'Holly Vance',
        title: 'Head of Digital Core',
        tenure: 'Joined 4 years ago',
        prior: null,
        likelyChampion: true,
      },
      {
        name: 'Idris Bello',
        title: 'Solution Architect',
        tenure: 'Joined 2 years ago',
        prior: 'Global SI',
        likelyChampion: false,
      },
    ],

    jobPostings: [
      {
        title: 'Template Rollout Lead',
        team: 'Digital Core',
        ageDays: 13,
        snippet:
          'Take the parent S/4 template into the acquired businesses as part of wave two.',
        keywords: ['S/4 template', 'wave two'],
      },
      {
        title: 'Finance Systems Analyst',
        team: 'Divisional Finance',
        ageDays: 27,
        snippet:
          'Support Oracle EBS while planning the transition to the group platform.',
        keywords: ['Oracle EBS', 'group platform'],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    id: 'sherwin-williams',
    name: 'Sherwin-Williams',
    domain: 'sherwin-williams.com',
    monogram: 'SW',
    monogramColor: MONOGRAM,
    city: 'Cleveland',
    state: 'OH',
    hq: 'Cleveland, OH',
    industry: 'Chemicals & Coatings',
    employees: 64000,
    revenue: '$23.1B est.',
    founded: 1866,
    icpFitScore: 52,
    phase: 'landed',
    evidenceConfidence: {
      level: 'Medium',
      detail: '2 independent signal families, 5 source records, dates present.',
    },
    segments: ['greenfield'],

    brief: {
      whatTheySell:
        'Architectural and industrial coatings sold through company-owned stores, big box retail and direct industrial channels.',
      revenueDrivers:
        'Store network throughput and pro painter loyalty, with raw material cost the main margin pressure.',
      fitNote:
        'Went live on S/4 last year. Hypercare has ended and the conversation now is support model, not migration.',
      milestones: [
        'Founded 1866',
        '64,000 employees',
        'S/4 live 14 months',
        '$23.1B est. revenue',
      ],
    },

    signalsFired: [
      { label: 'S/4HANA licence confirmed, greenfield build', points: 19 },
      { label: 'Hypercare and AMS language across postings', points: 15 },
      { label: 'Application support lead role open', points: 11 },
      { label: 'No further migration roles posted since go-live', points: 7 },
    ],

    phaseNote:
      'S/4 has been live for over a year. Postings reference hypercare exit and application managed services rather than build work.',

    landscape: {
      verdict:
        'S/4HANA live on a greenfield build. The legacy estate has been retired. Current activity is support model rather than platform change.',
      state: 'Confirmed modern',
      stack: [
        {
          name: 'SAP S/4HANA',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, licence footprint',
        },
        {
          name: 'SAP Analytics Cloud',
          layer: 'Data and analytics',
          provenance: 'observed',
          source: 'Technographic record',
        },
        {
          name: 'SAP IBP',
          layer: 'Supply chain',
          provenance: 'posting',
          source: 'Named in a planning analyst posting',
        },
        {
          name: 'SuccessFactors',
          layer: 'Finance and HCM',
          provenance: 'hire',
          source: 'HR systems lead lists SuccessFactors experience',
        },
      ],
      evidence: [
        {
          source: 'Technographics',
          observed: 'S/4HANA licence present. No ECC record remaining.',
          implies: 'Greenfield complete, legacy retired.',
        },
        {
          source: 'Job postings (2 recent)',
          observed:
            'Application support lead and a planning analyst. Hypercare exit referenced.',
          implies: 'Steady state. The build is done.',
        },
      ],
    },

    momentum: [
      { term: 'S/4HANA', counts: [6, 5, 4] },
      { term: 'hypercare', counts: [3, 2, 1] },
      { term: 'AMS', counts: [1, 2, 3] },
    ],

    whyNow: {
      title: 'Post go-live · support model forming',
      chip: 'AMS opening',
      body: 'The migration window has closed but the support model is being decided now. That is the only door open here for the next two years.',
    },

    ecosystem: [
      'A full SAP estate including IBP and SuccessFactors, so any managed service scope is broader than the core alone.',
    ],

    contacts: [
      {
        name: 'Theodore Kwan',
        title: 'IT Director',
        tenure: 'Joined 6 years ago',
        prior: null,
        likelyChampion: true,
      },
      {
        name: 'Marisol Reyes',
        title: 'Application Support Lead',
        tenure: 'Joined 10 months ago',
        prior: 'Global SI',
        likelyChampion: false,
      },
    ],

    jobPostings: [
      {
        title: 'Application Support Lead, SAP',
        team: 'Corporate IT',
        ageDays: 19,
        snippet:
          'Own the S/4HANA support model following hypercare exit and manage the AMS relationship.',
        keywords: ['hypercare exit', 'AMS'],
      },
      {
        title: 'Supply Planning Analyst',
        team: 'Operations',
        ageDays: 35,
        snippet: 'Run demand and supply planning in SAP IBP.',
        keywords: ['SAP IBP'],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    id: 'stanley-black-decker',
    name: 'Stanley Black & Decker',
    domain: 'stanleyblackanddecker.com',
    monogram: 'SB',
    monogramColor: MONOGRAM,
    city: 'New Britain',
    state: 'CT',
    hq: 'New Britain, CT',
    industry: 'Tools & Hardware',
    employees: 48000,
    revenue: '$15.4B est.',
    founded: 1843,
    icpFitScore: 46,
    phase: 'latent',
    evidenceConfidence: {
      level: 'Low',
      detail: '2 independent signal families, 4 source records, mostly undated.',
    },
    segments: ['multi-erp'],

    brief: {
      whatTheySell:
        'Power tools, hand tools and outdoor equipment across several brands sold through big box retail and industrial distribution.',
      revenueDrivers:
        'Tool volume tied to construction and DIY demand, with brand portfolio breadth cushioning single-channel swings.',
      fitNote:
        'A multi-ERP estate from acquisitions, but every open role is maintenance. Nothing indicates a programme forming.',
      milestones: [
        'Founded 1843',
        '48,000 employees',
        'Multi-ERP estate',
        '$15.4B est. revenue',
      ],
    },

    signalsFired: [
      { label: 'Several ERP instances confirmed across brands', points: 17 },
      { label: 'Basis and ABAP maintenance roles only', points: 13 },
      { label: 'No roadmap or architecture language in postings', points: 10 },
      { label: 'IT headcount flat across four quarters', points: 6 },
    ],

    phaseNote:
      'The estate is fragmented from years of acquisitions, but hiring is maintenance only. There is no programme, study or budget cycle in evidence.',

    landscape: {
      verdict:
        'Several ERP instances across acquired brands, ECC among them. Fragmented but stable, with no consolidation signal detected.',
      state: 'Confirmed legacy',
      stack: [
        {
          name: 'SAP ECC 6.0',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, licence footprint',
        },
        {
          name: 'Infor CloudSuite',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, acquired brand domain',
        },
        {
          name: 'Power BI',
          layer: 'Data and analytics',
          provenance: 'posting',
          source: 'Named in an operations analyst posting',
        },
      ],
      evidence: [
        {
          source: 'Technographics',
          observed:
            'ECC 6.0 and a second ERP both present. No S/4HANA record.',
          implies: 'Fragmented legacy estate, no movement.',
        },
        {
          source: 'Job postings (2 recent)',
          observed: 'ABAP developer and a Basis administrator, both maintenance scoped.',
          implies: 'Keeping the lights on. No programme exists.',
        },
      ],
    },

    momentum: [
      { term: 'SAP ECC', counts: [2, 2, 2] },
      { term: 'S/4HANA', counts: [0, 0, 1] },
      { term: 'consolidation', counts: [1, 1, 1] },
    ],

    whyNow: {
      title: 'No programme · maintenance only',
      chip: 'Nurture',
      body: 'A fragmented estate makes this a strong future fit, but nothing is moving today. Watch for an architecture or programme posting as the first real signal.',
    },

    ecosystem: [
      'A second ERP across acquired brands will make any future consolidation larger in scope than the SAP footprint suggests.',
    ],

    contacts: [
      {
        name: 'Winona Pearce',
        title: 'Director of IT',
        tenure: 'Joined 9 years ago',
        prior: null,
        likelyChampion: true,
      },
      {
        name: 'Felix Adeyemi',
        title: 'Applications Manager',
        tenure: 'Joined 3 years ago',
        prior: null,
        likelyChampion: false,
      },
    ],

    jobPostings: [
      {
        title: 'SAP ABAP Developer',
        team: 'Corporate IT',
        ageDays: 31,
        snippet:
          'Maintain custom ABAP objects in the ECC 6.0 environment and support month-end.',
        keywords: ['ECC 6.0', 'Maintain'],
      },
      {
        title: 'SAP Basis Administrator',
        team: 'Corporate IT',
        ageDays: 44,
        snippet:
          'Day-to-day Basis administration and patching for the on-premise landscape.',
        keywords: ['on-premise', 'patching'],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    id: 'ball-corporation',
    name: 'Ball Corporation',
    domain: 'ball.com',
    monogram: 'BA',
    monogramColor: MONOGRAM,
    city: 'Westminster',
    state: 'CO',
    hq: 'Westminster, CO',
    industry: 'Packaging',
    employees: 16000,
    revenue: '$11.8B est.',
    founded: 1880,
    icpFitScore: 39,
    phase: 'latent',
    evidenceConfidence: {
      level: 'Low',
      detail: '2 independent signal families, 4 source records, mostly undated.',
    },
    segments: ['fico'],

    brief: {
      whatTheySell:
        'Aluminium beverage cans and packaging for beverage, personal care and household producers.',
      revenueDrivers:
        'Can volume under long-term contracts, with aluminium cost passed through and plant utilisation setting the real margin.',
      fitNote:
        'ECC runs finance and plant operations and is stable. Hiring is maintenance only, so there is no programme to join yet.',
      milestones: [
        'Founded 1880',
        '16,000 employees',
        'Maintenance hiring',
        '$11.8B est. revenue',
      ],
    },

    signalsFired: [
      { label: 'ECC 6.0 confirmed in technographic data', points: 15 },
      { label: 'Finance close and reporting roles only', points: 12 },
      { label: 'No architecture or roadmap postings', points: 8 },
      { label: 'IT headcount flat across four quarters', points: 4 },
    ],

    phaseNote:
      'ECC is present and supported, and every open role is finance operations. Nothing indicates a programme, a study or a budget cycle.',

    landscape: {
      verdict:
        'SAP ECC 6.0 running finance and plant operations. No migration signal of any kind detected.',
      state: 'Confirmed legacy',
      stack: [
        {
          name: 'SAP ECC 6.0',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, licence footprint',
        },
        {
          name: 'Tableau',
          layer: 'Data and analytics',
          provenance: 'posting',
          source: 'Named in a finance analyst posting',
        },
        {
          name: 'Oracle Hyperion',
          layer: 'Finance and HCM',
          provenance: 'posting',
          source: 'Named in a consolidation posting',
        },
      ],
      evidence: [
        {
          source: 'Technographics',
          observed: 'ECC 6.0 present. No S/4HANA record, no cloud ERP record.',
          implies: 'Legacy core, no movement.',
        },
        {
          source: 'Job postings (2 recent)',
          observed: 'Financial reporting manager and a close analyst.',
          implies: 'Business as usual. No programme.',
        },
      ],
    },

    momentum: [
      { term: 'SAP ECC', counts: [1, 2, 2] },
      { term: 'S/4HANA', counts: [0, 0, 1] },
      { term: 'close cycle', counts: [2, 2, 3] },
    ],

    whyNow: {
      title: 'No programme · finance footprint only',
      chip: 'Nurture',
      body: 'Nothing is moving today. Watch for a finance systems architecture posting as the first real signal.',
    },

    ecosystem: [
      'Hyperion still handles consolidation, which would be the first thing to surface if finance revisits the platform.',
    ],

    contacts: [
      {
        name: 'Odessa Grant',
        title: 'Head of Finance Systems',
        tenure: 'Joined 11 years ago',
        prior: null,
        likelyChampion: true,
      },
      {
        name: 'Bram Sutherland',
        title: 'Senior Manager, Reporting',
        tenure: 'Joined 4 years ago',
        prior: null,
        likelyChampion: false,
      },
    ],

    jobPostings: [
      {
        title: 'Financial Reporting Manager',
        team: 'Corporate Finance',
        ageDays: 22,
        snippet:
          'Own statutory reporting and the monthly close in SAP and Hyperion.',
        keywords: ['SAP', 'Hyperion'],
      },
      {
        title: 'Close Analyst',
        team: 'Corporate Finance',
        ageDays: 48,
        snippet: 'Support the month-end close cycle across entities.',
        keywords: ['close cycle'],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    id: 'dover-corporation',
    name: 'Dover Corporation',
    domain: 'dovercorp.com',
    monogram: 'DC',
    monogramColor: MONOGRAM,
    city: 'Downers Grove',
    state: 'IL',
    hq: 'Downers Grove, IL',
    industry: 'Industrial Manufacturing',
    employees: 24000,
    revenue: '$8.7B est.',
    founded: 1955,
    icpFitScore: 31,
    phase: 'latent',
    evidenceConfidence: {
      level: 'Low',
      detail: '2 independent signal families, 3 source records, mostly undated.',
    },
    segments: ['greenfield'],

    brief: {
      whatTheySell:
        'A portfolio of industrial businesses spanning pumps, refrigeration systems, marking equipment and fluid handling.',
      revenueDrivers:
        'Aftermarket parts and service across a decentralised portfolio, where each operating company runs largely on its own.',
      fitNote:
        'Highly decentralised, so there is no single ERP decision to sell into. Any entry has to be at an operating company level.',
      milestones: [
        'Founded 1955',
        '24,000 employees',
        'Decentralised portfolio',
        '$8.7B est. revenue',
      ],
    },

    signalsFired: [
      { label: 'ERP instances differ by operating company', points: 12 },
      { label: 'Divisional maintenance roles only', points: 9 },
      { label: 'No group-level architecture postings', points: 6 },
      { label: 'No filing references to systems risk', points: 4 },
    ],

    phaseNote:
      'Each operating company runs its own systems and hires for maintenance. There is no group programme and no evidence of one forming.',

    landscape: {
      verdict:
        'No single ERP system of record at group level. Instances differ by operating company, with ECC present in some. No consolidation signal.',
      state: 'Confirmed legacy',
      stack: [
        {
          name: 'SAP ECC 6.0',
          layer: 'ERP core',
          provenance: 'posting',
          source: 'Named in a divisional finance posting',
        },
        {
          name: 'Epicor',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, operating company domain',
        },
      ],
      evidence: [
        {
          source: 'Technographics',
          observed:
            'Different ERP products across operating company domains. No group standard.',
          implies: 'Decentralised. No single decision maker for a platform.',
        },
        {
          source: 'Job postings (2 recent)',
          observed: 'Divisional finance and applications roles, maintenance scoped.',
          implies: 'No group programme. Sell at the operating company.',
        },
      ],
    },

    momentum: [
      { term: 'SAP ECC', counts: [1, 1, 1] },
      { term: 'S/4HANA', counts: [0, 0, 0] },
      { term: 'consolidation', counts: [0, 1, 1] },
    ],

    whyNow: {
      title: 'Decentralised · no group decision',
      chip: 'Nurture',
      body: 'There is no group platform decision to win. If this account matters, pick one operating company and work it on its own merits.',
    },

    ecosystem: [
      'A mixed ERP estate across operating companies means no shared integration surface to anchor a group pitch.',
    ],

    contacts: [
      {
        name: 'Gwen Amherst',
        title: 'Divisional IT Manager',
        tenure: 'Joined 5 years ago',
        prior: null,
        likelyChampion: true,
      },
    ],

    jobPostings: [
      {
        title: 'Divisional Finance Systems Analyst',
        team: 'Operating Company Finance',
        ageDays: 38,
        snippet: 'Support SAP ECC for a single operating company finance team.',
        keywords: ['SAP ECC'],
      },
      {
        title: 'Applications Support Analyst',
        team: 'Divisional IT',
        ageDays: 52,
        snippet: 'Maintain divisional ERP and reporting tools.',
        keywords: ['divisional ERP'],
      },
    ],
  },

  /* ------------------------------------------------------------------------
     DELIBERATELY THIN. Phase Unclassified: the evidence was not there, so
     the page degrades into honest empty states rather than inventing
     content. This is intentional, not a bug. A cloud-native company founded
     in 2017 genuinely has no SAP ECC estate to find, which makes it the
     right example.
     ---------------------------------------------------------------------- */
  {
    id: 'coreweave',
    name: 'CoreWeave',
    domain: 'coreweave.com',
    monogram: 'CW',
    monogramColor: MONOGRAM,
    city: 'Livingston',
    state: 'NJ',
    hq: 'Livingston, NJ',
    industry: 'Cloud Infrastructure',
    employees: 1000,
    revenue: null,
    founded: null,
    icpFitScore: 18,
    phase: 'unclassified',
    evidenceConfidence: {
      level: 'Low',
      detail:
        '1 signal family, 2 source records, no dates. Not enough to classify.',
    },
    segments: ['greenfield'],

    brief: {
      whatTheySell: null,
      revenueDrivers: null,
      fitNote: null,
      milestones: [],
    },

    signalsFired: [
      { label: 'Generic finance systems language in two postings', points: 11 },
      { label: 'ERP referenced without naming a vendor', points: 7 },
    ],

    phaseNote: null,

    landscape: {
      verdict: null,
      state: 'Unknown',
      stack: [],
      evidence: [],
    },

    momentum: [],

    whyNow: null,

    ecosystem: [],

    contacts: [],

    jobPostings: [],
  },
]

export function getCompany(id) {
  return companies.find((c) => c.id === id)
}

/** 14200 -> "14,200" */
export function formatEmployees(n) {
  return n.toLocaleString('en-US')
}
