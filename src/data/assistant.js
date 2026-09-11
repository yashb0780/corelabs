/* ==========================================================================
   ASSISTANT CHAT WIDGET COPY.

   Every string the widget shows lives here, so the component holds no
   content. Edit the wording below and the widget follows.

   The widget is a visual prototype. There is no model behind it. It does
   one thing for real: if your message names one of your saved lists, it
   says so, and the pills under the reply act on that list. Otherwise it
   returns `reply` plus `viewNote`, and the pills act on whatever is in
   view on Company Search. Every reply gets the same two pills. That is
   deliberate.
   ========================================================================== */

export const ASSISTANT = {
  title: 'LeadPlus Assistant',
  subtitle: 'Ask about your leads or campaigns',

  /** The message already in the panel when it is first opened. */
  greeting:
    'Hi there. Ask me to refine your list, change your ICP, or check on a campaign.',

  /** Tappable chips under the greeting. Tapping one sends it as a message. */
  suggestions: [
    'Narrow this list to manufacturing',
    'Why is Cummins scored 79?',
    'How did last week’s campaign perform?',
  ],

  placeholder: 'Ask a question...',

  /** The answer to anything that does not name a saved list. */
  reply:
    'This is a prototype. In the live product I would run that against your workspace.',

  /** Added after `reply`, to say what the pills under it will act on. */
  viewNote: (accounts) =>
    `The actions below use the ${accounts} accounts in view on Company Search.`,

  /** The answer when the message names a saved list. */
  listReply: (list, accounts, contacts) =>
    `Found your saved list “${list}”: ${accounts} accounts and ${contacts} contacts. What would you like to do with it?`,

  /** How long the typing dots show before the reply lands, in milliseconds. */
  typingMs: 1000,
}
