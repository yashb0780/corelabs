/* ==========================================================================
   SEGMENTS - the pills in the filter row on the Leads screen.

   TO ADD A SEGMENT: add an entry below, then add its `id` to the `segments`
   array of any company in companies.js that belongs to it. The counts in the
   pills are worked out automatically, so you never edit a number by hand.
   ========================================================================== */

import { companies } from './companies'

export const segments = [
  {
    id: 'fico',
    label: 'Finance-first (FICO)',
    description:
      'Finance leads the migration. FICO scope first, logistics follows.',
  },
  {
    id: 'scm',
    label: 'Supply chain (SCM)',
    description:
      'Supply chain pain is the trigger. Planning and logistics modules first.',
  },
  {
    id: 'greenfield',
    label: 'Greenfield / net-new',
    description:
      'Building a clean core rather than converting the existing system.',
  },
  {
    id: 'multi-erp',
    label: 'Multi-ERP consolidation',
    description:
      'Several ERPs from acquisitions being folded into one instance.',
  },
]

/** How many companies are in a segment. Counted, never hand-typed. */
export function segmentCount(segmentId) {
  return companies.filter((c) => c.segments.includes(segmentId)).length
}

/** The segment list with counts attached, ready for the filter row. */
export function segmentsWithCounts() {
  return segments.map((s) => ({ ...s, count: segmentCount(s.id) }))
}

export function getSegment(id) {
  return segments.find((s) => s.id === id)
}
