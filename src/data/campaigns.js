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

   Nothing runs. Launching a sequence or sending the email only creates a
   draft and shows a toast; enrichment only shows a toast. Saving a list
   really adds it to Saved lists, until the page is reloaded.

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
      startDate: 'Start date',
      startTime: 'Start time',
      startPast: 'Pick a start date and time that has not passed yet.',
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
    email: (name) => `“${name}” created as a draft email`,
    emailScheduled: (name, when) => `“${name}” scheduled for ${when}`,
    saved: (name) => `Saved “${name}” to Saved lists`,
    enriched: (n) => `Enrichment queued for ${plural(n, 'account', 'accounts')}`,
  },
}
