/**
 * Assign one or more saved lists to a teammate.
 *
 * A searchable list of teammates (one can be picked), an optional note, then
 * Assign or Cancel. Assign stays disabled until someone is picked. If every
 * list being assigned already has the same assignee, that person is marked
 * so you can see who has it now.
 *
 * Nothing is sent anywhere. The page updates the Assigned To cell and shows
 * a toast.
 */
import { useState } from 'react'
import { Icon } from '../Icon'
import { cx } from '../cx'
import { Field, SearchInput, TextArea } from '../form'
import { Modal } from '../overlay'
import { Avatar, Button } from '../ui'
import { SAVED_LISTS_COPY } from '../../data/savedLists'
import { TEAMMATES } from '../../data/teammates'

const COPY = SAVED_LISTS_COPY.assignModal

export function AssignModal({ lists, onAssign, onClose }) {
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState(null)
  const [note, setNote] = useState('')

  const q = query.trim().toLowerCase()
  const matches = TEAMMATES.filter(
    (t) => t.name.toLowerCase().includes(q) || t.role.toLowerCase().includes(q),
  )

  const assignees = new Set(lists.map((l) => l.assignedTo))
  const currentId = assignees.size === 1 ? [...assignees][0] : null

  const subtitle =
    lists.length === 1
      ? lists[0].name
      : lists.map((l) => l.name).join(', ')

  const submit = () => picked && onAssign(picked, note.trim())

  return (
    <Modal
      title={COPY.title(lists.length)}
      subtitle={subtitle}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {COPY.cancel}
          </Button>
          <Button variant="primary" onClick={submit} disabled={!picked}>
            {COPY.confirm}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={COPY.search}
          aria-label={COPY.search}
        />

        <div
          role="listbox"
          aria-label={COPY.search}
          className="max-h-64 overflow-y-auto rounded-md border border-line"
        >
          {matches.length === 0 ? (
            <p className="px-3 py-3 text-sm text-txt-3">
              {COPY.noMatch} “{query.trim()}”
            </p>
          ) : (
            matches.map((t) => {
              const on = picked === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  role="option"
                  aria-selected={on}
                  onClick={() => setPicked(t.id)}
                  onDoubleClick={() => onAssign(t.id, note.trim())}
                  className={cx(
                    'flex w-full items-center gap-2.5 border-b border-line px-3 py-2 text-left transition-colors duration-150 ease-lp last:border-b-0',
                    on ? 'bg-accent-quiet' : 'hover:bg-surface-hover',
                  )}
                >
                  <Avatar person={t} size="md" />
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block truncate text-sm font-name text-txt">
                      {t.name}
                    </span>
                    <span className="block truncate text-2xs text-txt-3">
                      {t.role}
                    </span>
                  </span>
                  {t.id === currentId && (
                    <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-2xs text-txt-3">
                      {COPY.current}
                    </span>
                  )}
                  <Icon
                    name="check"
                    className={cx(
                      'size-4 shrink-0 text-accent',
                      on ? 'visible' : 'invisible',
                    )}
                  />
                </button>
              )
            })
          )}
        </div>

        <Field label={COPY.noteLabel} hint={COPY.noteHint} htmlFor="assign-note">
          <TextArea
            id="assign-note"
            value={note}
            onChange={setNote}
            placeholder={COPY.notePlaceholder}
            rows={3}
          />
        </Field>
      </div>
    </Modal>
  )
}
