/**
 * "Choose a saved list": the small window "New campaign" opens on the
 * Campaigns screen.
 *
 * A search box, then every saved list, including any saved earlier in the
 * session, each with its number of accounts and contacts. One list can be
 * picked, and Continue stays disabled until one is. Continue hands the list
 * back; the page then opens Start a campaign on it, exactly as the
 * assistant does when a message names a list. It never sends anyone to
 * Company Search.
 */
import { useState } from 'react'
import { cx } from '../cx'
import { SearchInput } from '../form'
import { Modal } from '../overlay'
import { Button } from '../ui'
import { CAMPAIGN_SCREEN_COPY } from '../../data/campaigns'
import { useSavedLists } from '../../lib/savedLists'

const P = CAMPAIGN_SCREEN_COPY.listPicker

export function ListPickerModal({ onContinue, onClose }) {
  const lists = useSavedLists()
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState(null)

  const q = query.trim().toLowerCase()
  const matches = q ? lists.filter((l) => l.name.toLowerCase().includes(q)) : lists
  const chosen = lists.find((l) => l.id === picked) ?? null

  return (
    <Modal
      title={P.title}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {P.cancel}
          </Button>
          <Button
            variant="primary"
            icon="chevronRight"
            disabled={!chosen}
            onClick={() => onContinue(chosen)}
          >
            {P.continue}
          </Button>
        </>
      }
    >
      <div className="space-y-2.5">
        <SearchInput value={query} onChange={setQuery} placeholder={P.search} aria-label={P.search} />

        <div className="max-h-80 overflow-y-auto rounded-lg border border-line">
          {matches.length === 0 ? (
            <p className="px-3 py-3 text-sm text-txt-3">
              {P.noMatch} “{query.trim()}”
            </p>
          ) : (
            <ul role="radiogroup" aria-label={P.title} className="divide-y divide-line">
              {matches.map((list) => {
                const on = list.id === picked
                return (
                  <li key={list.id}>
                    <label
                      className={cx(
                        'flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors duration-150 ease-lp',
                        on ? 'bg-accent-quiet' : 'hover:bg-surface-hover',
                      )}
                    >
                      <input
                        type="radio"
                        name="saved-list"
                        value={list.id}
                        checked={on}
                        onChange={() => setPicked(list.id)}
                        className="size-3.5 shrink-0 cursor-pointer accent-accent"
                      />
                      <span className="min-w-0 flex-1 leading-tight">
                        <span className="block truncate text-sm font-name text-txt">{list.name}</span>
                        <span className="mt-0.5 block truncate text-2xs tabular-nums text-txt-3">
                          {P.counts(list.records, list.contacts ?? 0)}
                        </span>
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  )
}
