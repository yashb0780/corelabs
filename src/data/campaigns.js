/* ==========================================================================
   CAMPAIGN FLOW: the action pills and what they open.

   The pills appear in two places:
     - the bar at the bottom of Company Search when accounts are ticked:
       Start a campaign, Save as a list, Enrich contacts
     - under every assistant reply: Start a campaign from this list, and
       Save as a list (no Enrich contacts there)
   Every word they use is here.

   Start a campaign opens one modal that first asks which kind of campaign
   to set up: a multi-step sequence or a single email. Each has its own
   screen in the same modal.

   Nothing is actually sent. Scheduling a sequence or an email adds the
   campaign to the Campaigns screen, and saving a list adds it to Saved
   lists, both until the page is reloaded. Enrichment only shows a toast.

   "Send email" appears in exactly one place: the final button of the
   Single email path, where the owner asked for it. It is not an action
   anywhere else.
   ========================================================================== */

/* The pills, in the order they appear. `id` is how the code refers to
   each one. `chatLabel`, where there is one, is what the pill says under
   an assistant reply instead of `label`. */
export const LIST_ACTIONS = [
  {
    id: 'campaign',
    label: 'Start a campaign',
    chatLabel: 'Start a campaign from this list',
    icon: 'megaphone',
  },
  { id: 'save', label: 'Save as a list', icon: 'bookmark' },
  { id: 'enrich', label: 'Enrich contacts', icon: 'sparkle' },
]

/* The two kinds of campaign offered on the first screen of the modal. */
export const CAMPAIGN_TYPES = [
  {
    id: 'sequence',
    label: 'Multi-step sequence',
    icon: 'timeline',
    description: 'A sequence over several days across email and LinkedIn.',
  },
  {
    id: 'email',
    label: 'Single email',
    icon: 'mail',
    description: 'One email to every contact in scope.',
  },
]

/* The kinds of step a sequence can have. */
export const STEP_TYPES = [
  { value: 'email', label: 'Email' },
  { value: 'linkedin-connect', label: 'LinkedIn connection request' },
  { value: 'linkedin-message', label: 'LinkedIn message' },
]

/* The steps a new sequence starts with. `day` is how many days after the
   sequence starts the step goes out, and `time` is when on that day, as
   24 hour "HH:MM" (shown as "9:00 AM"). {{company}} fills in for each
   account. */
export const CAMPAIGN_SEQUENCE = [
  {
    type: 'email',
    day: 0,
    time: '09:00',
    subject: 'A quick question about {{company}}’s roadmap',
  },
  {
    type: 'linkedin-connect',
    day: 3,
    time: '09:00',
    subject: 'Following up on my note',
  },
  {
    type: 'email',
    day: 7,
    time: '09:00',
    subject: 'How a team like {{company}}’s cut its rollout time',
  },
]

/* What "Add step" appends: an email, a few days after the last step, at
   9:00 AM. */
export const NEW_STEP = { type: 'email', gapDays: 3, time: '09:00', subject: '' }

/* When a sequence starts, or a scheduled email sends, if nobody changes it:
   tomorrow at this time. Time pickers step in 15 minutes. */
export const DEFAULT_SEND_TIME = '09:00'

/* The most steps a sequence can have. */
export const MAX_STEPS = 6

/* The most rows the Accounts or Contacts picker draws at once. A big saved
   list has over a thousand accounts; searching narrows it down. Select all
   and Clear still act on everything that matches, not just what is drawn. */
export const PICKER_ROW_LIMIT = 200

/* What the single email starts with. {{first_name}}, {{company}} and
   {{sender_name}} fill in for each contact. */
export const EMAIL_TEMPLATE = {
  subject: 'A quick question about {{company}}’s roadmap',
  body: `Hi {{first_name}},

I noticed {{company}} has been hiring for its platform team, which usually means a bigger change is on the way.

We help teams like yours plan that kind of move without stalling day-to-day work. Would a 20 minute call next week be useful?

Best,
{{sender_name}}`,
}

/* The inboxes a campaign can send from. The first one is picked to start
   with. Every email address in the prototype, sending or receiving, uses
   example.com: it is reserved, so it can never reach a real person, and it
   reads as obviously fake in a demo. Never use a real or real-looking
   domain here. */
export const CAMPAIGN_INBOXES = [
  'priya.raman@example.com',
  'outbound@example.com',
  'partnerships@example.com',
]

/* Every word in the flow. The ones written as `(a) => ...` build a
   sentence from a number or a name; edit the words inside the backticks. */
const plural = (n, one, many) => `${n.toLocaleString('en-US')} ${n === 1 ? one : many}`

export const CAMPAIGN_COPY = {
  // The floating bar on Company Search.
  selectedCount: (n) => `${n} selected`,
  clear: 'Clear',
  barLabel: 'Actions for the selected accounts',

  // What a ticked selection on Company Search is called by default.
  selectionName: (n) => `Company Search · ${plural(n, 'account', 'accounts')}`,
  // What the accounts in view on Company Search are called by default.
  viewName: (n) => `Company Search · ${plural(n, 'account', 'accounts')} in view`,
  // What saving an existing list as a new one is called by default.
  listCopyName: (name) => `${name} (copy)`,

  campaignModal: {
    title: 'Start a campaign',
    nameLabel: 'Campaign name',
    accounts: 'Accounts',
    contacts: 'Contacts',
    chooseLabel: 'How do you want to reach them?',
    // The Accounts and Contacts cards, which open the pickers.
    edit: 'Choose',
    ofTotal: (n) => `of ${n.toLocaleString('en-US')}`,
    emptyScope: 'No contacts are selected, so there is no one to reach. Choose at least one to continue.',

    picker: {
      selectAll: 'Select all',
      clear: 'Clear',
      // Long lists only draw this many rows at once; search finds the rest.
      limited: (shown, total) =>
        `Showing the first ${shown.toLocaleString('en-US')} of ${total.toLocaleString('en-US')}. Search to find the rest.`,
    },

    accountsPicker: {
      title: 'Choose accounts',
      search: 'Search accounts…',
      noMatch: 'No accounts match',
      contacts: (n) => plural(n, 'contact', 'contacts'),
      partial: (selected, total) => `${selected} of ${plural(total, 'contact', 'contacts')}`,
      noContacts: 'No contacts found',
      select: (name) => `Select ${name}`,
      count: (n, total) => `${n.toLocaleString('en-US')} of ${plural(total, 'account', 'accounts')} selected`,
    },

    contactsPicker: {
      title: 'Choose contacts',
      search: 'Search name, title or company…',
      noMatch: 'No contacts match',
      groupCount: (selected, total) => `${selected} of ${total}`,
      selectGroup: (name) => `Select all contacts at ${name}`,
      select: (name) => `Select ${name}`,
      count: (n, total) => `${n.toLocaleString('en-US')} of ${plural(total, 'contact', 'contacts')} selected`,
    },
    recipients: (contacts, accounts) =>
      `Goes to ${plural(contacts, 'contact', 'contacts')} at ${plural(accounts, 'account', 'accounts')}.`,
    inboxLabel: 'Sending inbox',
    cancel: 'Cancel',
    back: 'Back',

    sequence: {
      startLabel: 'Sequence starts',
      startHint: 'Step 1 goes out at this time. Every later step has a time of its own.',
      startDate: 'Start date',
      startTime: 'Start time',
      startPast: 'Pick a start date and time that has not passed yet.',
      // Step 1 has no time box: it goes out at the start time.
      firstStepTime: 'Set by the start time',
      suppressionLabel: 'When someone replies interested',
      stepsLabel: 'Steps',
      stepType: 'Step type',
      day: 'Day',
      time: 'Time',
      sends: 'Sends',
      noDay: 'Set a day',
      stepPast: 'Already passed',
      subject: 'Subject line',
      subjectPlaceholder: 'What the step says first',
      step: (n) => `Step ${n}`,
      remove: (n) => `Remove step ${n}`,
      add: 'Add step',
      max: (n) => `A sequence can have up to ${n} steps.`,
      note: 'Nothing is sent or scheduled from the prototype.',
      confirm: 'Schedule sequence',
    },

    email: {
      subject: 'Subject line',
      body: 'Email',
      bodyHint: '{{first_name}}, {{company}} and {{sender_name}} fill in for each contact.',
      whenLabel: 'When to send',
      now: 'Send now',
      later: 'Schedule for later',
      date: 'Date',
      time: 'Time',
      summary: (when) => `Sends ${when}`,
      past: 'Pick a date and time that has not passed yet.',
      note: 'Nothing is sent or scheduled from the prototype.',
      confirm: 'Send email',
      confirmScheduled: 'Schedule email',
    },
  },

  saveModal: {
    title: 'Save as a list',
    nameLabel: 'List name',
    hint: (n) => `${plural(n, 'account', 'accounts')} will be saved to Saved lists.`,
    confirm: 'Save list',
    cancel: 'Cancel',
  },

  toast: {
    sequence: (name, start) => `“${name}” scheduled to start ${start}`,
    email: (name, contacts) => `“${name}” sent to ${plural(contacts, 'contact', 'contacts')}`,
    emailScheduled: (name, when) => `“${name}” scheduled for ${when}`,
    saved: (name) => `Saved “${name}” to Saved lists`,
    enriched: (n) => `Enrichment queued for ${plural(n, 'account', 'accounts')}`,
  },
}

/* ==========================================================================
   THE CAMPAIGNS SCREEN: the campaigns already running when the prototype
   opens, and the words for their states. See section 9 of BRIEF.md.

   Nothing is saved. Scheduling, pausing, duplicating or correcting a reply
   lasts until the page is reloaded, then the campaigns go back to what is
   written here.

   DATES MOVE WITH TODAY. Every date below is written as a number of days
   ago or from now, never as a calendar date, so an active campaign never
   ends up with a next send that has already passed. For the same reason no
   campaign names a month.

   ONLY WHAT HAPPENED IS WRITTEN HERE. Each campaign's status, how far each
   contact has got, when they next get a step and every count on the screen
   are worked out by src/lib/campaignActivity.js from these dates and
   replies. Do not add those as fields: typed in, they could contradict the
   dates.

   DELIBERATE EXCEPTION: a campaign on a saved list takes that list's name,
   and those names use SAP terms at the owner's request (see
   src/data/savedLists.js). The campaigns on real companies have generic
   names, as should any new one.
   ========================================================================== */

/* Every contact's email address is made from their name at this domain.
   It is reserved, so it can never reach a real person. Never swap in a real
   company's domain: see section 6 of BRIEF.md. */
export const CONTACT_EMAIL_DOMAIN = 'example.com'

/* A campaign's status, as a pill. Draft is dashed because nothing has gone
   out yet, the same way dashed means "absent" on the Phase and Window pills.
   The accent tone is never used here: it means Mobilizing. */
export const CAMPAIGN_STATUSES = {
  active: { label: 'Active', tone: 'green' },
  scheduled: { label: 'Scheduled', tone: 'blue' },
  paused: { label: 'Paused', tone: 'amber' },
  completed: { label: 'Completed', tone: 'grey' },
  draft: { label: 'Draft', tone: 'grey', dashed: true },
}

/* How a reply was classified, as a badge. Unclear is dashed because it is
   the state where we could not tell. */
export const REPLY_TYPES = {
  interested: { label: 'Interested', tone: 'green' },
  ooo: { label: 'Out of office', tone: 'amber' },
  not_interested: { label: 'Not interested', tone: 'grey' },
  unclear: { label: 'Unclear', tone: 'grey', dashed: true },
}

/* Where a contact is in their campaign. */
export const PARTICIPATION = {
  not_started: 'Not started',
  in_sequence: 'In sequence',
  finished: 'Finished',
  stopped: 'Stopped, replied',
  paused_colleague: 'Paused, colleague replied',
  unsubscribed: 'Unsubscribed',
}

/* What an interested reply does, set per campaign. The first is the
   default. Whatever is picked, a not interested reply or an unsubscribe
   always stops that contact, and out of office or unclear stops no one. */
export const SUPPRESSION_RULES = [
  {
    id: 'stop_company',
    label: 'Stop for the whole company',
    hint: 'An interested reply stops that person and pauses their colleagues.',
  },
  {
    id: 'stop_contact',
    label: 'Stop for that contact only',
    hint: 'An interested reply stops that person. Their colleagues carry on.',
  },
  {
    id: 'keep_sending',
    label: 'Keep sending to everyone',
    hint: 'An interested reply stops no one. Everyone keeps getting the remaining steps, including the person who replied.',
  },
]

export const DEFAULT_SUPPRESSION_RULE = 'stop_company'

/* Every word on the Campaigns screen, and every message it shows when
   there is nothing to show. The ones written as `(a) => ...` build a
   sentence from a number or a name; edit the words inside the backticks.
   Dates inside toasts come from src/lib/schedule.js. */
export const CAMPAIGN_SCREEN_COPY = {
  title: 'Campaigns',
  subtitle: 'Outbound sequences running against your saved lists.',
  newCampaign: 'New campaign',
  // Under a campaign's name when it has no saved list behind it.
  fromCompanySearch: 'From Company Search',
  // An empty cell: nothing sent yet, or nothing due.
  none: '–',

  // The five cards above the table. They count every campaign and do not
  // follow the search or the status filter.
  metrics: {
    label: 'Campaign totals',
    active: 'Active campaigns',
    activeNote: (scheduled) => `${scheduled.toLocaleString('en-US')} scheduled`,
    inSequence: 'Contacts in sequence',
    inSequenceNote: 'In active campaigns, with steps still to come',
    emailsSent: 'Emails sent · last 30 days',
    emailsSentNote: 'Email steps only, not LinkedIn',
    replyRate: 'Reply rate',
    replyRateNote: 'Of accounts contacted, not counting out of office',
    interested: 'Interested replies',
    interestedNote: 'Across every campaign',
    needReview: (n) => `${n.toLocaleString('en-US')} ${n === 1 ? 'needs' : 'need'} review`,
  },

  search: 'Search campaigns…',
  filterLabel: 'Filter by status',
  all: 'All',

  columns: {
    campaign: 'Campaign',
    status: 'Status',
    size: 'Accounts / Contacts',
    lastActivity: 'Last activity',
    lastStep: 'Last step sent',
    nextSend: 'Next send',
    replies: 'Replies',
    actions: 'Actions', // read out by screen readers, not shown
  },
  created: (when) => `Created ${when}`,
  // The table shows only how far a campaign has got. The step's name, and
  // who it went to, are on each contact's row on the campaign's own page.
  stepOf: (n, total) => `Step ${n} of ${total}`,
  lastStep: (n, total, name) => `Step ${n} of ${total}, ${name}`,
  // The breakdown under the reply total. Kinds with no replies are left out.
  replyKinds: {
    interested: (n) => `${n.toLocaleString('en-US')} interested`,
    ooo: (n) => `${n.toLocaleString('en-US')} out of office`,
    not_interested: (n) => `${n.toLocaleString('en-US')} not interested`,
    unclear: (n) => `${n.toLocaleString('en-US')} ${n === 1 ? 'needs' : 'need'} review`,
  },

  menu: {
    label: (name) => `Actions for ${name}`,
    view: 'View',
    launch: 'Launch',
    pause: 'Pause',
    resume: 'Resume',
    duplicate: 'Duplicate',
  },

  toast: {
    paused: (name) => `“${name}” paused. Nothing more will send until it is resumed.`,
    resumed: (name) => `“${name}” resumed`,
    resumedNext: (name, when) => `“${name}” resumed. Next send ${when}.`,
    duplicated: (name) => `Duplicated as “${name}”, a draft`,
  },

  empty: {
    title: 'No campaigns yet',
    body: 'Start one from a saved list with the “New campaign” button.',
  },
  noMatch: {
    body: 'No campaigns match this search and filter.',
    clear: 'Clear search and filter',
  },

  // The window "New campaign" opens.
  listPicker: {
    title: 'Choose a saved list',
    search: 'Search saved lists…',
    noMatch: 'No saved lists match',
    counts: (accounts, contacts) =>
      `${plural(accounts, 'account', 'accounts')} · ${plural(contacts, 'contact', 'contacts')}`,
    cancel: 'Cancel',
    continue: 'Continue',
  },

  // One campaign's page, /campaigns/<id>.
  detail: {
    notFound: {
      title: 'Campaign not found',
      body: 'That campaign is not here. It may have been added in an earlier visit: campaigns reset when the page reloads.',
      back: 'Back to Campaigns',
    },
    types: { sequence: 'Multi-step sequence', email: 'Single email' },

    // The suppression setting under the header. A single email does not
    // show it: after its one send there is nothing left to stop.
    rule: {
      label: 'When someone replies interested',
      note: 'A change applies to replies from now on. Colleagues already paused stay paused until someone resumes outreach.',
    },

    // Shown at the top of every tab while the campaign is a draft.
    draftNote: 'Nothing has been sent from this draft yet. Launch it to schedule it.',

    tabs: {
      label: 'Campaign sections',
      companies: 'Companies and Activity',
      sequence: 'Email sequence',
      replies: 'Replies',
      unsubscribed: 'Unsubscribed',
    },

    companies: {
      search: 'Search companies or contacts…',
      expandAll: 'Expand all',
      collapseAll: 'Collapse all',
      toggle: (name) => `Contacts at ${name}`,
      accountPage: (name) => `${name} account page`,
      contacts: (n) => plural(n, 'contact', 'contacts'),
      furthest: (n, total) => `Furthest step ${n} of ${total}`,
      notStarted: 'No step sent yet',
      columns: {
        contact: 'Contact',
        lastStep: 'Last step sent',
        lastSent: 'Last sent',
        nextSend: 'Next send',
        status: 'Status',
        reply: 'Reply',
      },
      // Under an out of office badge, when the reply gave a return date.
      back: (date) => `Back ${date}`,
      banner: (who, when, paused) =>
        `${who} replied interested on ${when}. Outreach to ${plural(paused, 'colleague', 'colleagues')} is paused.`,
      resumeOutreach: 'Resume outreach',
      allSuppressed:
        'Every company in this campaign is paused because someone there replied. Nothing more will send until outreach is resumed.',
      limited: (shown, total) =>
        `Showing the first ${shown.toLocaleString('en-US')} of ${plural(total, 'company', 'companies')}. Search to find the rest.`,
      noMatch: 'No companies or contacts match',
    },

    sequence: {
      columns: {
        step: 'Step',
        type: 'Type',
        when: 'Goes out',
        subject: 'Subject line',
        sent: 'Sent to',
        replies: 'Replies after',
      },
      day: (day, time) => `Day ${day}, ${time}`,
      firstSent: (when) => `First sent ${when}`,
      due: (when) => `Due ${when}`,
      onHold: 'On hold while paused',
      draftNote: 'To change these steps, launch the draft.',
      startedNote: 'Steps cannot be edited once a campaign has started.',
    },

    replies: {
      filterLabel: 'Filter replies',
      filters: {
        all: 'All',
        interested: 'Interested',
        ooo: 'Out of office',
        not_interested: 'Not interested',
        unclear: 'Needs review',
      },
      after: (n, name) => `After step ${n}, ${name}`,
      // One button for every label the classifier could have given.
      mark: {
        interested: 'Mark as interested',
        ooo: 'Mark as out of office',
        not_interested: 'Mark as not interested',
      },
      none: (contacts) => `Sent to ${plural(contacts, 'contact', 'contacts')}, no replies yet.`,
      nothingSent: 'Nothing has been sent, so there are no replies.',
      noneToReview: 'No replies need review.',
      noneOfKind: (label) => `No replies marked ${label.toLowerCase()}.`,
    },

    unsubscribed: {
      columns: { contact: 'Contact', company: 'Company', after: 'Unsubscribed after', when: 'When' },
      none: 'No one has unsubscribed from this campaign.',
    },

    toast: {
      rule: (label) => `Interested replies now: ${label}. Colleagues already paused stay paused.`,
      markedCompany: (who, paused, company) =>
        `${who} marked interested. Outreach to ${plural(paused, 'colleague', 'colleagues')} at ${company} is paused.`,
      markedStopped: (who) => `${who} marked interested. Their sequence has stopped.`,
      markedKeepSending: (who) => `${who} marked interested. Everyone keeps getting the remaining steps.`,
      markedOoo: (who) => `${who} marked out of office. Nothing stops.`,
      markedNotInterested: (who) => `${who} marked not interested. Their sequence has stopped. Colleagues carry on.`,
      outreachResumed: (paused, company, who) =>
        `Outreach resumed for ${plural(paused, 'colleague', 'colleagues')} at ${company}. ${who} stays out of the sequence.`,
    },
  },
}

/* The sequences the seed campaigns use. `name` is what the step is called
   on screen: "Step 2 of 4, Follow up". */
export const SEED_SEQUENCES = {
  fourSteps: [
    { name: 'Intro', type: 'email', day: 0, time: '09:00', subject: 'A quick question about {{company}}’s roadmap' },
    { name: 'Follow up', type: 'email', day: 3, time: '09:00', subject: 'Following up on my note' },
    { name: 'Connect', type: 'linkedin-connect', day: 6, time: '10:00', subject: 'Connecting after my emails' },
    { name: 'Last note', type: 'email', day: 10, time: '09:00', subject: 'Should I close the loop?' },
  ],
  threeSteps: [
    { name: 'Intro', type: 'email', day: 0, time: '09:00', subject: 'A quick question about {{company}}’s roadmap' },
    { name: 'Follow up', type: 'email', day: 4, time: '09:00', subject: 'Following up on my note' },
    { name: 'Case study', type: 'email', day: 9, time: '09:00', subject: 'How a team like {{company}}’s cut its rollout time' },
  ],
  singleEmail: [
    { type: 'email', day: 0, time: '10:00', subject: EMAIL_TEMPLATE.subject, body: EMAIL_TEMPLATE.body },
  ],
}

/* What generated replies say. A campaign on a saved list picks from these
   at random, the same pick every time. Plain, generic language. */
export const REPLY_SNIPPETS = {
  interested: [
    'Thanks for reaching out. The timing is good for us. Could we find 30 minutes next week?',
    'This is on our list for next quarter. Happy to talk, send over a few times.',
    'Yes, worth a conversation. I will bring the person who owns our roadmap.',
    'Interested. Could you share a short case study before we meet?',
  ],
  ooo: [
    'I am out of the office with limited access to email. I will reply when I am back.',
    'Thank you for your message. I am away and will respond on my return.',
    'I am currently on leave. For anything urgent, please contact the main office.',
  ],
  not_interested: [
    'Thanks, but we are not looking at this right now.',
    'We have this covered for the next year. Not a fit at the moment.',
    'Not a priority for us this year.',
  ],
  unclear: [
    'Who else in our industry have you worked with?',
    'Can you send this to our procurement inbox instead?',
    'Maybe. What does something like this usually cost?',
  ],
}

/*
   THE SEED CAMPAIGNS, in no particular order: the table sorts itself.

   TO ADD ONE: copy an entry and change it. Fields:
     id              unique slug, and its address: /campaigns/<id>
     name            what it is called. A campaign on a saved list may leave
                     this out to take the list's name.
     list            the id of a saved list in src/data/savedLists.js, OR
     companies       the ids of real companies in src/data/companies.js,
                     for a campaign started from Company Search
     type            'sequence' or 'email'
     sequence        a key of SEED_SEQUENCES above
     suppression     a SUPPRESSION_RULES id. Leave out for the default.
     createdDaysAgo  when it was created
     startedDaysAgo  when its first step went out, OR
     startsInDays    when it will start, for a scheduled campaign. Leave both
                     out, and set `draft: true`, for a draft.
     pausedDaysAgo   when it was paused, for a paused campaign

   What happened, for a campaign on real companies, as `events`. Each is a
   reply or an unsubscribe from one named contact, `hoursLater` hours after
   the step it followed (`afterStep`, counting from 1). `backInDays` is an
   out of office's return date, in days from today.

   What happened, for a campaign on a saved list: `replies` gives how many of
   each kind, and `unsubscribes` how many. They are spread across the list's
   accounts at random, the same way every time, one per account. These are
   written once as plausible numbers. Never adjust them to make a report
   figure come out at a particular value.
*/
export const SEED_CAMPAIGNS = [
  {
    id: 'priority-accounts',
    name: 'Priority accounts',
    companies: ['coca-cola', 'cummins', 'whirlpool', 'colgate-palmolive', 'caterpillar'],
    type: 'sequence',
    sequence: 'fourSteps',
    createdDaysAgo: 5,
    startedDaysAgo: 4,
    events: [
      {
        company: 'cummins',
        contact: 'Helena Voss',
        reply: 'interested',
        afterStep: 1,
        hoursLater: 27,
        snippet:
          'Good timing. We are planning this for early next year and have not picked a partner. Could you do Thursday afternoon?',
      },
      {
        company: 'whirlpool',
        contact: 'Jonah Weiss',
        reply: 'ooo',
        afterStep: 2,
        hoursLater: 1,
        backInDays: 6,
        snippet: 'I am out of the office with limited access to email and will reply when I am back.',
      },
      {
        company: 'colgate-palmolive',
        contact: 'Tobias Nguyen',
        reply: 'unclear',
        afterStep: 2,
        hoursLater: 3,
        snippet: 'Thanks. Is this something you would run through our procurement team, or directly with finance?',
      },
      {
        company: 'caterpillar',
        contact: 'Neil Vasquez',
        unsubscribe: true,
        afterStep: 1,
        hoursLater: 30,
      },
    ],
  },
  {
    id: 'leanix-signal-q3-outreach',
    list: 'leanix-signal-q3',
    type: 'sequence',
    sequence: 'fourSteps',
    createdDaysAgo: 10,
    startedDaysAgo: 8,
    replies: { interested: 3, ooo: 2, not_interested: 1, unclear: 1 },
    unsubscribes: 1,
  },
  {
    id: 'legacy-ecc-healthcare-outreach',
    list: 'legacy-ecc-healthcare',
    type: 'sequence',
    sequence: 'threeSteps',
    suppression: 'stop_contact',
    createdDaysAgo: 7,
    startedDaysAgo: 6,
    replies: { interested: 4, ooo: 3, not_interested: 3, unclear: 1 },
    unsubscribes: 2,
  },
  {
    id: 's4hana-2027-mid-market-outreach',
    list: 's4hana-2027-mid-market',
    type: 'sequence',
    sequence: 'threeSteps',
    suppression: 'keep_sending',
    createdDaysAgo: 3,
    startedDaysAgo: 2,
    replies: { interested: 21, ooo: 34, not_interested: 17, unclear: 5 },
    unsubscribes: 11,
  },
  {
    id: 'tx-manufacturing-outreach',
    list: 'tx-manufacturing-under-500',
    type: 'sequence',
    sequence: 'fourSteps',
    createdDaysAgo: 22,
    startedDaysAgo: 20,
    pausedDaysAgo: 15,
    replies: { interested: 7, ooo: 6, not_interested: 5, unclear: 2 },
    unsubscribes: 3,
  },
  {
    id: 'rise-evaluators-midwest-outreach',
    list: 'rise-evaluators-midwest',
    type: 'sequence',
    sequence: 'fourSteps',
    createdDaysAgo: 48,
    startedDaysAgo: 45,
    replies: { interested: 13, ooo: 15, not_interested: 12, unclear: 3 },
    unsubscribes: 6,
  },
  {
    id: 'clean-core-chemicals-email',
    list: 'clean-core-chemicals',
    type: 'email',
    sequence: 'singleEmail',
    createdDaysAgo: 22,
    startedDaysAgo: 21,
    replies: { interested: 1, ooo: 1, not_interested: 1, unclear: 0 },
    unsubscribes: 0,
  },
  {
    id: 'warm-accounts',
    name: 'Warm accounts · re-engage',
    companies: ['kimberly-clark', 'emerson-electric'],
    type: 'sequence',
    sequence: 'threeSteps',
    createdDaysAgo: 7,
    startedDaysAgo: 6,
    events: [
      {
        company: 'kimberly-clark',
        contact: 'Rosalind Fyfe',
        reply: 'interested',
        afterStep: 2,
        hoursLater: 5,
        snippet: 'We are revisiting this now. Can you send times for a call with me and Owen?',
      },
      {
        company: 'emerson-electric',
        contact: 'Holly Vance',
        reply: 'interested',
        afterStep: 1,
        hoursLater: 50,
        snippet: 'Yes, let us talk. I will bring our solution architect.',
      },
    ],
  },
  {
    id: 'industrial-first-touch',
    name: 'Industrial accounts · first touch',
    companies: ['sherwin-williams', 'illinois-tool-works', 'air-products', 'avery-dennison'],
    type: 'sequence',
    sequence: 'threeSteps',
    createdDaysAgo: 2,
    startedDaysAgo: 1,
  },
  {
    id: 'btp-postings-outreach',
    list: 'btp-postings-30-days',
    type: 'sequence',
    sequence: 'threeSteps',
    createdDaysAgo: 1,
    startsInDays: 3,
  },
  {
    id: 'ohio-food-beverage-draft',
    list: 'ohio-food-beverage',
    type: 'sequence',
    sequence: 'fourSteps',
    createdDaysAgo: 2,
    draft: true,
  },
]
