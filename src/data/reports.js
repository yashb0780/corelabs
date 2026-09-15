/* ==========================================================================
   REPORTS: the dashboard on the Reports screen, and every word on it.

   Dummy numbers for the prototype. Nothing is saved: renaming, duplicating,
   removing or adding a report lasts until the page is reloaded, then the
   dashboard goes back to what is written here.

   DELIBERATE EXCEPTION: some report copy uses SAP terms (ECC, S/4HANA),
   because the owner asked for metrics that read like an SAP systems
   integrator's. New copy normally avoids ecosystem language (see CLAUDE.md).

   The numbers hang together on purpose: the 1,712 companies split by ICP
   band and by industry are the same 1,712, and the campaign names match the
   lists on Saved lists.

   TO CHANGE A NUMBER: edit it below. The chart, its tooltip and the table
   on its detail page all read from here.

   EXCEPT THE CAMPAIGN NUMBERS. A value written as `campaigns: '<name>'`
   instead of a number is not typed here: it is filled in from the
   campaigns themselves (getCampaignSummary in src/lib/campaigns.js), the
   same figures the Campaigns screen shows, so the two screens always
   agree. Today that is the funnel's Contacted and Replied stages and the
   Campaign reply rate bars. Do not replace them with typed numbers.

   The typed funnel stages around them must keep the funnel descending:
   Enriched above the most Contacted can ever reach, and Meeting booked
   below the interested replies. scripts/check-campaigns.mjs checks both
   (section 9 of BRIEF.md, "Where the numbers come from").

   TO ADD A REPORT: copy one and change it. `type` is one of the keys in
   REPORT_TYPES and `source` one of the keys in REPORT_SOURCES.
   ========================================================================== */

/* The objects a report can read from. Shown as the small chip on a card. */
export const REPORT_SOURCES = {
  leads: { label: 'Leads', icon: 'target' },
  signals: { label: 'Signals', icon: 'activity' },
  companies: { label: 'Companies', icon: 'building' },
  campaigns: { label: 'Campaigns', icon: 'megaphone' },
  lists: { label: 'Lists', icon: 'bookmark' },
}

/* The kinds of chart. `hint` is the line under each one in Add report. */
export const REPORT_TYPES = {
  funnel: {
    label: 'Funnel',
    icon: 'filter',
    hint: 'How many make it through each stage',
  },
  line: {
    label: 'Line chart',
    icon: 'trendingUp',
    hint: 'How something changes over time',
  },
  bar: {
    label: 'Bar chart',
    icon: 'barChart',
    hint: 'Compare amounts across groups',
  },
  pie: {
    label: 'Pie chart',
    icon: 'pieChart',
    hint: 'How a whole splits into parts',
  },
}

/*
   Fields on a report:
     id           unique slug, and its address: /reports/<id>
     title        the card title
     description  one line under the title on the detail page
     type         funnel, line, bar or pie
     source       which object it reads from
     format       'count' for plain numbers, 'percent' for rates
     unit         what one of the numbers is, e.g. "accounts"
     categoryLabel  for bar and pie: what the groups are, e.g. "Industry".
                  Heads the first column of the table on the detail page.
     data         the numbers. Its shape depends on the type:
                    funnel  stages: [{ label, value }]. A stage written
                            { label, campaigns: 'contacted' } takes its value
                            from the campaigns (see the top of this file)
                    line    periods: [...], series: [{ label, color, values }]
                    bar     bars: [{ label, value }], plus `horizontal: true`
                            for long labels. `campaigns: 'replyRateBars'` in
                            place of `bars` takes them from the campaigns
                    pie     slices: [{ label, value, color }]
     color        for line and pie: chart-1 to chart-4 from tokens.css, or
                  "other" for the neutral grey. Series with `dashed: true`
                  draw as a dashed line.
*/
export const REPORTS = [
  {
    id: 'account-funnel',
    title: 'Account funnel',
    description:
      'Accounts at each stage, from first sourced to a booked meeting. The percentage is of all sourced accounts.',
    type: 'funnel',
    source: 'leads',
    format: 'count',
    unit: 'accounts',
    data: {
      stages: [
        { label: 'Sourced', value: 4820 },
        { label: 'Signal matched', value: 3172 },
        { label: 'Enriched', value: 2486 },
        // From the campaigns: accounts sent at least one step.
        { label: 'Contacted', campaigns: 'contacted' },
        // From the campaigns: those with a reply that is not out of office.
        { label: 'Replied', campaigns: 'replied' },
        { label: 'Meeting booked', value: 41 },
      ],
    },
  },
  {
    id: 'signal-classification',
    title: 'Signal classification over time',
    description:
      'Accounts in each landscape state at the end of each quarter. No evidence of S/4HANA is Unknown, not confirmed legacy.',
    type: 'line',
    source: 'signals',
    format: 'count',
    unit: 'accounts',
    data: {
      periods: ['Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026'],
      series: [
        {
          label: 'Confirmed legacy ECC',
          color: 'chart-2',
          values: [182, 214, 241, 268, 291, 312],
        },
        {
          label: 'Confirmed modern S/4HANA',
          color: 'chart-1',
          values: [88, 117, 149, 186, 221, 258],
        },
        {
          label: 'Unknown',
          color: 'other',
          dashed: true,
          values: [634, 588, 541, 497, 452, 418],
        },
      ],
    },
  },
  {
    id: 'icp-fit-bands',
    title: 'Accounts by ICP fit score',
    description: 'Every company in the dataset, grouped by its ICP fit score.',
    type: 'bar',
    source: 'companies',
    format: 'count',
    unit: 'accounts',
    categoryLabel: 'ICP fit score',
    data: {
      bars: [
        { label: '0 to 25', value: 312 },
        { label: '26 to 50', value: 689 },
        { label: '51 to 75', value: 524 },
        { label: '76 to 100', value: 187 },
      ],
    },
  },
  {
    id: 'campaign-reply-rate',
    title: 'Campaign reply rate',
    description:
      'Replies as a share of accounts contacted, for each campaign run from a saved list.',
    type: 'bar',
    source: 'campaigns',
    format: 'percent',
    unit: 'reply rate',
    categoryLabel: 'Campaign',
    data: {
      horizontal: true,
      // From the campaigns: one bar per campaign run from a saved list that
      // has contacted someone, highest first.
      campaigns: 'replyRateBars',
    },
  },
  {
    id: 'industry-mix',
    title: 'Accounts by industry',
    description: 'Every company in the dataset, split by industry.',
    type: 'pie',
    source: 'companies',
    format: 'count',
    unit: 'accounts',
    categoryLabel: 'Industry',
    data: {
      slices: [
        { label: 'Manufacturing', value: 651, color: 'chart-1' },
        { label: 'Healthcare', value: 360, color: 'chart-2' },
        { label: 'Financial Services', value: 291, color: 'chart-3' },
        { label: 'Consumer Products', value: 240, color: 'chart-4' },
        { label: 'Other', value: 170, color: 'other' },
      ],
    },
  },
  {
    id: 'enrichment-coverage',
    title: 'Enrichment coverage',
    description:
      'Accounts across all saved lists, by how many contacts enrichment found for each.',
    type: 'bar',
    source: 'lists',
    format: 'count',
    unit: 'accounts',
    categoryLabel: 'Contacts found',
    data: {
      bars: [
        { label: '0', value: 241 },
        { label: '1 to 2', value: 702 },
        { label: '3 to 5', value: 893 },
        { label: '6 or more', value: 411 },
      ],
    },
  },
]

/*
   What a report added through "Add report" shows until it is built for
   real: sample numbers for its chart type, clearly marked as a sample on
   the card. Its title is the chart type and the source, e.g.
   "Bar chart · Companies", and can be renamed.
*/
export const REPORT_TEMPLATES = {
  funnel: {
    format: 'count',
    unit: 'records',
    data: {
      stages: [
        { label: 'Stage 1', value: 1200 },
        { label: 'Stage 2', value: 640 },
        { label: 'Stage 3', value: 310 },
        { label: 'Stage 4', value: 92 },
      ],
    },
  },
  line: {
    format: 'count',
    unit: 'records',
    data: {
      periods: ['Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026'],
      series: [{ label: 'Records', color: 'chart-1', values: [120, 164, 151, 208] }],
    },
  },
  bar: {
    format: 'count',
    unit: 'records',
    categoryLabel: 'Region',
    data: {
      bars: [
        { label: 'Northeast', value: 184 },
        { label: 'Midwest', value: 262 },
        { label: 'South', value: 219 },
        { label: 'West', value: 143 },
      ],
    },
  },
  pie: {
    format: 'count',
    unit: 'records',
    categoryLabel: 'Region',
    data: {
      slices: [
        { label: 'Northeast', value: 184, color: 'chart-1' },
        { label: 'Midwest', value: 262, color: 'chart-2' },
        { label: 'South', value: 219, color: 'chart-3' },
        { label: 'West', value: 143, color: 'chart-4' },
      ],
    },
  },
}

/* Every word on the Reports screens. The ones written as `(a) => ...`
   build a sentence; edit the words inside the backticks. */
export const REPORTS_COPY = {
  title: 'Reports',
  subtitle: 'How accounts move from signal to meeting, across every list and campaign.',
  refresh: 'Refresh data',
  refreshing: 'Refreshing…',
  add: 'Add report',
  sample: 'Sample data',
  cardMenu: (title) => `Actions for ${title}`,
  rename: 'Rename',
  duplicate: 'Duplicate',
  remove: 'Remove from dashboard',
  copySuffix: '(copy)',
  newTitle: (type, source) => `${type} · ${source}`,

  empty: {
    title: 'No reports on the dashboard',
    body: 'Add a report to start building this dashboard back up.',
  },

  notFound: {
    title: 'That report is not on the dashboard',
    body: 'It may have been removed, or added in an earlier visit. Reports reset when the page reloads.',
    back: 'Back to Reports',
  },

  addModal: {
    title: 'Add report',
    typeLabel: 'Report type',
    sourceLabel: 'Source object',
    sourceHint: 'The records this report reads from.',
    confirm: 'Add report',
    cancel: 'Cancel',
  },

  renameModal: {
    title: 'Rename report',
    label: 'Name',
    confirm: 'Save',
    cancel: 'Cancel',
  },

  table: {
    stage: 'Stage',
    period: 'Quarter',
    category: 'Group',
    value: 'Value',
    share: 'Share of total',
    ofFirst: 'Of first stage',
    stepConversion: 'From previous stage',
    total: 'Total',
  },

  tooltip: {
    ofFirst: 'of first stage',
    fromPrevious: 'from previous stage',
    ofTotal: 'of total',
  },

  toast: {
    refreshed: 'Data refreshed',
    added: (title) => `Added “${title}” to the dashboard`,
    duplicated: (title) => `Duplicated “${title}”`,
    removed: (title) => `Removed “${title}” from the dashboard`,
    renamed: (title) => `Renamed to “${title}”`,
  },
}
