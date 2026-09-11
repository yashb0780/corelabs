/**
 * SAVED LISTS.
 *
 * A table of saved lists you can assign to a teammate or share. Assign and
 * Share are on each row's menu, and appear at the top of the page as soon as
 * one or more rows are ticked.
 *
 * The lists live in src/lib/savedLists.js rather than in this page, because
 * lists saved from Company Search or the assistant have to appear here.
 * Assignments show up straight away and a toast confirms them. Nothing is
 * persisted: a reload resets the lists to src/data/savedLists.js. It is for
 * showing the interaction, not for keeping data.
 *
 * The pieces this page uses:
 *   src/components/lists/SavedListsTable.jsx  the table
 *   src/components/lists/AssignModal.jsx      the Assign modal
 *   src/components/lists/ShareModal.jsx       the Share modal
 */
import { useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { AssignModal } from '../components/lists/AssignModal'
import { SavedListsTable } from '../components/lists/SavedListsTable'
import { ShareModal } from '../components/lists/ShareModal'
import { Toast } from '../components/overlay'
import { Button } from '../components/ui'
import { SAVED_LISTS_COPY as COPY } from '../data/savedLists'
import { getTeammate } from '../data/teammates'
import { assignSavedLists, useSavedLists } from '../lib/savedLists'

export default function SavedLists() {
  const lists = useSavedLists()
  const [selected, setSelected] = useState(() => new Set())
  // Which lists a modal is acting on, and whether they came from the ticked
  // rows (then a finished assign clears the ticks) or one row's menu.
  const [assigning, setAssigning] = useState(null)
  const [sharing, setSharing] = useState(null)
  const [toast, setToast] = useState(null)

  const listsFor = (ids) => lists.filter((l) => ids.includes(l.id))

  const assign = (teammateId, note) => {
    const { ids, fromSelection } = assigning
    const person = getTeammate(teammateId)

    assignSavedLists(ids, teammateId)

    let message =
      ids.length === 1
        ? COPY.toast.assignedOne(listsFor(ids)[0].name, person.name)
        : COPY.toast.assignedMany(ids.length, person.name)
    if (note) message = `${message}, ${COPY.toast.withNote}`

    setToast({ id: Date.now(), message })
    setAssigning(null)
    if (fromSelection) setSelected(new Set())
  }

  const selectedIds = lists.filter((l) => selected.has(l.id)).map((l) => l.id)

  return (
    <PageShell
      breadcrumb={['Workspace', 'Saved lists']}
      title={COPY.title}
      subtitle={COPY.subtitle}
      actions={
        selectedIds.length > 0 && (
          <>
            <span className="text-xs font-num tabular-nums text-txt-3">
              {COPY.selectedCount(selectedIds.length)}
            </span>
            <Button variant="ghost" onClick={() => setSelected(new Set())}>
              {COPY.clearSelection}
            </Button>
            <Button
              variant="secondary"
              icon="share"
              onClick={() => setSharing({ ids: selectedIds })}
            >
              {COPY.share}
            </Button>
            <Button
              variant="primary"
              icon="userPlus"
              onClick={() =>
                setAssigning({ ids: selectedIds, fromSelection: true })
              }
            >
              {COPY.assign}
            </Button>
          </>
        )
      }
    >
      <SavedListsTable
        lists={lists}
        selected={selected}
        onSelectedChange={setSelected}
        onAssign={(ids) => setAssigning({ ids, fromSelection: false })}
        onShare={(ids) => setSharing({ ids })}
      />

      {assigning && (
        <AssignModal
          lists={listsFor(assigning.ids)}
          onAssign={assign}
          onClose={() => setAssigning(null)}
        />
      )}

      {sharing && (
        <ShareModal
          lists={listsFor(sharing.ids)}
          onClose={() => setSharing(null)}
        />
      )}

      <Toast toast={toast} onDone={() => setToast(null)} />
    </PageShell>
  )
}
