/**
 * The "Selling as:" dropdown that sits to the right of the Filters button.
 *
 * Changing it re-computes the Window column and nothing else. The options
 * and the maths behind them live in src/data/companies.js
 * (SELLING_ARCHETYPES and computeWindow).
 */
import { SELLING_ARCHETYPES } from '../../data/companies'
import { Icon } from '../Icon'

export function ArchetypeSelector({ value, onChange }) {
  return (
    <label className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line bg-surface pl-2.5 pr-1.5 text-xs text-txt-2 transition-colors duration-150 ease-lp focus-within:border-line-strong hover:border-line-strong">
      <span className="text-txt-3">Selling as:</span>
      <span className="relative flex items-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-transparent pr-4 text-xs font-name text-txt outline-none"
        >
          {SELLING_ARCHETYPES.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevronDown"
          className="pointer-events-none absolute right-0 size-3 text-txt-3"
        />
      </span>
    </label>
  )
}
