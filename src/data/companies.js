/* ==========================================================================
   ALL DUMMY COMPANY DATA LIVES HERE. Nowhere else.
   No content strings belong in component files.

   TO CHANGE THE TABLE OR AN ACCOUNT PAGE: edit the `companies` array below.

   Shape of a company (see section 5 of BRIEF.md):

     id, name, logo, city, state, industry, employees, revenue, founded, hq,
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

   `monogram` and `monogramColor` are extra: they draw the fallback tile in
   the leads table when a logo SVG is missing.

   A field set to null or [] renders as an honest empty state, using the copy
   in src/data/emptyStates.js. Cirrus Software is the worked example.

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
    id: 'mobilizing',
    label: 'Mobilizing',
    tone: 'violet',
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

/* ========================================================================== */

export const companies = [
  /* ------------------------------------------------------------------------
     HERO ACCOUNT. Mobilizing plus Narrowing is the account this product
     exists to find, so this one is populated in full.
     ---------------------------------------------------------------------- */
  {
    id: 'meridian-foods',
    name: 'Meridian Foods',
    logo: '/logos/meridian-foods.svg',
    monogram: 'MF',
    monogramColor: 'var(--lp-accent)',
    city: 'Columbus',
    state: 'OH',
    hq: 'Columbus, OH',
    industry: 'Food & Beverage',
    employees: 14200,
    revenue: '$4.2B est.',
    founded: 1978,
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
        'Chilled ready meals and branded dairy, made in house and sold through national grocery retailers across the Midwest and Southeast.',
      revenueDrivers:
        'Volume contracts with a small number of grocery chains, where margin turns on plant utilisation and on-time-in-full delivery performance.',
      fitNote:
        'Two ERP instances, a transformation office standing up, and no implementation partner named anywhere. This is a partner-selection window, not a technology-evaluation window.',
      milestones: [
        'Founded 1978',
        '14,200 employees',
        '9 plants',
        '$4.2B est. revenue',
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
      { label: 'Director, ERP Program hired from Capgemini', points: 13 },
      { label: 'S/4HANA mentions up 4x across the trailing 90 days', points: 11 },
      { label: 'New CIO appointed within the trailing 9 months', points: 8 },
      { label: 'On-premise Basis administration still referenced', points: 4 },
    ],

    phaseNote:
      'A transformation office, PMO lead and two global process owner roles all appeared within one quarter. Budget language is present but no implementation partner is named anywhere. The decision to go has been made and the partner seat is still open.',

    landscape: {
      verdict:
        'Running SAP ECC 6.0 (EHP 7) as the core with Infor M3 in at least one subsidiary. A migration program is forming but no target platform is locked and no partner is named. Deployment is on-premise today with no RISE or GROW commitment detected.',
      state: 'Confirmed legacy · migrating',
      stack: [
        {
          name: 'SAP ECC 6.0',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, licence footprint, refreshed 3 days ago',
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
            'SAP ECC 6.0 and Infor M3 both present. No S/4HANA licence record.',
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
            'Arun Patel joined 5 months ago as Director, ERP Program, prior Capgemini. New CIO within the trailing 9 months.',
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
        prior: 'Capgemini',
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
        prior: 'Kellanova',
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
    id: 'calder-industrial',
    name: 'Calder Industrial',
    logo: '/logos/calder-industrial.svg',
    monogram: 'CI',
    monogramColor: '#14764a',
    city: 'Milwaukee',
    state: 'WI',
    hq: 'Milwaukee, WI',
    industry: 'Industrial Manufacturing',
    employees: 9800,
    revenue: '$2.8B est.',
    founded: 1954,
    icpFitScore: 82,
    phase: 'executing',
    evidenceConfidence: {
      level: 'High',
      detail: '4 independent signal families, 9 source records, dates present.',
    },
    segments: ['multi-erp'],

    brief: {
      whatTheySell:
        'Hydraulic components and powertrain assemblies sold to agricultural and construction equipment manufacturers.',
      revenueDrivers:
        'Long-run OEM supply agreements, with aftermarket parts carrying the higher margin.',
      fitNote:
        'Partner is already named and build roles are open. The platform decision is behind them, so the opening here is scope expansion rather than selection.',
      milestones: [
        'Founded 1954',
        '9,800 employees',
        '6 plants',
        '$2.8B est. revenue',
      ],
    },

    signalsFired: [
      { label: 'Five S/4HANA build and data roles open concurrently', points: 24 },
      { label: 'Implementation partner named in a press release', points: 20 },
      { label: 'Four ERP instances referenced across postings', points: 18 },
      { label: 'Cutover and data migration language present', points: 12 },
      { label: 'Programme director hired 14 months ago', points: 8 },
    ],

    phaseNote:
      'Module consultants and data migration roles are open at volume and an implementation partner is named publicly. The programme is in build.',

    landscape: {
      verdict:
        'Four ERP instances from three decades of acquisitions, consolidating onto S/4HANA with a named partner. Migration is underway rather than being evaluated.',
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
          source: 'Named in five current build postings',
        },
        {
          name: 'Epicor',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, acquired subsidiary domain',
        },
        {
          name: 'Power BI',
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
            'ECC 6.0 and Epicor both present. S/4HANA appears in postings but not yet in licence records.',
          implies: 'Mid-migration. The legacy estate is still live.',
        },
        {
          source: 'Job postings (5 recent)',
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
      body: 'The selection window has closed but four instances means wave two is inevitable. Position for the subsidiaries not in the current scope.',
    },

    ecosystem: [
      'Kinaxis planning sits alongside the SAP core, so any wave two rollout carries a planning integration workstream.',
    ],

    contacts: [
      {
        name: 'Marcus Feldt',
        title: 'Chief Information Officer',
        tenure: 'Joined 6 years ago',
        prior: null,
        likelyChampion: false,
      },
      {
        name: 'Priya Raman',
        title: 'Enterprise Architect',
        tenure: 'Joined 14 months ago',
        prior: 'Deloitte',
        likelyChampion: true,
      },
      {
        name: 'Neil Vasquez',
        title: 'Programme Director, ERP',
        tenure: 'Joined 14 months ago',
        prior: 'Accenture',
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
          'Move master data from four legacy ERP instances into the new single instance.',
        keywords: ['four legacy ERP instances', 'single instance'],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    id: 'aventine-health',
    name: 'Aventine Health',
    logo: '/logos/aventine-health.svg',
    monogram: 'AH',
    monogramColor: '#1361c0',
    city: 'Nashville',
    state: 'TN',
    hq: 'Nashville, TN',
    industry: 'Healthcare',
    employees: 22500,
    revenue: '$6.1B est.',
    founded: 1991,
    icpFitScore: 74,
    phase: 'evaluating',
    evidenceConfidence: {
      level: 'Medium',
      detail: '3 independent signal families, 7 source records, some undated.',
    },
    segments: ['fico'],

    brief: {
      whatTheySell:
        'Operates 34 acute care hospitals and a network of outpatient surgical centres across the Southeast.',
      revenueDrivers:
        'Payer mix and procedure volume, with cost per case the lever finance watches most closely.',
      fitNote:
        'Finance is driving, not IT. A business case is being built and no governance structure exists yet, so the entry point is the CFO organisation.',
      milestones: [
        'Founded 1991',
        '22,500 employees',
        '34 hospitals',
        '$6.1B est. revenue',
      ],
    },

    signalsFired: [
      { label: 'Finance transformation business case role posted', points: 26 },
      { label: 'Two enterprise architect roles naming ERP readiness', points: 20 },
      { label: 'ECC end-of-support named in an investor deck', points: 16 },
      { label: 'Consolidation and close cycle language in postings', points: 12 },
    ],

    phaseNote:
      'Architects and a business case lead are in market, and readiness assessment language appears repeatedly. No budget has been named and no governance cluster has formed.',

    landscape: {
      verdict:
        'SAP ECC 6.0 in finance with a separate clinical estate that will not move. Evaluation is active and finance-led, with no target platform named and no partner engaged.',
      state: 'Confirmed legacy',
      stack: [
        {
          name: 'SAP ECC 6.0',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, finance systems footprint',
        },
        {
          name: 'Infor CloudSuite',
          layer: 'ERP core',
          provenance: 'posting',
          source: 'Referenced in a supply chain analyst posting',
        },
        {
          name: 'Snowflake',
          layer: 'Data and analytics',
          provenance: 'observed',
          source: 'Technographic record',
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
            'Business case and readiness assessment language across two finance transformation roles. No implementation or build roles.',
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
        name: 'Rachel Okafor',
        title: 'Director, Applications',
        tenure: 'Joined 18 months ago',
        prior: 'Cerner',
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
    id: 'ridgeline-energy',
    name: 'Ridgeline Energy',
    logo: '/logos/ridgeline-energy.svg',
    monogram: 'RE',
    monogramColor: '#8a6300',
    city: 'Denver',
    state: 'CO',
    hq: 'Denver, CO',
    industry: 'Utilities',
    employees: 6400,
    revenue: '$1.9B est.',
    founded: 1966,
    icpFitScore: 66,
    phase: 're-expanding',
    evidenceConfidence: {
      level: 'Medium',
      detail: '3 independent signal families, 6 source records, dates present.',
    },
    segments: ['greenfield'],

    brief: {
      whatTheySell:
        'Regulated electricity distribution across Colorado and Wyoming, plus a growing utility-scale renewables arm.',
      revenueDrivers:
        'Rate-base growth on the regulated side, with the renewables arm funded separately and growing faster.',
      fitNote:
        'The parent is already on S/4. Two acquired subsidiaries are still on legacy, and wave two scoping language has started appearing.',
      milestones: [
        'Founded 1966',
        '6,400 employees',
        'S/4 live at parent since 2023',
        '$1.9B est. revenue',
      ],
    },

    signalsFired: [
      { label: 'Wave two rollout language in two postings', points: 22 },
      { label: 'Subsidiaries still on legacy ERP after parent go-live', points: 18 },
      { label: 'Template rollout lead role open', points: 14 },
      { label: 'AMS contract renewal referenced', points: 12 },
    ],

    phaseNote:
      'The parent went live on S/4 in 2023 and is in steady state. Two acquired subsidiaries remain on legacy systems and template rollout roles have started appearing.',

    landscape: {
      verdict:
        'S/4HANA live at the parent since 2023, with two acquired subsidiaries still on legacy Oracle. A wave two rollout is being scoped but not yet staffed.',
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
          source: 'Technographic record, subsidiary domain scan',
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
            'S/4HANA licence at the parent. Oracle EBS still present on two subsidiary domains.',
          implies: 'Modern core, unfinished estate. Wave two is real.',
        },
        {
          source: 'Job postings (2 recent)',
          observed:
            'Template rollout lead and a subsidiary finance systems analyst, both referencing wave two.',
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
      title: 'Wave two scoping · subsidiaries on legacy',
      chip: 'Rollout not staffed',
      body: 'The parent has a template and the subsidiaries have a deadline. Rollout work is being scoped right now and nobody has been appointed to run it.',
    },

    ecosystem: [
      'Ariba is already in place at the parent, so subsidiary procurement is likely in scope for the same wave.',
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
        prior: 'IBM',
        likelyChampion: false,
      },
    ],

    jobPostings: [
      {
        title: 'Template Rollout Lead',
        team: 'Digital Core',
        ageDays: 13,
        snippet:
          'Take the parent S/4 template into the acquired subsidiaries as part of wave two.',
        keywords: ['S/4 template', 'wave two'],
      },
      {
        title: 'Finance Systems Analyst',
        team: 'Subsidiary Finance',
        ageDays: 27,
        snippet:
          'Support Oracle EBS while planning the transition to the group platform.',
        keywords: ['Oracle EBS', 'group platform'],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    id: 'halcyon-retail',
    name: 'Halcyon Retail Group',
    logo: '/logos/halcyon-retail.svg',
    monogram: 'HR',
    monogramColor: '#bc3229',
    city: 'Atlanta',
    state: 'GA',
    hq: 'Atlanta, GA',
    industry: 'Retail',
    employees: 31000,
    revenue: '$7.4B est.',
    founded: 1962,
    icpFitScore: 61,
    phase: 'evaluating',
    evidenceConfidence: {
      level: 'Medium',
      detail: '3 independent signal families, 6 source records, some undated.',
    },
    segments: ['scm'],

    brief: {
      whatTheySell:
        'Operates 410 department and home goods stores, with a direct-to-consumer channel that now carries a quarter of revenue.',
      revenueDrivers:
        'Store footfall and basket size, with online fulfilment cost the pressure point as the channel mix shifts.',
      fitNote:
        'Merchandising systems are the trigger rather than finance. Any ERP conversation here starts from supply chain pain.',
      milestones: [
        'Founded 1962',
        '31,000 employees',
        '410 stores',
        '$7.4B est. revenue',
      ],
    },

    signalsFired: [
      { label: 'Merchandising systems roadmap role posted', points: 21 },
      { label: 'ECC named alongside a planning replacement study', points: 17 },
      { label: 'Two supply chain IT architect roles open', points: 13 },
      { label: 'Omnichannel fulfilment cost cited in earnings call', points: 10 },
    ],

    phaseNote:
      'Roadmap and architecture roles are open and a planning system study is referenced, but there is no budget language and no programme structure.',

    landscape: {
      verdict:
        'SAP ECC 6.0 as the merchandising and finance core, with a separate legacy planning system under review. No target platform named and no partner engaged.',
      state: 'Confirmed legacy',
      stack: [
        {
          name: 'SAP ECC 6.0',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, licence footprint',
        },
        {
          name: 'Manhattan Associates',
          layer: 'Supply chain',
          provenance: 'observed',
          source: 'Technographic record, warehouse systems footprint',
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
            'Merchandising systems roadmap owner plus two supply chain IT architects. Study language, no build roles.',
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
      { term: 'S/4HANA', counts: [0, 2, 4] },
      { term: 'roadmap', counts: [3, 4, 6] },
    ],

    whyNow: {
      title: 'Planning study open · scope undefined',
      chip: 'Supply chain led',
      body: 'A planning replacement study is live and the ERP question is riding alongside it. Whoever frames the planning scope frames the ERP scope.',
    },

    ecosystem: [
      'Manhattan Associates runs the warehouses, so a core platform decision pulls a fulfilment integration workstream with it.',
    ],

    contacts: [
      {
        name: 'Jonah Weiss',
        title: 'VP Merchandising Systems',
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
        title: 'Director, Merchandising Systems Roadmap',
        team: 'Merchandising',
        ageDays: 16,
        snippet:
          'Own the multi-year roadmap for merchandising and planning systems, including the ERP dependency.',
        keywords: ['roadmap', 'ERP dependency'],
      },
      {
        title: 'Supply Chain IT Architect',
        team: 'Supply Chain',
        ageDays: 24,
        snippet:
          'Assess the current planning estate against target architecture options.',
        keywords: ['target architecture'],
      },
    ],
  },

  /* ---------------------------------------------------------------------- */
  {
    id: 'portsmith-logistics',
    name: 'Portsmith Logistics',
    logo: '/logos/portsmith-logistics.svg',
    monogram: 'PL',
    monogramColor: '#14746c',
    city: 'Long Beach',
    state: 'CA',
    hq: 'Long Beach, CA',
    industry: 'Transportation & Logistics',
    employees: 4900,
    revenue: '$980M est.',
    founded: 1988,
    icpFitScore: 55,
    phase: 'latent',
    evidenceConfidence: {
      level: 'Medium',
      detail: '2 independent signal families, 5 source records, dates present.',
    },
    segments: ['scm'],

    brief: {
      whatTheySell:
        'Drayage and bonded warehousing around the San Pedro Bay ports, plus a small customs brokerage arm.',
      revenueDrivers:
        'Container volume through Long Beach and Los Angeles, with warehouse utilisation smoothing the seasonal swing.',
      fitNote:
        'ECC is present and stable. Hiring is maintenance only, so there is no programme to join yet.',
      milestones: [
        'Founded 1988',
        '4,900 employees',
        '11 facilities',
        '$980M est. revenue',
      ],
    },

    signalsFired: [
      { label: 'ECC 6.0 confirmed in technographic data', points: 20 },
      { label: 'Basis and ABAP maintenance roles only', points: 16 },
      { label: 'No roadmap or architecture language in postings', points: 11 },
      { label: 'IT headcount flat across four quarters', points: 8 },
    ],

    phaseNote:
      'ECC is present and supported, and every open role is maintenance. Nothing indicates a programme, a study or a budget cycle.',

    landscape: {
      verdict:
        'SAP ECC 6.0 running the core with a bolt-on transport management system. No migration signal of any kind detected.',
      state: 'Confirmed legacy',
      stack: [
        {
          name: 'SAP ECC 6.0',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, licence footprint',
        },
        {
          name: 'Oracle OTM',
          layer: 'Supply chain',
          provenance: 'observed',
          source: 'Technographic record, transport systems footprint',
        },
        {
          name: 'Tableau',
          layer: 'Data and analytics',
          provenance: 'posting',
          source: 'Named in an operations analyst posting',
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
          observed:
            'ABAP developer and a Basis administrator. Both maintenance scoped.',
          implies: 'Keeping the lights on. No programme exists.',
        },
      ],
    },

    momentum: [
      { term: 'SAP ECC', counts: [2, 2, 2] },
      { term: 'S/4HANA', counts: [0, 0, 1] },
      { term: 'upgrade', counts: [1, 1, 1] },
    ],

    whyNow: {
      title: 'No programme · maintenance only',
      chip: 'Nurture',
      body: 'There is nothing to sell into today. Set a watch on governance and architecture postings and revisit when hiring shifts away from maintenance.',
    },

    ecosystem: [
      'Oracle OTM sits beside SAP, which will complicate any future core decision but is not a trigger on its own.',
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
        title: 'Logistics Systems Manager',
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
        keywords: ['ECC 6.0', 'maintain'],
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
    id: 'brightmoor-chemical',
    name: 'Brightmoor Chemical',
    logo: '/logos/brightmoor-chemical.svg',
    monogram: 'BC',
    monogramColor: 'var(--lp-accent)',
    city: 'Baton Rouge',
    state: 'LA',
    hq: 'Baton Rouge, LA',
    industry: 'Chemicals',
    employees: 3200,
    revenue: '$740M est.',
    founded: 1971,
    icpFitScore: 45,
    phase: 'landed',
    evidenceConfidence: {
      level: 'Medium',
      detail: '2 independent signal families, 5 source records, dates present.',
    },
    segments: ['greenfield', 'multi-erp'],

    brief: {
      whatTheySell:
        'Specialty polymers and coating resins sold to industrial coatings and adhesives manufacturers.',
      revenueDrivers:
        'Feedstock spread and plant uptime, with a small number of long-term offtake agreements underwriting volume.',
      fitNote:
        'Went live on S/4 fourteen months ago. Hypercare has ended and the conversation now is support model, not migration.',
      milestones: [
        'Founded 1971',
        '3,200 employees',
        'S/4 live 14 months',
        '$740M est. revenue',
      ],
    },

    signalsFired: [
      { label: 'S/4HANA licence confirmed, greenfield build', points: 18 },
      { label: 'Hypercare and AMS language across postings', points: 13 },
      { label: 'Application support lead role open', points: 9 },
      { label: 'No further migration roles posted since go-live', points: 5 },
    ],

    phaseNote:
      'S/4 has been live for fourteen months. Postings reference hypercare exit and application managed services rather than build work.',

    landscape: {
      verdict:
        'S/4HANA live on a greenfield build since 2025. The legacy estate has been retired. Current activity is support model rather than platform change.',
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
        prior: 'Infosys',
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
    id: 'kestrel-financial',
    name: 'Kestrel Financial',
    logo: '/logos/kestrel-financial.svg',
    monogram: 'KF',
    monogramColor: 'var(--lp-accent)',
    city: 'Charlotte',
    state: 'NC',
    hq: 'Charlotte, NC',
    industry: 'Financial Services',
    employees: 12700,
    revenue: '$3.3B est.',
    founded: 1949,
    icpFitScore: 38,
    phase: 'latent',
    evidenceConfidence: {
      level: 'Low',
      detail: '2 independent signal families, 4 source records, mostly undated.',
    },
    segments: ['fico'],

    brief: {
      whatTheySell:
        'Commercial banking and treasury services for mid-market businesses across the Carolinas and Virginia.',
      revenueDrivers:
        'Net interest margin on the commercial loan book, with treasury services fee income growing steadily.',
      fitNote:
        'ECC runs corporate finance only. Regulated core banking will never move, so the addressable scope is small and no programme exists.',
      milestones: [
        'Founded 1949',
        '12,700 employees',
        '190 branches',
        '$3.3B est. revenue',
      ],
    },

    signalsFired: [
      { label: 'ECC 6.0 present in corporate finance', points: 15 },
      { label: 'Reporting and close roles only', points: 11 },
      { label: 'No architecture or roadmap postings', points: 7 },
      { label: 'Core banking platform out of ERP scope', points: 5 },
    ],

    phaseNote:
      'ECC supports corporate finance and nothing else. Open roles are reporting and close focused with no roadmap or architecture language.',

    landscape: {
      verdict:
        'SAP ECC 6.0 confined to corporate finance, sitting beside a regulated core banking platform that is out of scope. No migration signal detected.',
      state: 'Confirmed legacy',
      stack: [
        {
          name: 'SAP ECC 6.0',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, finance systems footprint',
        },
        {
          name: 'Temenos',
          layer: 'ERP core',
          provenance: 'observed',
          source: 'Technographic record, core banking footprint',
        },
        {
          name: 'Oracle Hyperion',
          layer: 'Finance and HCM',
          provenance: 'posting',
          source: 'Named in a financial reporting manager posting',
        },
      ],
      evidence: [
        {
          source: 'Technographics',
          observed: 'ECC 6.0 in finance. Temenos as the regulated core.',
          implies: 'Small SAP footprint. Most of the estate is untouchable.',
        },
        {
          source: 'Job postings (2 recent)',
          observed: 'Financial reporting manager and a close analyst.',
          implies: 'Business as usual. No programme.',
        },
      ],
    },

    momentum: [
      { term: 'SAP ECC', counts: [1, 1, 2] },
      { term: 'S/4HANA', counts: [0, 0, 0] },
      { term: 'close cycle', counts: [2, 2, 3] },
    ],

    whyNow: {
      title: 'No programme · narrow footprint',
      chip: 'Nurture',
      body: 'Nothing is moving and the addressable scope is small even if it did. Watch for a finance systems architecture posting as the first real signal.',
    },

    ecosystem: [
      'Hyperion still handles consolidation, which would be the first thing to come up if finance ever revisits the platform.',
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

  /* ------------------------------------------------------------------------
     DELIBERATELY THIN. Phase Unclassified: the evidence was not there, so
     the page degrades into honest empty states rather than inventing
     content. This is intentional, not a bug.
     ---------------------------------------------------------------------- */
  {
    id: 'cirrus-software',
    name: 'Cirrus Software',
    logo: '/logos/cirrus-software.svg',
    monogram: 'CS',
    monogramColor: '#5f6470',
    city: 'Boise',
    state: 'ID',
    hq: 'Boise, ID',
    industry: 'Software',
    employees: 2100,
    revenue: null,
    founded: null,
    icpFitScore: 22,
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
      { label: 'Generic IT modernisation language in two postings', points: 14 },
      { label: 'ERP referenced without naming a vendor', points: 8 },
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
