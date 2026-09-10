/**
 * Share one or more saved lists.
 *
 * A link with a Copy button, and whether people with the link can view or
 * edit. Dummy behaviour: the link points back at this prototype's Saved
 * lists screen, copying really copies it, and the view or edit choice is
 * forgotten when the modal closes.
 */
import { useRef, useState } from 'react'
import { Icon } from '../Icon'
import { SegmentedControl } from '../form'
import { Modal } from '../overlay'
import { Button } from '../ui'
import { SAVED_LISTS_COPY } from '../../data/savedLists'

const COPY = SAVED_LISTS_COPY.shareModal

export function ShareModal({ lists, onClose }) {
  const [access, setAccess] = useState('view')
  const [copied, setCopied] = useState(false)
  const inputRef = useRef(null)

  const link = `${window.location.origin}/saved-lists?list=${lists
    .map((l) => l.id)
    .join(',')}`

  const subtitle =
    lists.length === 1
      ? lists[0].name
      : lists.map((l) => l.name).join(', ')

  const flashCopied = () => {
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      flashCopied()
    } catch {
      // Some browsers and embedded previews block the clipboard. Fall back to
      // the older copy command on the selected link; if that fails too, the
      // link is left selected so it can be copied by hand.
      inputRef.current?.select()
      if (document.execCommand('copy')) flashCopied()
    }
  }

  return (
    <Modal
      title={COPY.title(lists.length)}
      subtitle={subtitle}
      onClose={onClose}
      footer={
        <Button variant="primary" onClick={onClose}>
          {COPY.done}
        </Button>
      }
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="share-link" className="lp-label block">
            {COPY.linkLabel}
          </label>
          <div className="mt-[var(--lp-label-gap)] flex items-center gap-2">
            <div className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-md border border-line bg-surface-sunken px-2.5">
              <Icon name="link" className="size-3.5 shrink-0 text-txt-3" />
              <input
                ref={inputRef}
                id="share-link"
                type="text"
                readOnly
                value={link}
                onFocus={(e) => e.target.select()}
                className="min-w-0 flex-1 truncate bg-transparent text-sm text-txt-2 focus:outline-none"
              />
            </div>
            <Button
              variant="secondary"
              icon={copied ? 'check' : 'copy'}
              onClick={copy}
              className={copied ? 'border-accent text-accent' : undefined}
            >
              {copied ? COPY.copied : COPY.copy}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-txt-2">{COPY.accessLabel}</p>
          <SegmentedControl
            label={COPY.accessLabel}
            value={access}
            onChange={setAccess}
            options={[
              { value: 'view', label: COPY.view },
              { value: 'edit', label: COPY.edit },
            ]}
          />
        </div>
      </div>
    </Modal>
  )
}
