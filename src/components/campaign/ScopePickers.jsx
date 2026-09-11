/**
 * The Accounts and Contacts pickers inside Start a campaign.
 *
 * Both edit the same thing: the set of selected contact ids. An account
 * counts as selected while at least one of its contacts is, so the two
 * numbers can never disagree:
 *   - unticking an account unticks all its contacts
 *   - an account whose contacts are all unticked shows as unticked
 *   - an account with no contacts at all can never be ticked
 *
 * Select all and Clear act on whatever the search currently matches, or on
 * everything when the search is empty. Long lists only draw the first rows
 * (PICKER_ROW_LIMIT); search finds the rest.
 */
import { useState } from 'react'
import { cx } from '../cx'
import { Checkbox, SearchInput } from '../form'
import { Button } from '../ui'
import { CAMPAIGN_COPY, PICKER_ROW_LIMIT } from '../../data/campaigns'

const P = CAMPAIGN_COPY.campaignModal.picker

/** Adds or removes a batch of contact ids, returning a new set. */
function withContacts(selected, ids, on) {
  const next = new Set(selected)
  ids.forEach((id) => (on ? next.add(id) : next.delete(id)))
  return next
}

const selectedIn = (account, selected) =>
  account.contacts.filter((c) => selected.has(c.id)).length

/* Search box, then Select all and Clear, above either list. */
function Toolbar({ query, onQuery, placeholder, onSelectAll, onClear }) {
  return (
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1">
        <SearchInput
          value={query}
          onChange={onQuery}
          placeholder={placeholder}
          aria-label={placeholder}
        />
      </div>
      <Button variant="ghost" size="sm" onClick={onSelectAll}>
        {P.selectAll}
      </Button>
      <Button variant="ghost" size="sm" onClick={onClear}>
        {P.clear}
      </Button>
    </div>
  )
}

function Limited({ shown, total }) {
  if (shown >= total) return null
  return <p className="mt-2 text-2xs text-txt-3">{P.limited(shown, total)}</p>
}

const LIST = 'max-h-80 overflow-y-auto rounded-lg border border-line'

/* --- Accounts ------------------------------------------------------------ */

export function AccountsPicker({ members, selected, onChange }) {
  const A = CAMPAIGN_COPY.campaignModal.accountsPicker
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const matches = q ? members.filter((a) => a.name.toLowerCase().includes(q)) : members
  const shown = matches.slice(0, PICKER_ROW_LIMIT)
  const idsOf = (accounts) => accounts.flatMap((a) => a.contacts.map((c) => c.id))

  // Ticking a partly selected account selects all of it; unticking a fully
  // selected one clears all of it.
  const toggle = (account) => {
    const all = selectedIn(account, selected) === account.contacts.length
    onChange(withContacts(selected, account.contacts.map((c) => c.id), !all))
  }

  return (
    <div className="space-y-2.5">
      <Toolbar
        query={query}
        onQuery={setQuery}
        placeholder={A.search}
        onSelectAll={() => onChange(withContacts(selected, idsOf(matches), true))}
        onClear={() => onChange(withContacts(selected, idsOf(matches), false))}
      />

      <div className={LIST}>
        {shown.length === 0 ? (
          <p className="px-3 py-3 text-sm text-txt-3">
            {A.noMatch} “{query.trim()}”
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {shown.map((a) => {
              const total = a.contacts.length
              const on = selectedIn(a, selected)
              return (
                <li key={a.id}>
                  <label
                    className={cx(
                      'flex items-center gap-3 px-3 py-2 transition-colors duration-150 ease-lp',
                      total ? 'cursor-pointer hover:bg-surface-hover' : 'cursor-default',
                    )}
                  >
                    <Checkbox
                      checked={total > 0 && on === total}
                      indeterminate={on > 0 && on < total}
                      disabled={total === 0}
                      onChange={() => toggle(a)}
                      label={A.select(a.name)}
                    />
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block truncate text-sm font-name text-txt">{a.name}</span>
                      <span className="mt-0.5 block truncate text-2xs text-txt-3">{a.industry}</span>
                    </span>
                    <span className="shrink-0 text-2xs tabular-nums text-txt-3">
                      {total === 0
                        ? A.noContacts
                        : on === total
                          ? A.contacts(total)
                          : A.partial(on, total)}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <Limited shown={shown.length} total={matches.length} />
    </div>
  )
}

/* --- Contacts ------------------------------------------------------------ */

export function ContactsPicker({ members, selected, onChange }) {
  const C = CAMPAIGN_COPY.campaignModal.contactsPicker
  const [query, setQuery] = useState('')

  // Each account with the contacts that match the search. A company name
  // match brings in all of that company's contacts.
  const q = query.trim().toLowerCase()
  const groups = members
    .map((a) => ({
      account: a,
      contacts: !q || a.name.toLowerCase().includes(q)
        ? a.contacts
        : a.contacts.filter(
            (c) => c.name.toLowerCase().includes(q) || c.title.toLowerCase().includes(q),
          ),
    }))
    .filter((g) => g.contacts.length > 0)

  const matchIds = groups.flatMap((g) => g.contacts.map((c) => c.id))

  // Draw whole groups until the row limit is reached.
  const shownGroups = []
  let rows = 0
  for (const g of groups) {
    if (rows >= PICKER_ROW_LIMIT) break
    shownGroups.push(g)
    rows += g.contacts.length
  }

  const toggleGroup = (g) => {
    const ids = g.contacts.map((c) => c.id)
    const all = ids.every((id) => selected.has(id))
    onChange(withContacts(selected, ids, !all))
  }

  return (
    <div className="space-y-2.5">
      <Toolbar
        query={query}
        onQuery={setQuery}
        placeholder={C.search}
        onSelectAll={() => onChange(withContacts(selected, matchIds, true))}
        onClear={() => onChange(withContacts(selected, matchIds, false))}
      />

      <div className={LIST}>
        {shownGroups.length === 0 ? (
          <p className="px-3 py-3 text-sm text-txt-3">
            {C.noMatch} “{query.trim()}”
          </p>
        ) : (
          shownGroups.map((g) => {
            const ids = g.contacts.map((c) => c.id)
            const on = ids.filter((id) => selected.has(id)).length
            return (
              <section key={g.account.id} aria-label={g.account.name}>
                {/* The company heading stays in view while its contacts
                    scroll under it. */}
                <label className="sticky top-0 z-10 flex cursor-pointer items-center gap-3 border-b border-line bg-surface-sunken px-3 py-1.5">
                  <Checkbox
                    checked={on === ids.length}
                    indeterminate={on > 0 && on < ids.length}
                    onChange={() => toggleGroup(g)}
                    label={C.selectGroup(g.account.name)}
                  />
                  <span className="min-w-0 flex-1 truncate text-xs font-label text-txt">
                    {g.account.name}
                  </span>
                  <span className="shrink-0 text-2xs tabular-nums text-txt-3">
                    {C.groupCount(on, ids.length)}
                  </span>
                </label>
                <ul className="divide-y divide-line">
                  {g.contacts.map((c) => (
                    <li key={c.id}>
                      <label className="flex cursor-pointer items-center gap-3 py-2 pr-3 pl-6 transition-colors duration-150 ease-lp hover:bg-surface-hover">
                        <Checkbox
                          checked={selected.has(c.id)}
                          onChange={() => onChange(withContacts(selected, [c.id], !selected.has(c.id)))}
                          label={C.select(c.name)}
                        />
                        <span className="min-w-0 flex-1 leading-tight">
                          <span className="block truncate text-sm font-name text-txt">{c.name}</span>
                          <span className="mt-0.5 block truncate text-2xs text-txt-2">{c.title}</span>
                        </span>
                        <span className="max-w-[40%] shrink-0 truncate text-2xs text-txt-3">
                          {g.account.name}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })
        )}
      </div>
      <Limited shown={rows} total={matchIds.length} />
    </div>
  )
}
