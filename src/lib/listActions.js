/**
 * What an action pill acts on: its "scope". Pure logic, no UI.
 *
 * Every pill, wherever it is shown, is handed one of these:
 *   { name, nameFor, saveName, accounts, contacts, companyIds | seed }
 *     name        what a campaign is called by default
 *     nameFor(n)  the same default for n accounts, so the name can follow
 *                 the Accounts picker. Absent when the name has no count
 *                 in it, such as a saved list's name.
 *     saveName    what a saved list is called by default
 *     accounts    how many accounts are in scope
 *     contacts    how many contacts those accounts have
 *     companyIds  the real companies behind it (Company Search), or
 *     seed        the saved list whose generated accounts are behind it
 *
 * src/lib/listMembers.js turns companyIds or seed into the actual accounts
 * and contacts.
 */
import { CAMPAIGN_COPY as COPY } from '../data/campaigns'

const contactsOf = (companies) => companies.reduce((sum, c) => sum + c.contacts.length, 0)

/** Accounts ticked in the Company Search table. */
export function scopeForCompanies(companies) {
  const name = COPY.selectionName(companies.length)
  return {
    name,
    nameFor: COPY.selectionName,
    saveName: name,
    accounts: companies.length,
    contacts: contactsOf(companies),
    companyIds: companies.map((c) => c.id),
  }
}

/**
 * A saved list the assistant recognised in a message. A list saved from
 * Company Search keeps its real companies; any other list's accounts are
 * generated, seeded by the list it came from.
 */
export function scopeForList(list) {
  return {
    name: list.name,
    saveName: COPY.listCopyName(list.name),
    accounts: list.records,
    contacts: list.contacts ?? 0,
    ...(list.companyIds ? { companyIds: list.companyIds } : { seed: list.seed ?? list.id }),
  }
}

/**
 * The accounts in view on Company Search, for an assistant reply to a
 * message that named no list.
 */
export function scopeForView(companies) {
  const name = COPY.viewName(companies.length)
  return {
    name,
    nameFor: COPY.viewName,
    saveName: name,
    accounts: companies.length,
    contacts: contactsOf(companies),
    companyIds: companies.map((c) => c.id),
  }
}
