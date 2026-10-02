# content/

Copy and rules for the chat screens and the Skills library.
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

**SAP-specific on purpose.** The suggested prompts, the intents, the
starter chats and the seed skills name SAP products. That is a deliberate exception to the
generic-copy rule in `CLAUDE.md`, made at the owner's request.

## chat/

| File | What it holds |
|---|---|
| `home.json` | The New chat page: greetings, placeholder, suggestion chips, and the sidebar labels |
| `intents.json` | The keyword rules that turn a prompt into filters, including the negation words |
| `replies.json` | Everything the agent says: step chips, answers, the "could not match" reply |
| `starter-chats.json` | The chats already in the sidebar the first time the prototype is opened |

## skills/

One `.md` file per skill. The file name is the skill's id and its address,
so `account-brief.md` is `/skills/account-brief`. Each file starts with
settings between two `---` lines:

| Setting | What it is |
|---|---|
| `name` | The skill's name |
| `description` | One line, shown on its card |
| `category` | `find`, `understand`, `reach` or `review` |
| `scope` | `system` (read only), `workspace` or `mine` |
| `order` | Its place within its category |
| `inputs` | What it runs on, as a list: `[account]`, `[campaign]`, `[workspace]` |
| `knowledge` | The chips under Knowledge used, as a list. No commas inside an item. |
| `example` | The company or campaign id its Example output runs on |

Then three sections, each under a `## ` heading spelled exactly:
`## When to use`, `## Instructions`, `## Output format`. They are written
in markdown: `1.` for a step, `-` for a bullet, `**bold**`.

The answer a seed skill gives is scripted from the dummy company and
campaign data, so names and numbers always match. Its wording is in
`outputs.json`. A skill added to this folder without a script still works:
its runs show its output format.

| File | What it holds |
|---|---|
| `library.json` | Every word on the Skills screens, the tabs, categories, scope badges and the picker |
| `outputs.json` | The wording of each scripted run, one block per skill |
| `recent-runs.json` | The Recent runs each skill's page starts with |
