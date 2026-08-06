/**
 * SCREEN 1 - Company Search (the leads list).
 *
 * This page only wires things together. The pieces it uses:
 *   src/components/leads/FilterBar.jsx   the filter row
 *   src/components/leads/LeadsTable.jsx  the table
 *   src/data/companies.js                the data
 */
import { useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { FilterBar } from '../components/leads/FilterBar'
import { LeadsTable } from '../components/leads/LeadsTable'
import { companies, DEFAULT_ARCHETYPE } from '../data/companies'

export default function Leads() {
  const [activeSegment, setActiveSegment] = useState(null)
  const [archetype, setArchetype] = useState(DEFAULT_ARCHETYPE)

  const visible = activeSegment
    ? companies.filter((c) => c.segments.includes(activeSegment))
    : companies

  return (
    <PageShell
      breadcrumb={['Workspace', 'Leads']}
      title="Company Search"
      subtitle={`SAP ECC migration signals · ${companies.length} companies matching your ICP`}
    >
      <div className="space-y-4">
        <FilterBar
          activeSegment={activeSegment}
          onSegmentChange={setActiveSegment}
          archetype={archetype}
          onArchetypeChange={setArchetype}
        />
        <LeadsTable companies={visible} archetype={archetype} />
      </div>
    </PageShell>
  )
}
