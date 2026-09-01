/**
 * The floating assistant, bottom right of every page.
 *
 * Visual prototype only. There is no model and no request: whatever you send,
 * it shows typing dots for a moment and returns the one fixed reply from
 * src/data/assistant.js. The only state is the message list, plus whether the
 * panel is open and what is currently typed.
 *
 * It is rendered by App.jsx outside <Routes>, so it survives navigation and
 * the conversation is not thrown away when you click into an account.
 *
 * Geometry (size, offsets, radius) and the shadows come from tokens.css.
 * Nothing here sets a colour.
 */
import { useEffect, useRef, useState } from 'react'
import { ASSISTANT } from '../../data/assistant'
import { Icon } from '../Icon'
import { cx } from '../cx'

function Bubble({ from, children }) {
  const fromUser = from === 'user'
  return (
    <div className={cx('flex', fromUser ? 'justify-end' : 'justify-start')}>
      <p
        className={cx(
          'max-w-[85%] rounded-lg px-3 py-2 text-sm',
          fromUser
            ? 'bg-accent text-accent-txt'
            : 'bg-surface-sunken text-txt',
        )}
      >
        {children}
      </p>
    </div>
  )
}

function TypingDots() {
  return (
    <div className="flex justify-start">
      <span
        className="flex items-center gap-1 rounded-lg bg-surface-sunken px-3 py-2.5"
        role="status"
        aria-label="Assistant is typing"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="lp-typing-dot size-1.5 rounded-full bg-txt-3"
          />
        ))}
      </span>
    </div>
  )
}

export function AssistantWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'assistant', text: ASSISTANT.greeting },
  ])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)

  const timerRef = useRef(null)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  // Suggestions only make sense before the conversation has started.
  const showSuggestions = messages.length === 1 && !typing

  function send(text) {
    const trimmed = text.trim()
    if (!trimmed || typing) return

    setMessages((m) => [...m, { from: 'user', text: trimmed }])
    setDraft('')
    setTyping(true)

    timerRef.current = window.setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { from: 'assistant', text: ASSISTANT.reply }])
    }, ASSISTANT.typingMs)
  }

  // Never leave a timer running against an unmounted component.
  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  // Keep the newest message in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, typing])

  // Escape closes the panel, which is what people expect of a dialog.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    inputRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  /* --- Closed: the circular button ------------------------------------- */
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open ${ASSISTANT.title}`}
        title={ASSISTANT.title}
        style={{
          bottom: 'var(--lp-assistant-button-offset)',
          right: 'var(--lp-assistant-button-offset)',
          width: 'var(--lp-assistant-button)',
          height: 'var(--lp-assistant-button)',
          borderRadius: 'var(--lp-assistant-button-radius)',
          boxShadow: 'var(--lp-shadow-widget)',
        }}
        className="fixed z-50 grid place-items-center bg-accent text-accent-txt transition-transform duration-200 ease-lp hover:scale-[1.04] active:scale-100"
      >
        <Icon name="chatFilled" className="size-[var(--lp-assistant-icon)]" />
      </button>
    )
  }

  /* --- Open: the panel -------------------------------------------------- */
  return (
    <section
      role="dialog"
      aria-label={ASSISTANT.title}
      style={{
        bottom: 'var(--lp-assistant-offset)',
        right: 'var(--lp-assistant-offset)',
        width: 'min(var(--lp-assistant-w), calc(100vw - 2 * var(--lp-assistant-offset)))',
        height:
          'min(var(--lp-assistant-h), calc(100vh - 2 * var(--lp-assistant-offset)))',
        boxShadow: 'var(--lp-shadow-panel)',
      }}
      className="fixed z-50 flex flex-col overflow-hidden rounded-xl border border-line bg-surface"
    >
      {/* Header */}
      <header className="flex shrink-0 items-center gap-2.5 border-b border-line px-3.5 py-3">
        <span
          aria-hidden="true"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-2xs font-num text-accent-txt"
        >
          L
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-name text-txt">
            {ASSISTANT.title}
          </p>
          <p className="truncate text-2xs text-txt-3">{ASSISTANT.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close assistant"
          className="grid size-7 shrink-0 place-items-center rounded-md text-txt-3 transition-colors duration-150 ease-lp hover:bg-surface-hover hover:text-txt"
        >
          <Icon name="close" className="size-4" />
        </button>
      </header>

      {/* Conversation */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-2.5 overflow-y-auto px-3.5 py-3"
      >
        {messages.map((m, i) => (
          <Bubble key={i} from={m.from}>
            {m.text}
          </Bubble>
        ))}

        {typing && <TypingDots />}

        {showSuggestions && (
          <div className="flex flex-col items-start gap-1.5 pt-1">
            {ASSISTANT.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-left text-xs text-txt-2 transition-colors duration-150 ease-lp hover:border-accent hover:bg-accent-quiet hover:text-accent"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          send(draft)
        }}
        className="flex shrink-0 items-center gap-2 border-t border-line px-3 py-2.5"
      >
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={ASSISTANT.placeholder}
          aria-label={ASSISTANT.placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm text-txt outline-none placeholder:text-txt-3"
        />
        <button
          type="submit"
          disabled={!draft.trim() || typing}
          aria-label="Send message"
          className="grid size-7 shrink-0 place-items-center rounded-md bg-accent text-accent-txt transition-colors duration-150 ease-lp hover:bg-accent-hover disabled:bg-accent-disabled disabled:pointer-events-none"
        >
          <Icon name="send" className="size-3.5" />
        </button>
      </form>
    </section>
  )
}
