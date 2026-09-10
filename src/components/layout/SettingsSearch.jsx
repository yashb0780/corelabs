/**
 * The top bar search while you are anywhere in Settings. It stands in for the
 * "Search companies" button there and looks the same, but it is a real box:
 * typing lists matching sections and settings underneath, and choosing one
 * opens it.
 *
 * The typed text is deliberately not kept anywhere lasting. Every page draws
 * its own top bar, so opening a result starts the next page with an empty box,
 * which is what you want after a search has done its job.
 */
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../Icon'
import { cx } from '../cx'
import { SETTINGS_SEARCH_COPY as COPY } from '../../data/sections'
import { searchSettings } from '../../lib/settings'

export function SettingsSearch() {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)

  const { sections, settings } = searchSettings(query)
  const results = [...sections, ...settings]
  const showList = open && query.trim() !== ''

  // The ⌘K hint only does something here. Everywhere else the search is
  // still the inert button it has always been.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const go = (result) => {
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
    navigate(result.to)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      setQuery('')
      setOpen(false)
      inputRef.current?.blur()
      return
    }
    if (!results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => (h + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => (h - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(results[Math.min(highlight, results.length - 1)])
    }
  }

  return (
    <div className="relative">
      <label className="flex h-8 w-56 items-center gap-2 rounded-md border border-line bg-surface pl-2.5 pr-1.5 text-xs text-txt-3 transition-colors duration-150 ease-lp focus-within:border-accent hover:border-line-strong sm:w-64">
        <Icon name="search" className="size-3.5 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls="settings-search-results"
          aria-activedescendant={
            showList && results.length
              ? `settings-search-${results[highlight]?.key}`
              : undefined
          }
          aria-label={COPY.placeholder}
          value={query}
          placeholder={COPY.placeholder}
          onChange={(e) => {
            setQuery(e.target.value)
            setHighlight(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent text-xs text-txt placeholder:text-txt-3 focus:outline-none"
        />
        <kbd className="rounded border border-line bg-surface-sunken px-1 font-mono text-2xs text-txt-3">
          ⌘K
        </kbd>
      </label>

      {showList && (
        <div
          id="settings-search-results"
          role="listbox"
          className="absolute right-0 top-full z-40 mt-1 w-full overflow-hidden rounded-lg border border-line-strong bg-surface py-1"
        >
          {results.length === 0 ? (
            <p className="px-3 py-2 text-xs text-txt-3">
              {COPY.noMatch} “{query.trim()}”
            </p>
          ) : (
            results.map((r, i) => (
              <button
                key={r.key}
                id={`settings-search-${r.key}`}
                type="button"
                role="option"
                aria-selected={i === highlight}
                // mousedown, not click, so it fires before the input's blur
                // closes the list.
                onMouseDown={(e) => {
                  e.preventDefault()
                  go(r)
                }}
                onMouseEnter={() => setHighlight(i)}
                className={cx(
                  'flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors duration-150 ease-lp',
                  i === highlight
                    ? 'bg-accent-quiet text-accent'
                    : 'text-txt-2',
                )}
              >
                <Icon name={r.icon} className="size-3.5 shrink-0 text-txt-3" />
                <span className="truncate font-name text-txt">{r.label}</span>
                <span className="ml-auto shrink-0 text-2xs text-txt-3">
                  {r.hint}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
