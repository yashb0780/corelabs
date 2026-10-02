/**
 * The searchable list of skills that opens from the chat box, either from
 * the "/" button or by typing "/" at the start of a message.
 *
 * The chat box owns the search text and which row is highlighted, so the
 * arrow keys and Enter work whether you are typing in the message box
 * ("/acc") or in this list's own search field (opened from the button).
 * This component only draws.
 *
 * Grouped under the same categories as the Skills library. Like the other
 * popovers it is lifted by a stronger border, not a shadow.
 */
import { useEffect, useRef } from 'react'
import LIBRARY from '../../../content/skills/library.json'
import { cx } from '../cx'
import { SearchInput } from '../form'
import { ScopeBadge } from './ScopeBadge'

export function SkillPicker({
  skills,
  active,
  onPick,
  onHover,
  query,
  onQueryChange,
  onKeyDown,
  withSearch,
  placement = 'above',
}) {
  const searchRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (withSearch) searchRef.current?.focus()
  }, [withSearch])

  // Keep the highlighted row in view as the arrow keys move it.
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const groups = LIBRARY.categories
    .map((c) => ({ ...c, skills: skills.filter((s) => s.category === c.id) }))
    .filter((g) => g.skills.length)

  return (
    <div
      className={cx(
        'absolute left-0 z-30 w-full max-w-md overflow-hidden rounded-lg border border-line-strong bg-surface',
        placement === 'above' ? 'bottom-full mb-2' : 'top-full mt-2',
      )}
    >
      {withSearch && (
        <div className="border-b border-line p-2">
          <SearchInput
            inputRef={searchRef}
            value={query}
            onChange={onQueryChange}
            onKeyDown={onKeyDown}
            placeholder={LIBRARY.picker.search}
            aria-label={LIBRARY.picker.search}
          />
        </div>
      )}
      <div ref={listRef} role="listbox" aria-label={LIBRARY.picker.label} className="max-h-72 overflow-y-auto py-1.5">
        {groups.length === 0 && <p className="px-3 py-2 text-sm text-txt-3">{LIBRARY.picker.noMatch}</p>}
        {groups.map((g) => (
          <div key={g.id} className="pb-1">
            <p className="lp-label px-3 pt-1.5 pb-1">{g.label}</p>
            {g.skills.map((s) => {
              const on = skills.indexOf(s) === active
              return (
                <button
                  key={s.id}
                  type="button"
                  role="option"
                  aria-selected={on}
                  data-active={on}
                  // Mouse down, not click, so the message box keeps focus.
                  onMouseDown={(e) => {
                    e.preventDefault()
                    onPick(s)
                  }}
                  onMouseEnter={() => onHover(skills.indexOf(s))}
                  className={cx(
                    'flex w-full items-center gap-3 px-3 py-1.5 text-left transition-colors duration-150 ease-lp',
                    on && 'bg-surface-hover',
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-name text-txt">/{s.name}</span>
                    <span className="block truncate text-2xs text-txt-3">{s.description}</span>
                  </span>
                  <ScopeBadge scope={s.scope} />
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
