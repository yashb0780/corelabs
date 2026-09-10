/**
 * Add report: pick a chart type and the object it reads from, then add it
 * to the end of the dashboard. Add stays disabled until both are picked.
 *
 * The new card shows sample numbers for its chart type, marked "Sample
 * data", until the real report is built.
 */
import { useState } from 'react'
import { Icon } from '../Icon'
import { cx } from '../cx'
import { Modal } from '../overlay'
import { Button, FilterPill } from '../ui'
import {
  REPORTS_COPY,
  REPORT_SOURCES,
  REPORT_TYPES,
} from '../../data/reports'

const COPY = REPORTS_COPY.addModal

export function AddReportModal({ onAdd, onClose }) {
  const [type, setType] = useState(null)
  const [source, setSource] = useState(null)

  return (
    <Modal
      title={COPY.title}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {COPY.cancel}
          </Button>
          <Button
            variant="primary"
            disabled={!type || !source}
            onClick={() => onAdd(type, source)}
          >
            {COPY.confirm}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <fieldset>
          <legend className="lp-label">{COPY.typeLabel}</legend>
          <div className="mt-[var(--lp-label-gap)] grid grid-cols-2 gap-2">
            {Object.entries(REPORT_TYPES).map(([id, t]) => {
              const on = type === id
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setType(id)}
                  className={cx(
                    'flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors duration-150 ease-lp',
                    on
                      ? 'border-accent bg-accent-quiet'
                      : 'border-line hover:border-line-strong hover:bg-surface-hover',
                  )}
                >
                  <span
                    className={cx(
                      'mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border',
                      on ? 'border-accent text-accent' : 'border-line text-txt-3',
                    )}
                  >
                    <Icon name={t.icon} className="size-3.5" />
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block text-sm font-name text-txt">{t.label}</span>
                    <span className="mt-0.5 block text-2xs text-txt-3">{t.hint}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="lp-label">{COPY.sourceLabel}</legend>
          <p className="mt-1 text-2xs text-txt-3">{COPY.sourceHint}</p>
          <div className="mt-[var(--lp-label-gap)] flex flex-wrap gap-1.5">
            {Object.entries(REPORT_SOURCES).map(([id, s]) => (
              <FilterPill
                key={id}
                active={source === id}
                onClick={() => setSource(id)}
              >
                <Icon name={s.icon} className="size-3.5" />
                {s.label}
              </FilterPill>
            ))}
          </div>
        </fieldset>
      </div>
    </Modal>
  )
}
