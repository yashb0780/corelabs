/**
 * SCREEN 1 - Company Search (the leads list).
 *
 * Opens on the full unfiltered set on purpose. We do not narrow the view
 * from the vendor profile automatically: that would quietly hide accounts
 * the user might want, with no way for them to know what was taken out.
 * Narrowing is something they choose, through "Refine by ICP", and when they
 * do the strip under the filter row says exactly what was applied and how
 * many companies it removed.
 *
 * The pieces this page uses:
 *   src/components/leads/FilterBar.jsx     the filter row
 *   src/components/leads/IcpRefineBar.jsx  what the refinement did
 *   src/components/leads/LeadsTable.jsx    the table
 *   src/lib/icp.js                         profile to filters, and applying them
 */
import { useMemo, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { FilterBar } from '../components/leads/FilterBar'
import { IcpRefineBar } from '../components/leads/IcpRefineBar'
import { LeadsTable } from '../components/leads/LeadsTable'
import { Button } from '../components/ui'
import { companies, DEFAULT_ARCHETYPE } from '../data/companies'
import { ICP_REFINE_COPY as COPY } from '../data/vendorProfile'
import { applyIcpFilters, deriveIcpFilters } from '../lib/icp'
import { useVendorProfile } from '../lib/profile'

export default function Leads() {
  const [activeSegment, setActiveSegment] = useState(null)
  const [archetype, setArchetype] = useState(DEFAULT_ARCHETYPE)
  const [refined, setRefined] = useState(false)

  const profile = useVendorProfile()
  const icpFilters = useMemo(() => deriveIcpFilters(profile), [profile])

  // Segment pills narrow first, then the ICP refinement runs on what is left,
  // so the removed count always describes this view rather than the whole set.
  const inSegment = activeSegment
    ? companies.filter((c) => c.segments.includes(activeSegment))
    : companies

  const { kept, removed } = refined
    ? applyIcpFilters(inSegment, icpFilters)
    : { kept: inSegment, removed: [] }

  const subtitle = refined
    ? `${COPY.applied} · ${kept.length} of ${inSegment.length} in view`
    : `All companies · ${inSegment.length} in view`

  return (
    <PageShell
      breadcrumb={['Workspace', 'Leads']}
      title="Company Search"
      subtitle={subtitle}
      actions={
        <Button
          variant={refined ? 'secondary' : 'primary'}
          icon={refined ? 'check' : 'filter'}
          onClick={() => setRefined((r) => !r)}
          className={refined ? 'border-accent text-accent' : undefined}
          aria-pressed={refined}
        >
          {refined ? COPY.applied : COPY.apply}
        </Button>
      }
    >
      <div className="lp-stack">
        <FilterBar
          activeSegment={activeSegment}
          onSegmentChange={setActiveSegment}
          archetype={archetype}
          onArchetypeChange={setArchetype}
        />

        {refined && (
          <IcpRefineBar
            filters={icpFilters}
            removedCount={removed.length}
            onClear={() => setRefined(false)}
          />
        )}

        <LeadsTable companies={kept} archetype={archetype} />
      </div>
    </PageShell>
  )
}
