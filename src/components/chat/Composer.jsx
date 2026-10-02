/**
 * The chat composer: a text box, the "/" skills button and a send button.
 * Used large on the New chat page and pinned to the bottom of a thread, so
 * the two always look the same.
 *
 * SKILLS. The "/" button, or typing "/" at the start of a message, opens
 * the skills picker (SkillPicker.jsx). Typing after the "/" searches it;
 * the arrow keys and Enter pick, Escape closes. A picked skill sits as a
 * pill above the text, with a dropdown for what it runs on (an account, a
 * campaign...). A message can be sent with just the skill and no text.
 *
 * Enter sends, Shift+Enter starts a new line. The box grows with what is
 * typed, up to a limit, then scrolls.
 *
 * There is no "Selling as:" dropdown here on purpose. The seller type is
 * set once at onboarding (src/data/workspace.js), not changed in chat.
 *
 * onSend({ text, skill }) gets `skill` as stored on a chat message (see
 * src/lib/chats.js), or null.
 */
import { useEffect, useRef, useState } from 'react'
import HOME from '../../../content/chat/home.json'
import LIBRARY from '../../../content/skills/library.json'
import { fill } from '../../lib/fill'
import { defaultInput, inputLabel } from '../../lib/skillRuns'
import { getSkill, searchSkills, useSkills } from '../../lib/skills'
import { Icon } from '../Icon'
import { cx } from '../cx'
import { SkillInputSelect } from '../skills/SkillInputSelect'
import { SkillPicker } from '../skills/SkillPicker'
import { RemovableChip } from '../ui'

/** Tallest the box grows before it scrolls, in lines. */
const MAX_LINES = 8

/** "/acc" at the very start of the box, with no space yet: the picker's search. */
const SLASH = /^\/(\S*)$/

/** A skill as the composer holds it, ready for its input dropdown. */
const attach = (skill) => (skill ? { id: skill.id, input: defaultInput(skill) } : null)

export function Composer({
  size = 'lg',
  placeholder,
  onSend,
  busy = false,
  autoFocus = false,
  initialSkillId = null,
}) {
  const skills = useSkills()
  const [draft, setDraft] = useState('')
  const [attached, setAttached] = useState(() => attach(getSkill(initialSkillId)))
  // null, 'typed' (from a "/" in the box) or 'button' (from the / button).
  const [picker, setPicker] = useState(null)
  const [search, setSearch] = useState('')
  const [active, setActive] = useState(0)

  const formRef = useRef(null)
  const boxRef = useRef(null)
  const large = size === 'lg'

  const skill = attached ? skills.find((s) => s.id === attached.id) : null
  const query = picker === 'typed' ? (draft.match(SLASH)?.[1] ?? '') : search
  const matches = picker ? searchSkills(skills, query) : []

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

  // A click anywhere outside the composer closes the picker.
  useEffect(() => {
    if (!picker) return
    const onDown = (e) => !formRef.current?.contains(e.target) && setPicker(null)
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [picker])

  const closePicker = () => {
    setPicker(null)
    setSearch('')
    setActive(0)
  }

  const pick = (s) => {
    setAttached(attach(s))
    if (picker === 'typed') setDraft('')
    closePicker()
    boxRef.current?.focus()
  }

  /** Arrow keys, Enter and Escape while the picker is open. True if used. */
  const pickerKey = (e) => {
    if (!picker) return false
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const step = e.key === 'ArrowDown' ? 1 : -1
      setActive((i) => (matches.length ? (i + step + matches.length) % matches.length : 0))
      return true
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      if (matches[active]) pick(matches[active])
      return true
    }
    if (e.key === 'Escape') {
      // Stops here, so it does not also close the company panel behind.
      e.stopPropagation()
      closePicker()
      boxRef.current?.focus()
      return true
    }
    return false
  }

  const onDraftChange = (value) => {
    setDraft(value)
    if (SLASH.test(value)) {
      setPicker('typed')
      setActive(0)
    } else if (picker === 'typed') {
      closePicker()
    }
  }

  const canSend = (draft.trim() || skill) && !busy && picker !== 'typed'

  const submit = () => {
    if (!canSend) return
    onSend({
      text: draft.trim(),
      skill: skill
        ? { id: skill.id, name: skill.name, input: attached.input, inputLabel: inputLabel(attached.input) }
        : null,
    })
    setDraft('')
    setAttached(null)
  }

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="relative rounded-xl border border-line-strong bg-surface transition-colors duration-150 ease-lp focus-within:border-accent"
    >
      {skill && (
        <div className={cx('flex flex-wrap items-center gap-1.5', large ? 'px-3.5 pt-3' : 'px-3 pt-2.5')}>
          <RemovableChip
            label={`/${skill.name}`}
            onRemove={() => {
              setAttached(null)
              boxRef.current?.focus()
            }}
            removeLabel={fill(LIBRARY.picker.remove, { name: skill.name })}
          />
          <SkillInputSelect
            type={attached.input.type}
            value={attached.input.id}
            onChange={(id) => setAttached((a) => ({ ...a, input: { ...a.input, id } }))}
          />
        </div>
      )}

      <textarea
        ref={boxRef}
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        onKeyDown={(e) => {
          if (pickerKey(e)) return
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault()
            submit()
          }
        }}
        rows={large ? 3 : 1}
        placeholder={placeholder}
        aria-label={placeholder}
        aria-expanded={Boolean(picker)}
        className={cx(
          'block w-full resize-none bg-transparent text-txt outline-none placeholder:text-txt-3',
          large ? 'px-4 pt-3.5 text-base' : 'px-3.5 pt-3 text-sm',
        )}
      />

      <div className={cx('flex items-center justify-between gap-2', large ? 'px-3 pt-2 pb-3' : 'px-2.5 pt-1.5 pb-2.5')}>
        <button
          type="button"
          onClick={() => (picker ? closePicker() : (setPicker('button'), setActive(0)))}
          aria-label={HOME.skillsButtonLabel}
          aria-expanded={picker === 'button'}
          title={HOME.skillsButtonLabel}
          className={cx(
            'grid size-9 place-items-center rounded-md border font-mono text-sm transition-colors duration-150 ease-lp',
            picker
              ? 'border-accent bg-accent-quiet text-accent'
              : 'border-line bg-surface text-txt-3 hover:border-line-strong hover:text-txt-2',
          )}
        >
          /
        </button>
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

      {picker && (
        <SkillPicker
          skills={matches}
          active={active}
          onPick={pick}
          onHover={setActive}
          query={search}
          onQueryChange={(v) => {
            setSearch(v)
            setActive(0)
          }}
          onKeyDown={pickerKey}
          withSearch={picker === 'button'}
          // The New chat page has room below the box; a thread's box is
          // pinned to the bottom, so its picker opens upwards.
          placement={large ? 'below' : 'above'}
        />
      )}
    </form>
  )
}
