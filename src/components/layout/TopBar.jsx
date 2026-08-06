/**
 * The top bar: breadcrumb on the left, search hint and dark-mode toggle on
 * the right.
 *
 * The breadcrumb is passed in by each page as an array of strings, e.g.
 * ['Workspace', 'Leads'].
 */
import { useEffect, useState } from 'react'
import { Icon } from '../Icon'

/** Reads the saved theme once on load, defaulting to light. */
function readTheme() {
  if (typeof window === 'undefined') return 'light'
  return window.localStorage.getItem('lp-theme') === 'dark' ? 'dark' : 'light'
}

function ThemeToggle() {
  const [theme, setTheme] = useState(readTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('lp-theme', theme)
  }, [theme])

  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="flex size-7 items-center justify-center rounded-md border border-line text-txt-3 transition-colors duration-150 ease-lp hover:border-line-strong hover:bg-surface-hover hover:text-txt-2"
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="size-3.5" />
    </button>
  )
}

export function TopBar({ breadcrumb = [] }) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-line bg-canvas px-4">
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5">
        {breadcrumb.map((crumb, i) => {
          const last = i === breadcrumb.length - 1
          return (
            <span key={crumb} className="flex min-w-0 items-center gap-1.5">
              <span
                className={
                  last
                    ? 'truncate text-sm font-name text-txt'
                    : 'truncate text-sm text-txt-3'
                }
                aria-current={last ? 'page' : undefined}
              >
                {crumb}
              </span>
              {!last && (
                <Icon name="chevronRight" className="size-3 text-txt-3" />
              )}
            </span>
          )
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className="flex h-7 items-center gap-2 rounded-md border border-line bg-surface pl-2.5 pr-1.5 text-xs text-txt-3 transition-colors duration-150 ease-lp hover:border-line-strong hover:bg-surface-hover hover:text-txt-2"
        >
          <Icon name="search" className="size-3.5" />
          <span className="hidden sm:inline">Search companies…</span>
          <kbd className="rounded border border-line bg-surface-sunken px-1 font-mono text-2xs text-txt-3">
            ⌘K
          </kbd>
        </button>
        <ThemeToggle />
      </div>
    </header>
  )
}
