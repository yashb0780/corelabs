# content/

Copy and rules for the chat screens (and, from Phase 2, the skills library).
Edit the wording here and the screens follow. No component holds any of it.

Company data is not here. It stays in `src/data/companies.js`, and these
files point at companies by their `id` from that file (for example
`cummins`, `coca-cola`).

JSON cannot hold comments, so each file starts with an `_about` line saying
what it is for. Leave the `_about` lines in place; the app ignores them.

Words in curly brackets, such as `{count}` or `{company}`, are filled in by
the app. Keep them exactly as written when you reword a line.

Where a line has a `one` and an `other` version, `one` is used when the
number is 1 and `other` for everything else.

**SAP-specific on purpose.** The suggested prompts, the intents and the
starter chats name SAP products. That is a deliberate exception to the
generic-copy rule in `CLAUDE.md`, made at the owner's request.

## chat/

| File | What it holds |
|---|---|
| `home.json` | The New chat page: greetings, placeholder, suggestion chips, Today's signals, and the sidebar labels |
| `intents.json` | The keyword rules that turn a prompt into filters, including the negation words |
| `replies.json` | Everything the agent says: step chips, answers, the "could not match" reply |
| `starter-chats.json` | The chats already in the sidebar the first time the prototype is opened |
