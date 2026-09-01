/* ==========================================================================
   ASSISTANT CHAT WIDGET COPY.

   Every string the widget shows lives here, so the component holds no
   content. Edit the wording below and the widget follows.

   The widget is a visual prototype. There is no model behind it: whatever
   you type, it waits a moment and returns `reply`. That is deliberate.
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

  /** The one answer it ever gives, whatever it was asked. */
  reply:
    'This is a prototype. In the live product I would run that against your workspace.',

  /** How long the typing dots show before the reply lands, in milliseconds. */
  typingMs: 1000,
}
