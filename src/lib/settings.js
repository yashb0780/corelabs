/**
 * Settings: which section you are in, the breadcrumb that leads to it, and
 * the settings search. Pure logic, no UI. The lists themselves live in
 * src/data/sections.js.
 */
import {
  SECTIONS,
  SETTINGS_BREADCRUMB,
  SETTINGS_NAV,
  SETTINGS_SEARCH_COPY,
} from '../data/sections'

const SETTINGS_HOME = SETTINGS_NAV[0]

export function getSettingsNav(id) {
  return SETTINGS_NAV.find((n) => n.id === id)
}

/** The settings section that shows a given group of cards from SECTIONS. */
export function settingsNavForSection(sectionId) {
  return SETTINGS_NAV.find((n) => n.section === sectionId)
}

/**
 * Where a settings section lives. Anything unrecognised goes to the Settings
 * home rather than a dead end, which is what the old /admin/* links need.
 * The old /admin/settings meant the Settings page itself, hence the alias.
 */
export function settingsPath(id) {
  if (id === 'settings') return SETTINGS_HOME.path
  return (getSettingsNav(id) ?? SETTINGS_HOME).path
}

/**
 * Admin > Settings > Section, each linked back up. A page adds its own last
 * crumb after these. On the Settings page itself the section is the last
 * crumb, and the top bar does not link the last crumb.
 */
export function settingsCrumbs(navId) {
  const nav = getSettingsNav(navId) ?? SETTINGS_HOME
  return [
    SETTINGS_BREADCRUMB.root,
    { label: SETTINGS_BREADCRUMB.label, to: SETTINGS_HOME.path },
    { label: nav.label, to: nav.path },
  ]
}

/**
 * True anywhere counts as "in Settings", which is where the sidebar shows the
 * settings list and the top bar searches settings: the Settings page itself,
 * the card pages that open from it (/tenant/users and so on, which kept their
 * original addresses), and the old addresses that forward into Settings.
 */
const CARD_PREFIXES = SECTIONS.map((s) => `/${s.id}/`)
const LEGACY_PATHS = SETTINGS_NAV.map((n) => n.legacyPath).filter(Boolean)

export function isSettingsPath(pathname) {
  return (
    pathname === SETTINGS_HOME.path ||
    pathname.startsWith(`${SETTINGS_HOME.path}/`) ||
    pathname.startsWith('/admin/') ||
    LEGACY_PATHS.includes(pathname) ||
    CARD_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  )
}

/**
 * Which item in the settings sidebar to highlight. A section's own address
 * wins; a card page highlights the section its card sits in, so
 * /tenant/users lights Tenant and /settings/emails lights General.
 */
export function activeSettingsNavId(pathname) {
  const exact = SETTINGS_NAV.find((n) => n.path === pathname)
  if (exact) return exact.id
  const owner = SETTINGS_NAV.find(
    (n) => n.section && pathname.startsWith(`/${n.section}/`),
  )
  return (owner ?? SETTINGS_HOME).id
}

/**
 * Where the back chevron at the top of the settings sidebar goes: the last
 * screen you were on before you entered Settings, or Leads if you opened
 * Settings directly.
 *
 * Kept here at module scope rather than in a component, the same way the
 * theme is, so that nothing unmounting can lose it. Browser "back" is not
 * used on purpose: after moving between sections it would only step back to
 * the previous section.
 */
const FALLBACK_RETURN_PATH = '/leads'
let returnPath = null

export function rememberReturnPath(path) {
  returnPath = path
}

export function settingsReturnPath() {
  return returnPath ?? FALLBACK_RETURN_PATH
}

/**
 * Matches section names and setting names (card labels), ignoring case.
 * A setting's hint is the section it sits in, so "RFPs" under Vendor and
 * "RFPs" under Customer can be told apart. Opening a setting goes where
 * clicking its card goes.
 */
export function searchSettings(query) {
  const q = query.trim().toLowerCase()
  if (!q) return { sections: [], settings: [] }

  const sections = SETTINGS_NAV.filter((n) =>
    n.label.toLowerCase().includes(q),
  ).map((n) => ({
    key: `section-${n.id}`,
    label: n.label,
    hint: SETTINGS_SEARCH_COPY.sectionHint,
    icon: n.icon,
    to: n.path,
  }))

  const settings = SETTINGS_NAV.flatMap((n) => {
    const section = SECTIONS.find((s) => s.id === n.section)
    if (!section) return []
    return section.cards
      .filter((c) => c.label.toLowerCase().includes(q))
      .map((c) => ({
        key: `setting-${section.id}-${c.id}`,
        label: c.label,
        hint: n.label,
        icon: c.icon,
        to: `/${section.id}/${c.id}`,
      }))
  })

  return { sections, settings }
}
