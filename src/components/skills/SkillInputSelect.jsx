/**
 * The dropdown beside a skill's pill in the chat box: what the skill will
 * run on, e.g. "Account: Cummins". Its options come from inputOptions() in
 * src/lib/skillRuns.js. It subscribes to the saved lists and campaigns so
 * one added elsewhere shows up straight away.
 *
 * Rounded like the chips beside it. Nothing shows for a skill that runs on
 * the whole workspace, since there is nothing to choose.
 */
import LIBRARY from '../../../content/skills/library.json'
import { useCampaigns } from '../../lib/campaigns'
import { useSavedLists } from '../../lib/savedLists'
import { inputOptions } from '../../lib/skillRuns'
import { Icon } from '../Icon'

export function SkillInputSelect({ type, value, onChange }) {
  useSavedLists()
  useCampaigns()
  if (!type || type === 'workspace') return null

  const options = inputOptions(type)
  const label = LIBRARY.inputs[type]?.picker ?? type

  return (
    <label className="inline-flex h-7 max-w-full items-center gap-1.5 rounded-full border border-line bg-surface pr-2 pl-3 text-xs text-txt-2 transition-colors duration-150 ease-lp focus-within:border-accent hover:border-line-strong">
      <span className="shrink-0 text-txt-3">{label}:</span>
      <span className="relative flex min-w-0 items-center">
        <select
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 appearance-none truncate bg-transparent pr-4 text-xs font-name text-txt outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Icon name="chevronDown" className="pointer-events-none absolute right-0 size-3 text-txt-3" />
      </span>
    </label>
  )
}
