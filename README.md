# LeadPlus prototype

A click-through sales intelligence prototype. Everything in it is dummy data.

This is a real project on disk, so you change it by editing files rather than
regenerating it. Nothing here talks to a server or a database.

---

## Running it on your machine

You need [Node.js](https://nodejs.org) installed (the LTS version is fine).
You only ever do this in a terminal, in this folder.

**First time only**, install the dependencies:

```bash
npm install
```

**Every time** you want to look at the prototype:

```bash
npm run dev
```

That prints a web address, usually `http://localhost:5173`. Open it in your
browser. Leave the terminal running while you work - when you save a file, the
browser updates by itself within a second. No need to refresh.

To stop it, click the terminal and press `Ctrl` + `C`.

---

## Changing the dummy data

**All company data is in one file:** `src/data/companies.js`

Open it and you will see a list of companies, each looking like this:

```js
{
  id: 'meridian-foods',
  name: 'Meridian Foods',
  city: 'Columbus',
  state: 'OH',
  industry: 'Food & Beverage',
  employees: 14200,
  fitScore: 91,
  phase: 'executing',
  ...
}
```

Change any of those values and save. The table updates immediately.

- **To add a company**, copy an existing block, paste it, and change the
  values. Give it a new `id` (lowercase, hyphens, no spaces).
- **To remove one**, delete its block.
- **`fitScore`** is the ICP Fit Score, a number from 0 to 100. The bar length
  is worked out from it.
- **`phase`** must be one of the ids listed in `DECISION_PHASES` at the top of
  the same file: `latent`, `evaluating`, `mobilizing`, `executing`, `landed`,
  `re-expanding`, `unclassified`. Anything unrecognised shows as
  Unclassified rather than breaking.
- **`windowState`** must be one of `open`, `narrowing`, `closed`,
  `re-opening`. The "Selling as:" dropdown shifts a company between these.
- **`employees`** is a plain number with no commas. The commas are added for
  you when it is displayed.

**Segment pills** (Finance-first, Supply chain, and so on) are in
`src/data/segments.js`. The counts in the pills are counted automatically from
the companies, so you never type a number by hand - just add the segment's `id`
to the `segments` list of whichever companies belong to it.

**Company logos** are the SVG files in `public/logos/`. Each company points at
one with its `logo` field. If a file is missing or broken, the table
automatically falls back to a colored square with the company's initials, so
nothing ever looks broken.

---

## Changing the colors, fonts and sizes

**All of them are in one file:** `src/styles/tokens.css`

There are no color codes anywhere else in the project. Open that file and you
will find a list like this:

```css
--lp-accent: #5b5bd6;      /* primary buttons and active nav */
--lp-line: #e5e7eb;        /* the thin 1px borders */
--lp-txt: #101113;         /* headings and main text */
```

Change a hex code, save, and every screen updates at once.

The file has two blocks:

- the first block (`:root`) is **light mode**, which is the normal look
- the second block (`:root[data-theme='dark']`) is **dark mode**, which the
  moon icon in the top bar switches to

If you change a color in one, change it in the other too, or dark mode will
look wrong.

Further down the same file are the text sizes, corner roundness (`--radius-*`)
and the sidebar width. Same idea: change the number, everything follows.

### Making the UI tighter or airier

In the same file there is a block marked **DENSITY**:

```css
--lp-card-pad-y: 15px;   /* top/bottom padding inside a card */
--lp-card-gap: 10px;     /* gap between stacked cards */
--lp-row-pad-y: 7px;     /* top/bottom padding in a table row */
```

Raise those numbers for more breathing room, lower them for more information
on screen. Every card and table row follows automatically.

### Making text heavier or lighter

Also in the same file:

```css
--font-weight-body: 450;   /* all body text */
--font-weight-name: 550;   /* company names, contact names */
--font-weight-label: 600;  /* labels, table headers, section headers */
--font-weight-num: 600;    /* scores and employee counts */
```

The project uses the variable version of Inter, which is what makes
in-between weights like 450 and 550 possible. Do not go below 400.

---

## Where each screen lives

| What you see                      | File to open                                 |
| --------------------------------- | -------------------------------------------- |
| The whole left sidebar and menu   | `src/components/layout/Sidebar.jsx`          |
| The top bar, breadcrumb, search   | `src/components/layout/TopBar.jsx`           |
| Company Search page               | `src/pages/Leads.jsx`                        |
| The filter row and pills          | `src/components/leads/FilterBar.jsx`         |
| The "Selling as:" dropdown        | `src/components/leads/ArchetypeSelector.jsx` |
| The table itself                  | `src/components/leads/LeadsTable.jsx`        |
| An individual account page        | `src/pages/AccountDetail.jsx`                |
| One section of the account page   | one file in `src/components/account/`        |

The rule: **to change one section of the account page you should only ever
have to open one file.** If you find yourself editing two files to change one
visible thing, something has been built wrong - say so.

---

## Putting it on the internet (Netlify)

Netlify gives you a public link you can send to people. It is free for this.

**Option A - drag and drop (quickest, no account setup)**

1. In the terminal, run:

   ```bash
   npm run build
   ```

   This creates a `dist` folder.

2. Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the
   `dist` folder onto the page. You get a link straight away.

The catch: you repeat this every time you make a change.

**Option B - connect it to GitHub (updates itself)**

1. Push this folder to a GitHub repository.
2. In Netlify, choose **Add new site → Import an existing project**, and pick
   that repository.
3. Netlify reads `netlify.toml` in this folder, so the settings are already
   correct - build command `npm run build`, publish directory `dist`. Do not
   change them.
4. Click deploy.

From then on, every time you push a change to GitHub, Netlify rebuilds the
site by itself.

> `netlify.toml` also contains a redirect rule. Leave it there. Without it,
> refreshing the page on an account URL would show a "page not found" error.

---

## Saving your work with git

Git keeps a history so you can undo anything. After making a change you are
happy with:

```bash
git add -A && git commit -m "describe what you changed"
```

To see the history:

```bash
git log --oneline
```

To throw away changes since the last commit and go back:

```bash
git restore .
```

---

## The commands, all in one place

| Command         | What it does                                       |
| --------------- | -------------------------------------------------- |
| `npm install`   | Installs dependencies. Run once, and after a pull.  |
| `npm run dev`   | Starts the local preview. Ctrl+C to stop.           |
| `npm run build` | Makes the `dist` folder for deploying.              |
| `npm run preview` | Shows you the built version before deploying.     |
| `npm run lint`  | Checks the code for mistakes.                       |
