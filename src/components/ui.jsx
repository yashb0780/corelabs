/**
 * Small shared building blocks used on more than one screen.
 * Nothing here holds data and nothing here holds a hex color, a font weight
 * or a padding value - those all come from src/styles/tokens.css.
 */
import { useState } from 'react'
import { Icon } from './Icon'
import { cx } from './cx'
import { logoSrc } from '../lib/logo'

/* --- Buttons ------------------------------------------------------------ */

const BUTTON_BASE =
  'inline-flex items-center gap-1.5 rounded-md text-sm font-name transition-colors duration-150 ease-lp disabled:pointer-events-none'

const BUTTON_SIZES = {
  sm: 'h-7 px-2.5 text-xs',
  md: 'h-8 px-3',
}

const BUTTON_VARIANTS = {
  // Disabled primary is the accent at 40%, which is why it does not just
  // dim the whole button the way the other two variants do.
  primary:
    'bg-accent text-accent-txt hover:bg-accent-hover active:bg-accent-pressed disabled:bg-accent-disabled',
  secondary:
    'border border-line bg-surface text-txt-2 hover:bg-surface-hover hover:text-accent hover:border-accent disabled:opacity-50',
  ghost: 'text-txt-2 hover:bg-surface-hover hover:text-accent disabled:opacity-50',
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
const TONES = ['grey', 'blue', 'accent', 'amber', 'green', 'teal']

/**
 * `dashed` is used by the two "we could not tell" states, Unclassified and
 * Unknown: no fill, dashed outline, so they read as absent rather than as
 * just another status.
 */
export function TonePill({ tone = 'grey', dashed = false, children, title }) {
  const safe = TONES.includes(tone) ? tone : 'grey'
  return (
    <span
      title={title}
      className={cx(
        'inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-label whitespace-nowrap',
        dashed && 'border border-dashed',
      )}
      style={{
        color: `var(--lp-tone-${safe})`,
        backgroundColor: dashed ? 'transparent' : `var(--lp-tone-${safe}-bg)`,
        borderColor: dashed ? `var(--lp-tone-${safe})` : undefined,
      }}
    >
      {children}
    </span>
  )
}

/** A small neutral chip. Used for state markers and counts. */
export function Chip({ children, title, className }) {
  return (
    <span
      title={title}
      className={cx(
        'inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-2xs font-name text-txt-2 whitespace-nowrap',
        className,
      )}
    >
      {children}
    </span>
  )
}

/* --- Company logo ------------------------------------------------------- */

/**
 * The company logo, fetched from a CDN by domain (see src/lib/logo.js).
 *
 * Every logo sits in a fixed rounded square with the image contained inside
 * it, so brand marks with wildly different aspect ratios do not make rows
 * taller or wider than one another.
 *
 * If the CDN has no logo for that domain the request 404s, onError fires and
 * the monogram tile takes over. A broken image is never shown, and with no
 * network at all every company falls back cleanly.
 */
export function CompanyLogo({ company, size = 7 }) {
  const [failed, setFailed] = useState(false)
  const src = logoSrc(company)

  // size is a Tailwind spacing step: the box, and the image inside it.
  const box = size === 9 ? 'size-9' : 'size-7'
  const inner = size === 9 ? 'size-7' : 'size-5'

  if (!src || failed) {
    return (
      <span
        aria-hidden="true"
        className={cx(
          'grid shrink-0 place-items-center rounded-md text-2xs font-num text-accent-txt',
          box,
        )}
        style={{ backgroundColor: company.monogramColor }}
      >
        {company.monogram}
      </span>
    )
  }

  return (
    <span
      className={cx(
        'grid shrink-0 place-items-center overflow-hidden rounded-md border border-line bg-surface',
        box,
      )}
    >
      {/* Not lazy: the table is short, every row is near the fold, and lazy
          loading only delays the logos appearing. */}
      <img
        src={src}
        alt=""
        onError={() => setFailed(true)}
        className={cx('object-contain', inner)}
      />
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

/**
 * The shell every account page section sits in: label with an icon, a thin
 * divider under it, consistent padding. `aside` renders at the top right of
 * the card, level with the label.
 */
export function SectionCard({ icon, label, aside, children, className }) {
  return (
    <section className={cx('lp-card', className)}>
      <div className="flex items-center justify-between gap-3 pb-2">
        <SectionLabel icon={icon}>{label}</SectionLabel>
        {aside && <div className="flex shrink-0 items-center gap-2">{aside}</div>}
      </div>
      <div className="border-t border-line pt-[var(--lp-label-gap)]">
        {children}
      </div>
    </section>
  )
}

/**
 * What a section shows when the research found nothing. Deliberately plain:
 * it should read as an honest gap, not as a styled feature.
 */
export function EmptyNote({ children }) {
  return (
    <p className="rounded-md border border-dashed border-line px-3 py-2.5 text-sm text-txt-3">
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
