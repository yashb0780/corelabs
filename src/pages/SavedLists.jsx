/**
 * SAVED LISTS.
 *
 * A table of saved lists you can assign to a teammate or share. Assign and
 * Share are on each row's menu, and appear at the top of the page as soon as
 * one or more rows are ticked.
 *
 * Everything here is local to this page on purpose: assignments show up
 * straight away and a toast confirms them, but nothing is saved, so leaving
 * the page resets the lists to src/data/savedLists.js. It is for showing the
 * interaction, not for keeping data.
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
import { SAVED_LISTS, SAVED_LISTS_COPY as COPY } from '../data/savedLists'
import { getTeammate } from '../data/teammates'

export default function SavedLists() {
  const [lists, setLists] = useState(SAVED_LISTS)
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

    setLists((all) =>
      all.map((l) => (ids.includes(l.id) ? { ...l, assignedTo: teammateId } : l)),
    )

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
