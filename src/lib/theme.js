/* ==========================================================================
   THEME STATE.

   Light or dark, and nothing else. No colours live here: those are all in
   src/styles/tokens.css, which switches on the `data-theme` attribute this
   file sets on the root <html> element.

   WHY THIS IS A MODULE AND NOT A COMPONENT
   The toggle used to hold the theme in useState inside TopBar. Every page
   renders its own PageShell, which renders TopBar, so navigating from the
   list to an account unmounted the toggle, reset the state to light, and
   wrote light back onto <html>. Dark mode did not survive a click.

   Keeping the value at module scope puts it above the router, so nothing
   that React unmounts can take it with it. Components read it through
   useTheme() and are re-rendered by useSyncExternalStore when it changes.

   ON localStorage
   The guardrails otherwise rule out localStorage. Remembering the theme is
   a sanctioned exception, added deliberately. It stores one key, `lp-theme`,
   holding the string "light" or "dark". No user data, nothing else.
   ========================================================================== */

import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'lp-theme'

/** Anything subscribed through useTheme(), so they can be told to re-render. */
const listeners = new Set()

/**
 * First value on a cold load: whatever was saved, and if nothing was ever
 * saved, whatever the operating system prefers.
 */
function readInitialTheme() {
  if (typeof window === 'undefined') return 'light'

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Private browsing and similar can throw on access. Fall through to the
    // system preference rather than breaking the page.
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

let theme = readInitialTheme()

/** The tokens key off this attribute, so it has to sit on <html>. */
function applyToDocument(value) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', value)
  }
}

// Runs on import, which happens before React paints anything, so the first
// render is already in the right theme.
applyToDocument(theme)

export function getTheme() {
  return theme
}

export function subscribeToTheme(onChange) {
  listeners.add(onChange)
  return () => listeners.delete(onChange)
}

export function setTheme(value) {
  if (value !== 'light' && value !== 'dark') return
  theme = value
  applyToDocument(theme)

  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Not being able to remember it is survivable. The toggle still works
    // for this session.
  }

  listeners.forEach((fn) => fn())
}

export function toggleTheme() {
  setTheme(theme === 'dark' ? 'light' : 'dark')
}

/** Read the theme from a component and re-render when it changes. */
export function useTheme() {
  return useSyncExternalStore(subscribeToTheme, getTheme, getTheme)
}
