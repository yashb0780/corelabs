/**
 * The filter row above the leads table:
 *
 *   [Filters] [Selling as: ...]   (All 9) (segment pills…)   [Save as segment] [Lead Assist]
 *
 * The segment pills and their counts come from src/data/segments.js.
 */
import { companies } from '../../data/companies'
import { segmentsWithCounts } from '../../data/segments'
import { Button, FilterPill } from '../ui'
import { ArchetypeSelector } from './ArchetypeSelector'

export function FilterBar({
  activeSegment,
  onSegmentChange,
  archetype,
  onArchetypeChange,
}) {
  const pills = segmentsWithCounts()

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button icon="filter">Filters</Button>

      <ArchetypeSelector value={archetype} onChange={onArchetypeChange} />

      <span aria-hidden="true" className="mx-1 h-5 w-px bg-line" />

      <FilterPill
        active={activeSegment === null}
        count={companies.length}
        onClick={() => onSegmentChange(null)}
      >
        All
      </FilterPill>

      {pills.map((s) => (
        <FilterPill
          key={s.id}
          active={activeSegment === s.id}
          count={s.count}
          title={s.description}
          onClick={() => onSegmentChange(activeSegment === s.id ? null : s.id)}
        >
          {s.label}
        </FilterPill>
      ))}

      <div className="ml-auto flex items-center gap-2">
        <Button icon="plus">Save as segment</Button>
        <Button variant="primary" icon="sparkle">
          Lead Assist
        </Button>
      </div>
    </div>
  )
}
