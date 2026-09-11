/* ==========================================================================
   THE SAVED LISTS FOR THIS SESSION.

   Held at module scope, like the vendor profile, because lists can now be
   saved from Company Search and from the assistant, and have to show up on
   the Saved lists screen afterwards. Kept in that page's state they would
   be gone the moment you navigated there.

   In memory only. Nothing is persisted, so a reload goes back to
   src/data/savedLists.js. That keeps the no-localStorage guardrail intact.
   ========================================================================== */

import { useSyncExternalStore } from 'react'
import { SAVED_LISTS } from '../data/savedLists'
import { CURRENT_USER_ID } from '../data/teammates'

const listeners = new Set()
let lists = SAVED_LISTS
let nextId = 1

function set(next) {
  lists = next
  listeners.forEach((fn) => fn())
}

function subscribe(onChange) {
  listeners.add(onChange)
  return () => listeners.delete(onChange)
}

const getLists = () => lists

export function useSavedLists() {
  return useSyncExternalStore(subscribe, getLists, getLists)
}

/** Today as YYYY-MM-DD, in local time, to match the data file. */
function today() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/**
 * A new list at the top of Saved lists, created by the current user.
 * `companyIds` keeps the real companies a list was saved from; `seed` keeps
 * which saved list a copy was made from, so it generates the same accounts.
 */
export function addSavedList({ name, records, contacts, companyIds, seed }) {
  const list = {
    id: `saved-${nextId++}`,
    name,
    records,
    contacts,
    ...(companyIds ? { companyIds } : {}),
    ...(seed ? { seed } : {}),
    createdBy: CURRENT_USER_ID,
    assignedTo: null,
    lastModified: today(),
  }
  set([list, ...lists])
  return list
}

export function assignSavedLists(ids, teammateId) {
  set(lists.map((l) => (ids.includes(l.id) ? { ...l, assignedTo: teammateId } : l)))
}

/**
 * The saved list a message names, if any. Matching ignores case and
 * punctuation, so "Confirmed legacy ECC - Healthcare" finds "Confirmed
 * legacy ECC · Healthcare". If two names match, the longer one wins, so a
 * list whose name contains another's is not mistaken for it.
 */
const normalise = (s) => ` ${s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `

export function findListInPrompt(prompt) {
  const text = normalise(prompt)
  return lists
    .filter((l) => normalise(l.name).trim() && text.includes(normalise(l.name)))
    .sort((a, b) => b.name.length - a.name.length)[0]
}
