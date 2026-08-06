/* ==========================================================================
   EMPTY STATE COPY.

   What each section says when the research turned up nothing. Used by any
   company whose evidence is too thin to fill a section, which today means
   Cirrus Software (phase Unclassified).

   This is deliberate: a thin account should look honestly thin rather than
   quietly fabricated. Keep the wording factual. Say what was looked for and
   what was not found.
   ========================================================================== */

export const EMPTY_STATES = {
  brief:
    'No public product description found. The company does not run a public marketing site and has no filings on record.',
  signals:
    'Signals fired, but not enough independent families to weight a score with confidence.',
  phase:
    'Not enough hiring, filing or technographic evidence to place this account on the phase timeline.',
  landscape:
    'No ERP system of record identified. Nothing in technographic data, job postings or new-hire backgrounds names a platform.',
  momentum:
    'Too few public job postings across the trailing 90 days to count term frequency.',
  whyNow:
    'No timing trigger found. Nothing indicates a program, a budget cycle or a partner decision in progress.',
  ecosystem:
    'No adjacent platforms detected that would widen the scope of a future decision.',
  contacts:
    'No contacts mapped. No named IT, finance or transformation leadership found in public sources.',
  jobPostings:
    'No job postings found in the trailing 90 days.',
  facts: 'Not disclosed',
}
