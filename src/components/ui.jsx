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

// Buttons and badges both sit at text-xs, which the scale defines as 14px.
const BUTTON_BASE =
  'inline-flex items-center gap-1.5 rounded-md text-xs font-name transition-colors duration-150 ease-lp disabled:pointer-events-none'

const BUTTON_SIZES = {
  sm: 'h-7 px-2.5',
  md: 'h-9 px-3',
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
        'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-name transition-colors duration-150 ease-lp',
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
 * The rounded suggestion pill first used under the assistant's greeting.
 * The campaign action pills (Start a campaign, Save as a list, Enrich
 * contacts) use it too, in the assistant and on Company Search, so the two
 * read as one system. With an `icon` it lays the icon out in front.
 */
export function ActionPill({ icon, children, className, ...rest }) {
  return (
    <button
      type="button"
      className={cx(
        'rounded-full border border-line bg-surface px-3 py-1.5 text-left text-xs text-txt-2 transition-colors duration-150 ease-lp hover:border-accent hover:bg-accent-quiet hover:text-accent',
        icon && 'inline-flex items-center gap-1.5 whitespace-nowrap',
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} className="size-3.5 shrink-0" />}
      {children}
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
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-name whitespace-nowrap',
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
        'inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-0.5 text-xs font-name text-txt-2 whitespace-nowrap',
        className,
      )}
    >
      {children}
    </span>
  )
}

/* --- Tabs --------------------------------------------------------------- */

/**
 * A row of tabs that switches what a page shows, first used on a
 * campaign's page. Navigation, not a form choice, so it is not the
 * SegmentedControl. `tabs` is [{ id, label, count }]; `count` is optional.
 *
 * Each panel the page renders should carry
 *   role="tabpanel" id={`${idPrefix}-panel-${id}`} aria-labelledby={`${idPrefix}-tab-${id}`}
 * The arrow keys move between tabs, as screen reader users expect.
 */
export function Tabs({ tabs, value, onChange, label, idPrefix = 'tabs' }) {
  const onKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const i = tabs.findIndex((t) => t.id === value)
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]
    onChange(next.id)
    e.currentTarget.querySelector(`#${idPrefix}-tab-${next.id}`)?.focus()
  }

  return (
    <div role="tablist" aria-label={label} onKeyDown={onKey} className="flex gap-5 overflow-x-auto border-b border-line">
      {tabs.map((t) => {
        const on = t.id === value
        return (
          <button
            key={t.id}
            id={`${idPrefix}-tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={on}
            aria-controls={`${idPrefix}-panel-${t.id}`}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(t.id)}
            className={cx(
              '-mb-px inline-flex shrink-0 items-center gap-1.5 border-b-2 pt-1 pb-2.5 text-sm font-name whitespace-nowrap transition-colors duration-150 ease-lp',
              on ? 'border-accent text-txt' : 'border-transparent text-txt-3 hover:text-txt-2',
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span className="text-2xs font-num tabular-nums text-txt-3">{t.count.toLocaleString('en-US')}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/* --- Person avatar ------------------------------------------------------ */

/**
 * A round initials avatar for a teammate. Its colour is one of the tones in
 * tokens.css, set on the person in src/data/teammates.js. Pass no person to
 * get the empty dashed circle used for "Unassigned".
 */
export function Avatar({ person, size = 'sm' }) {
  const box = size === 'md' ? 'size-7 text-2xs' : 'size-5.5 text-2xs'

  if (!person) {
    return (
      <span
        aria-hidden="true"
        className={cx(
          'inline-block shrink-0 rounded-full border border-dashed border-line-strong',
          box,
        )}
      />
    )
  }

  const tone = TONES.includes(person.tone) ? person.tone : 'grey'
  const initials = person.name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

  return (
    <span
      aria-hidden="true"
      className={cx(
        'grid shrink-0 place-items-center rounded-full font-name',
        box,
      )}
      style={{
        color: `var(--lp-tone-${tone})`,
        backgroundColor: `var(--lp-tone-${tone}-bg)`,
      }}
    >
      {initials}
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
