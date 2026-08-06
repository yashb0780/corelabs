/**
 * Small shared building blocks used on more than one screen.
 * Nothing here holds data and nothing here holds a hex color - colors come
 * from src/styles/tokens.css.
 */
import { Icon } from './Icon'
import { cx } from './cx'

/* --- Buttons ------------------------------------------------------------ */

const BUTTON_BASE =
  'inline-flex items-center gap-1.5 rounded-md text-sm font-medium transition-colors duration-150 ease-lp disabled:opacity-50 disabled:pointer-events-none'

const BUTTON_SIZES = {
  sm: 'h-7 px-2.5 text-xs',
  md: 'h-8 px-3',
}

const BUTTON_VARIANTS = {
  primary: 'bg-accent text-accent-txt hover:bg-accent-hover',
  secondary:
    'border border-line bg-surface text-txt-2 hover:bg-surface-hover hover:text-txt hover:border-line-strong',
  ghost: 'text-txt-2 hover:bg-surface-hover hover:text-txt',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className,
  ...rest
}) {
  return (
    <button
      type="button"
      className={cx(
        BUTTON_BASE,
        BUTTON_SIZES[size],
        BUTTON_VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} className="size-3.5 shrink-0" />}
      {children}
    </button>
  )
}

/* --- Pills -------------------------------------------------------------- */

/**
 * The rounded filter pills in the Leads filter row.
 * `count` is optional and renders as a muted number on the right.
 */
export function FilterPill({ active, count, children, ...rest }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cx(
        'inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors duration-150 ease-lp',
        active
          ? 'border-accent bg-accent-quiet text-accent'
          : 'border-line bg-surface text-txt-2 hover:border-line-strong hover:bg-surface-hover hover:text-txt',
      )}
      {...rest}
    >
      {children}
      {count !== undefined && (
        <span
          className={cx(
            'font-mono text-2xs tabular-nums',
            active ? 'text-accent' : 'text-txt-3',
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}

/**
 * The Decision Phase pill. `tone` maps onto the --lp-phase-* tokens.
 * Tailwind cannot build class names from a variable, so the colors are
 * applied inline from CSS variables - still no hex codes in this file.
 */
const PHASE_TONES = ['grey', 'blue', 'violet', 'amber', 'green', 'red']

export function PhasePill({ tone = 'grey', children, title }) {
  const safe = PHASE_TONES.includes(tone) ? tone : 'grey'
  return (
    <span
      title={title}
      className="inline-flex h-5.5 items-center rounded-full px-2 text-2xs font-medium whitespace-nowrap"
      style={{
        color: `var(--lp-phase-${safe})`,
        backgroundColor: `var(--lp-phase-${safe}-bg)`,
      }}
    >
      {children}
    </span>
  )
}

/* --- Text --------------------------------------------------------------- */

export function SectionLabel({ children, className }) {
  return <p className={cx('lp-label', className)}>{children}</p>
}

/** A neutral "this screen is not built yet" panel. */
export function EmptyState({ title, children }) {
  return (
    <div className="rounded-lg border border-line bg-surface px-6 py-12 text-center">
      <p className="text-lg font-semibold text-txt">{title}</p>
      {children && (
        <p className="mx-auto mt-1.5 max-w-md text-sm text-txt-2">{children}</p>
      )}
    </div>
  )
}
