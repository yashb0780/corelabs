/**
 * Rename a report. The current name starts selected, so typing replaces it.
 * Save stays disabled while the name is blank or unchanged; Enter saves.
 */
import { useState } from 'react'
import { Field, TextInput } from '../form'
import { Modal } from '../overlay'
import { Button } from '../ui'
import { REPORTS_COPY } from '../../data/reports'

const COPY = REPORTS_COPY.renameModal

export function RenameReportModal({ report, onRename, onClose }) {
  const [name, setName] = useState(report.title)
  const trimmed = name.trim()
  const canSave = trimmed !== '' && trimmed !== report.title

  const save = () => canSave && onRename(trimmed)

  return (
    <Modal
      title={COPY.title}
      subtitle={report.title}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {COPY.cancel}
          </Button>
          <Button variant="primary" disabled={!canSave} onClick={save}>
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
        <Field label={COPY.label} htmlFor="report-name">
          <TextInput
            id="report-name"
            value={name}
            onChange={setName}
            onFocus={(e) => e.target.select()}
          />
        </Field>
      </form>
    </Modal>
  )
}
