/* ==========================================================================
   WHAT IS IN VIEW ON COMPANY SEARCH.

   The assistant sits outside the pages, so it cannot see the Leads page's
   filters. The Leads page reports the companies it is showing here, after
   any segment or Refine by ICP, and the assistant reads them when a reply
   needs "the accounts in view".

   When Company Search is not open, "in view" is the full unfiltered set,
   which is exactly what it shows the moment it opens. Held at module
   scope, in memory only.
   ========================================================================== */

import { companies } from '../data/companies'

let inView = null

export function setLeadsInView(list) {
  inView = list
}

export function getLeadsInView() {
  return inView ?? companies
}
