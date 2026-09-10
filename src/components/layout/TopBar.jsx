/**
 * The top bar: breadcrumb on the left, search hint and dark-mode toggle on
 * the right.
 *
 * The breadcrumb is passed in by each page as an array of strings, e.g.
 * ['Workspace', 'Leads'].
 *
 * Anywhere in Settings the search becomes a settings search (see
 * SettingsSearch.jsx). Everywhere else it is the company search hint.
 */
import { Link, useLocation } from 'react-router-dom'
import { Icon } from '../Icon'
import { SettingsSearch } from './SettingsSearch'
import { isSettingsPath } from '../../lib/settings'
import { toggleTheme, useTheme } from '../../lib/theme'

/**
 * The theme itself lives in src/lib/theme.js, at module scope, so navigating
 * between pages cannot unmount it. This button only reads and flips it.
 */
function ThemeToggle() {
  const theme = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="flex size-7 items-center justify-center rounded-md border border-line text-txt-3 transition-colors duration-150 ease-lp hover:border-line-strong hover:bg-surface-hover hover:text-txt-2"
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="size-3.5" />
    </button>
  )
}

export function TopBar({ breadcrumb = [] }) {
  const { pathname } = useLocation()

  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-line bg-canvas px-4">
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5">
        {breadcrumb.map((crumb, i) => {
          const last = i === breadcrumb.length - 1
          // A crumb is either a plain string, or { label, to } to make it a
          // link back up the hierarchy.
          const label = typeof crumb === 'string' ? crumb : crumb.label
          const to = typeof crumb === 'string' ? null : crumb.to

          return (
            // Keyed by position as well as label: a trail can repeat a word,
            // e.g. Admin > Settings > Tenant > Settings.
            <span key={`${i}-${label}`} className="flex min-w-0 items-center gap-1.5">
              {to && !last ? (
                <Link
                  to={to}
                  className="truncate text-sm text-txt-3 transition-colors duration-150 ease-lp hover:text-txt"
                >
                  {label}
                </Link>
              ) : (
                <span
                  className={
                    last
                      ? 'truncate text-sm font-name text-txt'
                      : 'truncate text-sm text-txt-3'
                  }
                  aria-current={last ? 'page' : undefined}
                >
                  {label}
                </span>
              )}
              {!last && (
                <Icon name="chevronRight" className="size-3 text-txt-3" />
              )}
            </span>
          )
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-2">
        {isSettingsPath(pathname) ? (
          <SettingsSearch />
        ) : (
          <button
            type="button"
            className="flex h-8 items-center gap-2 rounded-md border border-line bg-surface pl-2.5 pr-1.5 text-xs text-txt-3 transition-colors duration-150 ease-lp hover:border-line-strong hover:bg-surface-hover hover:text-txt-2"
          >
            <Icon name="search" className="size-3.5" />
            <span className="hidden sm:inline">Search companies…</span>
            <kbd className="rounded border border-line bg-surface-sunken px-1 font-mono text-2xs text-txt-3">
              ⌘K
            </kbd>
          </button>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
