/**
 * Small shared building blocks used on more than one screen.
 * Nothing here holds data and nothing here holds a hex color, a font weight
 * or a padding value - those all come from src/styles/tokens.css.
 */
import { Icon } from './Icon'
import { cx } from './cx'

/* --- Buttons ------------------------------------------------------------ */

const BUTTON_BASE =
  'inline-flex items-center gap-1.5 rounded-md text-sm font-name transition-colors duration-150 ease-lp disabled:opacity-50 disabled:pointer-events-none'

const BUTTON_SIZES = {
  sm: 'h-7 px-2.5 text-xs',
  md: 'h-8 px-3',
}

const BUTTON_VARIANTS = {
  primary: 'bg-accent text-accent-txt hover:bg-accent-hover',
  secondary:
    'border border-line bg-surface text-txt-2 hover:bg-surface-hover hover:text-accent hover:border-accent',
  ghost: 'text-txt-2 hover:bg-surface-hover hover:text-accent',
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
 * `count` is optional and renders as a number on the right.
 */
export function FilterPill({ active, count, children, ...rest }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cx(
        'inline-flex h-7 items-center gap-1.5 rounded-full border px-3 text-xs font-name transition-colors duration-150 ease-lp',
        active
          ? 'border-accent bg-accent-quiet text-accent'
          : 'border-line bg-surface text-txt-2 hover:border-accent hover:bg-accent-quiet hover:text-accent',
      )}
      {...rest}
    >
      {children}
      {count !== undefined && (
        <span
          className={cx(
            'font-num tabular-nums text-2xs',
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
 * A status pill. Used for both Decision Phase and Window, which share the
 * tone palette in tokens.css.
 *
 * Tailwind cannot build class names from a variable, so the colors are
 * applied from CSS variables - still no hex codes in this file.
 */
const TONES = ['grey', 'blue', 'violet', 'amber', 'green', 'teal']

export function TonePill({ tone = 'grey', children, title }) {
  const safe = TONES.includes(tone) ? tone : 'grey'
  return (
    <span
      title={title}
      className="inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-label whitespace-nowrap"
      style={{
        color: `var(--lp-tone-${safe})`,
        backgroundColor: `var(--lp-tone-${safe}-bg)`,
      }}
    >
      {children}
    </span>
  )
}

/* --- Text --------------------------------------------------------------- */

/**
 * A section header. Pass `icon` to get the small accent-colored mark that
 * sits in front of the words on the account page.
 */
export function SectionLabel({ icon, children, className }) {
  return (
    <p className={cx('lp-label flex items-center gap-1.5', className)}>
      {icon && <Icon name={icon} className="size-3.5 shrink-0 text-accent" />}
      {children}
    </p>
  )
}

/** A neutral "this screen is not built yet" panel. */
export function EmptyState({ title, children }) {
  return (
    <div className="rounded-lg border border-line bg-surface px-6 py-10 text-center">
      <p className="text-lg font-label text-txt">{title}</p>
      {children && (
        <p className="mx-auto mt-1.5 max-w-md text-sm text-txt-2">{children}</p>
      )}
    </div>
  )
}
