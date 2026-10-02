/**
 * The chat composer: a text box, the "Selling as:" dropdown, the "/" skills
 * button and a send button. Used large on the New chat page and pinned to
 * the bottom of a thread, so the two always look the same.
 *
 * Enter sends, Shift+Enter starts a new line. The box grows with what is
 * typed, up to a limit, then scrolls.
 *
 * The "/" button only shows a placeholder note for now. The skills picker
 * it will open is Phase 2.
 */
import { useEffect, useRef, useState } from 'react'
import HOME from '../../../content/chat/home.json'
import { Icon } from '../Icon'
import { cx } from '../cx'
import { ArchetypeSelector } from '../leads/ArchetypeSelector'

/** Tallest the box grows before it scrolls, in lines. */
const MAX_LINES = 8

function SkillsButton() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  // Close on a click anywhere else, or on Escape. Escape stops here, so it
  // does not also close the company panel behind the note.
  useEffect(() => {
    if (!open) return
    const onDown = (e) => !wrapRef.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      e.stopPropagation()
      setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={HOME.skillsButtonLabel}
        aria-expanded={open}
        title={HOME.skillsButtonLabel}
        className={cx(
          'grid size-9 place-items-center rounded-md border font-mono text-sm transition-colors duration-150 ease-lp',
          open
            ? 'border-accent bg-accent-quiet text-accent'
            : 'border-line bg-surface text-txt-3 hover:border-line-strong hover:text-txt-2',
        )}
      >
        /
      </button>
      {open && (
        <div
          role="note"
          className="absolute bottom-full left-0 z-20 mb-2 w-72 rounded-lg border border-line-strong bg-surface px-3.5 py-3"
        >
          <p className="text-sm font-name text-txt">{HOME.skillsPlaceholder.title}</p>
          <p className="mt-1 text-2xs text-txt-2">{HOME.skillsPlaceholder.body}</p>
        </div>
      )}
    </div>
  )
}

export function Composer({
  size = 'lg',
  placeholder,
  archetype,
  onArchetypeChange,
  onSend,
  busy = false,
  autoFocus = false,
}) {
  const [draft, setDraft] = useState('')
  const boxRef = useRef(null)
  const large = size === 'lg'

  useEffect(() => {
    if (autoFocus) boxRef.current?.focus()
  }, [autoFocus])

  // Grow with the text, up to MAX_LINES.
  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const line = parseFloat(getComputedStyle(box).lineHeight)
    box.style.height = 'auto'
    box.style.height = `${Math.min(box.scrollHeight, line * MAX_LINES)}px`
  }, [draft])

  const canSend = draft.trim() && !busy

  const submit = () => {
    if (!canSend) return
    onSend(draft.trim())
    setDraft('')
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="rounded-xl border border-line-strong bg-surface transition-colors duration-150 ease-lp focus-within:border-accent"
    >
      <textarea
        ref={boxRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault()
            submit()
          }
        }}
        rows={large ? 3 : 1}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cx(
          'block w-full resize-none bg-transparent text-txt outline-none placeholder:text-txt-3',
          large ? 'px-4 pt-3.5 text-base' : 'px-3.5 pt-3 text-sm',
        )}
      />
      <div className={cx('flex items-center justify-between gap-2', large ? 'px-3 pt-2 pb-3' : 'px-2.5 pt-1.5 pb-2.5')}>
        <div className="flex min-w-0 items-center gap-2">
          <ArchetypeSelector value={archetype} onChange={onArchetypeChange} />
          <SkillsButton />
        </div>
        <button
          type="submit"
          disabled={!canSend}
          aria-label={HOME.sendLabel}
          title={HOME.sendLabel}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-accent-txt transition-colors duration-150 ease-lp hover:bg-accent-hover active:bg-accent-pressed disabled:pointer-events-none disabled:bg-accent-disabled"
        >
          <Icon name="send" className="size-4" />
        </button>
      </div>
    </form>
  )
}
