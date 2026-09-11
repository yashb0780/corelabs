/**
 * Save as a list: name the list, then save it. The suggested name starts
 * selected, so typing replaces it. Save stays disabled while the name is
 * blank; Enter saves.
 */
import { useEffect, useRef, useState } from 'react'
import { Field, TextInput } from '../form'
import { Modal } from '../overlay'
import { Button } from '../ui'
import { CAMPAIGN_COPY } from '../../data/campaigns'

const COPY = CAMPAIGN_COPY.saveModal

export function SaveListModal({ scope, onSave, onClose }) {
  const [name, setName] = useState(scope.saveName)
  const inputRef = useRef(null)
  const trimmed = name.trim()
  const save = () => trimmed && onSave(trimmed)

  // The modal has already focused the box by now; select the suggestion.
  useEffect(() => inputRef.current?.select(), [])

  return (
    <Modal
      title={COPY.title}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {COPY.cancel}
          </Button>
          <Button variant="primary" disabled={!trimmed} onClick={save}>
            {COPY.confirm}
          </Button>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          save()
        }}
      >
        <Field label={COPY.nameLabel} hint={COPY.hint(scope.accounts)} htmlFor="save-list-name">
          <TextInput
            ref={inputRef}
            id="save-list-name"
            value={name}
            onChange={setName}
          />
        </Field>
      </form>
    </Modal>
  )
}
