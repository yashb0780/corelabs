/* ==========================================================================
   VENDOR PROFILE: copy, options, and the scrape result.

   WHAT THIS SCREEN IS FOR
   The vendor profile is the input that produces the first account list.
   Every field on it should change which companies get surfaced. If a field
   does not change the list, it does not belong here. Marketplace directory
   fields (tagline, portfolio, social links, languages, video) are
   deliberately not here. See the note in CLAUDE.md.

   KEEP IT GENERIC
   No technology ecosystem is assumed. The product serves services firms
   across any stack, so no label or helper text names a specific platform.
   The technology list below is a set of suggestions the user can ignore or
   type past, not a fixed vocabulary.

   ON PRE-FILLING
   SCRAPE_RESULT stands in for what we read off the vendor's website. A
   missing or empty field must stay empty on screen. Never substitute a
   plausible looking default: a guessed founding year or employee band looks
   confirmed to the user and silently produces wrong data. The whole page
   must be completable by hand.

   TO SEE THE FAILED SCRAPE STATE: set SCRAPE_RESULT to null below. Every
   field renders blank and the helper text changes to say so.
   ========================================================================== */

export const VENDOR_PROFILE_COPY = {
  title: 'Vendor profile',
  subtitle:
    'This is what we use to build your first account list. Every field here changes which companies we surface.',

  foundLabel: 'What we found about you',
  foundHelp:
    'We pulled this from your website. Correct anything that is wrong.',
  foundHelpEmpty:
    'We could not read anything useful from your website, so nothing is filled in. Add what you can by hand.',

  sellLabel: 'Tell us who you sell to',
  sellHelp:
    'We cannot infer these from a website. They decide which companies make your list.',

  save: 'Save and continue',
}

/** Offered as chips. The field also takes anything typed. */
export const TECHNOLOGY_SUGGESTIONS = [
  'AWS',
  'Azure',
  'SAP',
  'Oracle',
  'Salesforce',
  'NetSuite',
  'ServiceNow',
  'Snowflake',
]

/** The first entry is the unset state, so nothing is ever preselected. */
export const EMPLOYEE_BANDS = [
  { value: '', label: 'Not set' },
  { value: '1-10', label: '1 to 10' },
  { value: '11-50', label: '11 to 50' },
  { value: '51-200', label: '51 to 200' },
  { value: '201-1000', label: '201 to 1,000' },
  { value: '1001-5000', label: '1,001 to 5,000' },
  { value: '5000+', label: 'More than 5,000' },
]

export const REVENUE_BANDS = [
  { value: '', label: 'Not set' },
  { value: '<10m', label: 'Under $10M' },
  { value: '10m-50m', label: '$10M to $50M' },
  { value: '50m-250m', label: '$50M to $250M' },
  { value: '250m-1b', label: '$250M to $1B' },
  { value: '1b-10b', label: '$1B to $10B' },
  { value: '10b+', label: 'Over $10B' },
]

/** Every field, empty. The shape of a profile, and the failed scrape state. */
export const EMPTY_VENDOR_PROFILE = {
  // Group one: what we found
  companyName: '',
  website: '',
  headquarters: '',
  deliveryLocations: [],
  foundingYear: '',
  employeeSize: '',
  whatYouDo: '',
  keyOfferings: [],

  // Group two: who you sell to
  technologies: [],
  certifications: [],
  sellsToRevenue: '',
  sellsToEmployees: '',
  industriesInclude: [],
  industriesExclude: [],
  recentCustomers: [],
}

/**
 * What the website scrape returned. Set to null to see the empty state.
 * Anything absent here stays blank on screen rather than being guessed.
 */
export const SCRAPE_RESULT = {
  companyName: 'Northbeam Consulting',
  website: 'northbeam.consulting',
  headquarters: 'Chicago, IL',
  deliveryLocations: ['Austin, TX', 'Toronto, ON', 'Pune, MH'],
  foundingYear: '2009',
  employeeSize: '201-1000',
  whatYouDo:
    'We plan and deliver enterprise platform migrations for mid-market and large organisations. Most engagements start with an assessment, then a phased build, then managed support once the new platform is live.',
  keyOfferings: [
    'Platform assessment and roadmap',
    'Migration delivery',
    'Data migration and integration',
    'Managed application support',
  ],
}

/** Placeholder and helper text for each control, kept out of the components. */
export const VENDOR_FIELDS = {
  companyName: { label: 'Company name' },
  website: { label: 'Website', placeholder: 'yourcompany.com' },
  headquarters: {
    label: 'Headquarters location',
    placeholder: 'City, State or City, Country',
  },
  deliveryLocations: {
    label: 'Other delivery locations',
    hint: 'Anywhere else you staff work from.',
    placeholder: 'City, State or City, Country',
    add: 'Add location',
  },
  foundingYear: { label: 'Founding year', placeholder: 'YYYY' },
  employeeSize: { label: 'Employee size' },
  whatYouDo: {
    label: 'What you do',
    hint: 'A few plain sentences. No marketing language needed.',
  },
  keyOfferings: {
    label: 'Key offerings',
    hint: 'The services you actually sell.',
    placeholder: 'Name a service',
    add: 'Add offering',
  },
  technologies: {
    label: 'Technologies and platforms you work with',
    hint: 'Pick from the suggestions or type your own and press Enter.',
    placeholder: 'Type a technology and press Enter',
  },
  certifications: {
    label: 'Partner and vendor certifications',
    hint: 'The provider, and the level or tier you hold with them.',
    add: 'Add certification',
    providerPlaceholder: 'Provider',
    levelPlaceholder: 'Level or tier',
  },
  sellsToRevenue: { label: 'Revenue band you sell to' },
  sellsToEmployees: { label: 'Employee band you sell to' },
  industriesInclude: {
    label: 'Industries you win in',
    placeholder: 'Type an industry and press Enter',
  },
  industriesExclude: {
    label: 'Industries to exclude',
    placeholder: 'Type an industry and press Enter',
  },
  recentCustomers: {
    label: 'Recent customers you are proud of',
    hint: 'Three to five is plenty.',
    placeholder: 'Customer name',
    add: 'Add customer',
    max: 5,
  },
}
