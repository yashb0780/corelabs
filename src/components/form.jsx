/**
 * Form controls, shared by any screen that needs to collect input.
 *
 * Nothing here holds copy or colour. Labels, hints and placeholders are
 * passed in from src/data/, and every colour and size comes from tokens.
 *
 * None of these ever substitutes a default value. An empty field renders
 * empty, which is the whole point on the vendor profile: a guessed value
 * looks confirmed to the user.
 */
import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon'
import { cx } from './cx'

const CONTROL =
  'w-full rounded-md border border-line bg-surface px-2.5 text-sm text-txt transition-colors duration-150 ease-lp placeholder:text-txt-3 hover:border-line-strong focus:border-accent focus:outline-none'

/** Label, optional hint, then the control. */
export function Field({ label, hint, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="lp-label block">
        {label}
      </label>
      {hint && <p className="mt-1 text-2xs text-txt-3">{hint}</p>}
      <div className="mt-[var(--lp-label-gap)]">{children}</div>
    </div>
  )
}

export function TextInput({
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  ...rest
}) {
  return (
    <input
      id={id}
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cx(CONTROL, 'h-9')}
      {...rest}
    />
  )
}

export function TextArea({ id, value, onChange, placeholder, rows = 4, ...rest }) {
  return (
    <textarea
      id={id}
      rows={rows}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cx(CONTROL, 'resize-y py-2 leading-relaxed')}
      {...rest}
    />
  )
}

/** A text box with a search icon in front. */
export function SearchInput({ value, onChange, placeholder, inputRef, ...rest }) {
  return (
    <div className="relative">
      <Icon
        name="search"
        className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-txt-3"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cx(CONTROL, 'h-9 pl-8')}
        {...rest}
      />
    </div>
  )
}

/**
 * A checkbox. `indeterminate` draws the dash used by a "select all" box when
 * only some rows are ticked, which HTML can only set from script.
 */
export function Checkbox({ checked, indeterminate = false, onChange, label, disabled = false }) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
      aria-label={label}
      className="size-4 shrink-0 cursor-pointer rounded accent-accent disabled:cursor-default disabled:opacity-40"
    />
  )
}

/**
 * Two or more options side by side, one chosen. `options` is
 * [{ value, label }].
 */
export function SegmentedControl({ value, onChange, options, label }) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex rounded-md border border-line bg-surface-sunken p-0.5"
    >
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cx(
              'h-7 rounded px-3 text-xs font-name transition-colors duration-150 ease-lp',
              on
                ? 'border border-line bg-surface text-txt'
                : 'border border-transparent text-txt-3 hover:text-txt-2',
            )}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

export function Select({ id, value, onChange, options, ...rest }) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={cx(CONTROL, 'h-9 appearance-none pr-8')}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Icon
        name="chevronDown"
        className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-txt-3"
      />
    </div>
  )
}

/** A small square button for removing a row. */
export function RemoveButton({ onClick, label, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-9 shrink-0 place-items-center rounded-md text-txt-3 transition-colors duration-150 ease-lp hover:bg-surface-hover hover:text-txt disabled:pointer-events-none disabled:opacity-30"
    >
      <Icon name="close" className="size-3.5" />
    </button>
  )
}

/** The small text button under a list of rows that adds another. */
export function AddButton({ onClick, children, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 text-xs font-name text-accent transition-colors duration-150 ease-lp hover:text-accent-hover disabled:pointer-events-none disabled:opacity-40"
    >
      <Icon name="plus" className="size-3.5" />
      {children}
    </button>
  )
}

/**
 * A list of single free-text entries. Starts with one empty row so there is
 * always somewhere to type.
 */
export function RepeatableList({
  values = [],
  onChange,
  placeholder,
  addLabel,
  max,
}) {
  const rows = values.length ? values : ['']
  const atMax = max !== undefined && rows.length >= max

  const set = (i, v) => onChange(rows.map((row, n) => (n === i ? v : row)))
  const remove = (i) => onChange(rows.filter((_, n) => n !== i))

  return (
    <div className="space-y-1.5">
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-1">
          <TextInput
            value={row}
            onChange={(v) => set(i, v)}
            placeholder={placeholder}
          />
          {rows.length > 1 && (
            <RemoveButton onClick={() => remove(i)} label="Remove entry" />
          )}
        </div>
      ))}
      <AddButton onClick={() => onChange([...rows, ''])} disabled={atMax}>
        {addLabel}
      </AddButton>
    </div>
  )
}

/**
 * Rows of two fields, e.g. a certification provider and the level held.
 * `cols` is [{ key, placeholder }, { key, placeholder }].
 */
export function RepeatableRows({ rows = [], onChange, cols, addLabel }) {
  const blank = Object.fromEntries(cols.map((c) => [c.key, '']))
  const list = rows.length ? rows : [blank]

  const set = (i, key, v) =>
    onChange(list.map((row, n) => (n === i ? { ...row, [key]: v } : row)))
  const remove = (i) => onChange(list.filter((_, n) => n !== i))

  return (
    <div className="space-y-1.5">
      {list.map((row, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="grid flex-1 gap-1.5 sm:grid-cols-2">
            {cols.map((c) => (
              <TextInput
                key={c.key}
                value={row[c.key]}
                onChange={(v) => set(i, c.key, v)}
                placeholder={c.placeholder}
              />
            ))}
          </div>
          {list.length > 1 && (
            <RemoveButton onClick={() => remove(i)} label="Remove row" />
          )}
        </div>
      ))}
      <AddButton onClick={() => onChange([...list, blank])}>
        {addLabel}
      </AddButton>
    </div>
  )
}

/**
 * Multi select that also takes anything typed. Suggestions are a shortcut,
 * never a limit: Enter or a comma commits whatever is in the box.
 */
export function TagInput({
  values = [],
  onChange,
  placeholder,
  suggestions = [],
}) {
  const [draft, setDraft] = useState('')

  const add = (raw) => {
    const value = raw.trim()
    if (!value) return
    // Case-insensitive de-dupe, so "aws" does not sit next to "AWS".
    if (values.some((v) => v.toLowerCase() === value.toLowerCase())) return
    onChange([...values, value])
  }

  const remove = (value) => onChange(values.filter((v) => v !== value))
  const unused = suggestions.filter(
    (s) => !values.some((v) => v.toLowerCase() === s.toLowerCase()),
  )

  return (
    <div className="space-y-2">
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 rounded-full border border-accent bg-accent-quiet py-0.5 pr-1 pl-2.5 text-xs font-name text-accent"
            >
              {v}
              <button
                type="button"
                onClick={() => remove(v)}
                aria-label={`Remove ${v}`}
                className="grid size-4 place-items-center rounded-full transition-colors duration-150 ease-lp hover:bg-surface-hover"
              >
                <Icon name="close" className="size-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            add(draft)
            setDraft('')
          }
          if (e.key === 'Backspace' && !draft && values.length) {
            remove(values[values.length - 1])
          }
        }}
        onBlur={() => {
          add(draft)
          setDraft('')
        }}
        placeholder={placeholder}
        className={cx(CONTROL, 'h-9')}
      />

      {unused.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {unused.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="rounded-full border border-line bg-surface px-2.5 py-0.5 text-xs text-txt-2 transition-colors duration-150 ease-lp hover:border-accent hover:bg-accent-quiet hover:text-accent"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
