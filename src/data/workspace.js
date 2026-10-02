/* ==========================================================================
   WORKSPACE SETTINGS SET DURING ONBOARDING.

   Things the customer decides once, when their workspace is set up, and
   does not change from screen to screen.

   sellingAs   what kind of firm this workspace sells as. It decides the
               Window pill (see src/lib/window.js). One of the ids in
               SELLING_ARCHETYPES in src/data/companies.js:
               'migration-si', 'ecc-continuity' or 'alternative-erp'.

   Chat reads this rather than offering a "Selling as:" dropdown. Company
   Search still has its own dropdown for now.
   ========================================================================== */

import { DEFAULT_ARCHETYPE, SELLING_ARCHETYPES } from './companies'

export const WORKSPACE = {
  sellingAs: 'migration-si',
}

/** The workspace's selling archetype, or Migration SI if it is not a valid id. */
export function workspaceArchetype() {
  return SELLING_ARCHETYPES.some((a) => a.id === WORKSPACE.sellingAs)
    ? WORKSPACE.sellingAs
    : DEFAULT_ARCHETYPE
}
