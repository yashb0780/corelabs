/**
 * Things that sit above the page: a modal, a small row menu, and a toast.
 * Shared by any screen that needs them.
 *
 * None of them carries a shadow. The guardrails keep shadows to the
 * assistant widget alone, so a modal is lifted off the page by the dimmed
 * scrim behind it, and the toast by being solid accent.
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import { cx } from './cx'

const FOCUSABLE =
  'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

/* --- Modal -------------------------------------------------------------- */

/**
 * A centred dialog over a dimmed page. Escape or a click on the dimmed area
 * closes it, Tab stays inside it, and focus goes back to whatever opened it
 * when it closes. Render it only while open; closing unmounts it, so its
 * contents start fresh every time.
 *
 * `title` and `subtitle` sit in the header, `footer` is the button row.
 */
export function Modal({ title, subtitle, onClose, footer, children }) {
  const panelRef = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    const opener = document.activeElement
    const panel = panelRef.current
    // Focus the first field you can type in, otherwise the panel itself.
    // Read-only fields are skipped: focusing one scrolls it to the end and
    // hides the start of what it shows, such as a share link.
    const first =
      panel.querySelector('input:not([readonly]), textarea:not([readonly])') ??
      panel
    first.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        closeRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const items = [...panel.querySelectorAll(FOCUSABLE)]
      if (!items.length) return
      const firstItem = items[0]
      const lastItem = items[items.length - 1]
      if (e.shiftKey && document.activeElement === firstItem) {
        e.preventDefault()
        lastItem.focus()
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault()
        firstItem.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      // Without scrolling, so it cannot yank the page back up while
      // something else is scrolling a new item into view.
      opener?.focus?.({ preventScroll: true })
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-60 flex items-start justify-center overflow-y-auto bg-scrim px-4 pt-[12vh] pb-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="w-full max-w-md overflow-hidden rounded-xl border border-line bg-surface focus:outline-none"
      >
        <header className="flex items-start gap-3 border-b border-line px-4 py-3.5">
          <div className="min-w-0 flex-1">
            <h2 className="text-base text-txt">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 truncate text-xs text-txt-2">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 grid size-7 shrink-0 place-items-center rounded-md text-txt-3 transition-colors duration-150 ease-lp hover:bg-surface-hover hover:text-txt"
          >
            <Icon name="close" className="size-4" />
          </button>
        </header>

        <div className="px-4 py-3.5">{children}</div>

        {footer && (
          <footer className="flex items-center justify-end gap-2 border-t border-line bg-surface-sunken px-4 py-3">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}

/* --- Row menu ----------------------------------------------------------- */

/**
 * The "more actions" button at the end of a table row, and the small menu it
 * opens. `items` is [{ label, icon, onSelect }].
 *
 * The menu is positioned against the window rather than the table, because
 * the table scrolls sideways and would otherwise clip a menu on its last
 * rows. It closes on a click elsewhere, Escape, or any scroll.
 */
export function RowMenu({ label, items }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(null)
  const buttonRef = useRef(null)
  const menuRef = useRef(null)

  useLayoutEffect(() => {
    if (!open) return
    const r = buttonRef.current.getBoundingClientRect()
    const menuH = menuRef.current?.offsetHeight ?? 0
    // Open upward if there is no room below.
    const below = r.bottom + 4 + menuH <= window.innerHeight
    setPos({
      top: below ? r.bottom + 4 : r.top - 4 - menuH,
      right: window.innerWidth - r.right,
    })
    menuRef.current?.querySelector('[role="menuitem"]')?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    const onDown = (e) => {
      if (
        !menuRef.current?.contains(e.target) &&
        !buttonRef.current?.contains(e.target)
      ) {
        close()
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        close()
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  const onMenuKey = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const els = [...menuRef.current.querySelectorAll('[role="menuitem"]')]
    const i = els.indexOf(document.activeElement)
    const next = e.key === 'ArrowDown' ? i + 1 : i - 1
    els[(next + els.length) % els.length]?.focus()
  }

  return (
    // Clicks in here never reach the row underneath.
    <div onClick={(e) => e.stopPropagation()}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cx(
          'grid size-7 place-items-center rounded-md text-txt-3 transition-colors duration-150 ease-lp hover:bg-surface-hover hover:text-txt',
          open && 'bg-surface-hover text-txt',
        )}
      >
        <Icon name="more" className="size-4" />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKey}
          style={{
            top: pos?.top ?? -9999,
            right: pos?.right ?? 0,
          }}
          className="fixed z-40 min-w-44 rounded-lg border border-line-strong bg-surface py-1"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                item.onSelect()
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-txt-2 transition-colors duration-150 ease-lp hover:bg-accent-quiet hover:text-accent focus:bg-accent-quiet focus:text-accent focus:outline-none"
            >
              {item.icon && (
                <Icon name={item.icon} className="size-3.5 shrink-0" />
              )}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* --- Toast -------------------------------------------------------------- */

/**
 * A short confirmation at the bottom of the screen that clears itself.
 * Pass a new `toast` object ({ id, message }) to show one; a new id restarts
 * the timer, so two quick actions do not cut the second message short.
 */
const TOAST_MS = 3500

export function Toast({ toast, onDone }) {
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => doneRef.current(), TOAST_MS)
    return () => window.clearTimeout(t)
  }, [toast])

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-70 flex justify-center px-4"
    >
      {toast && (
        <div
          key={toast.id}
          role="status"
          className="pointer-events-auto flex max-w-lg items-center gap-2 rounded-lg bg-accent px-3.5 py-2.5 text-sm text-accent-txt"
        >
          <Icon name="check" className="size-4 shrink-0" />
          <span className="min-w-0">{toast.message}</span>
        </div>
      )}
    </div>
  )
}
