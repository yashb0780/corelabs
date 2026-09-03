/* ==========================================================================
   THE VENDOR PROFILE THE USER IS EDITING.

   Held at module scope, above the router, for the same reason the theme is:
   every page renders its own PageShell, so anything kept in a page's state
   is destroyed the moment you navigate. The profile has to outlive that,
   because Company Search reads it.

   In memory only. Nothing is persisted, so a reload starts again from the
   scrape result. That is fine for a prototype and keeps the no-localStorage
   guardrail intact.
   ========================================================================== */

import { useSyncExternalStore } from 'react'
import { EMPTY_VENDOR_PROFILE, SCRAPE_RESULT } from '../data/vendorProfile'

const listeners = new Set()

/**
 * Start from every field empty, then lay the scrape over the top. A key the
 * scrape did not return, or returned as null or blank, stays empty. Nothing
 * is substituted, because a guessed value looks confirmed to the user.
 */
function fromScrape() {
  const profile = { ...EMPTY_VENDOR_PROFILE }
  if (!SCRAPE_RESULT) return profile

  for (const [key, value] of Object.entries(SCRAPE_RESULT)) {
    if (!(key in profile)) continue
    if (value === null || value === undefined || value === '') continue
    if (Array.isArray(value) && value.length === 0) continue
    profile[key] = value
  }
  return profile
}

/** Whether the scrape gave us anything at all, for the helper text. */
export const scrapeFoundSomething =
  Boolean(SCRAPE_RESULT) && Object.keys(SCRAPE_RESULT).length > 0

let profile = fromScrape()

export function getVendorProfile() {
  return profile
}

export function setVendorProfile(next) {
  profile = next
  listeners.forEach((fn) => fn())
}

function subscribe(onChange) {
  listeners.add(onChange)
  return () => listeners.delete(onChange)
}

export function useVendorProfile() {
  return useSyncExternalStore(subscribe, getVendorProfile, getVendorProfile)
}
