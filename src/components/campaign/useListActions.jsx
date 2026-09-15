/**
 * What happens when an action pill is clicked, shared by Company Search,
 * the assistant and the Campaigns screen so they all behave identically.
 *
 *   const actions = useListActions()
 *   actions.run('campaign', scope, onDone)   // scope: see src/lib/listActions.js
 *   actions.launch(draft)                    // a draft from the Campaigns store
 *   actions.say('Done')                      // a toast, for the page's own actions
 *   ...
 *   {actions.overlay}                        // render once, anywhere
 *
 * Start a campaign opens the campaign setup (sequence or single email);
 * finishing either adds the campaign to the Campaigns store, so it is on
 * the Campaigns screen from then on, and shows a toast saying it was
 * scheduled, or for an email sent now, sent.
 * Launch opens the same setup at a draft's own screen, filled in from it.
 * Finishing turns the draft itself into the campaign, with the same toast;
 * Cancel leaves it exactly as it was.
 * Save as a list opens the naming modal, then adds the list to Saved lists
 * for the rest of the session and shows a toast.
 * Enrich contacts only shows a toast.
 *
 * `onDone` runs once an action has actually happened, not on Cancel, so a
 * page can clear its selection then.
 */
import { useState } from 'react'
import { Toast } from '../overlay'
import { CampaignSetupModal } from './CampaignSetupModal'
import { SaveListModal } from './SaveListModal'
import { CAMPAIGN_COPY as COPY } from '../../data/campaigns'
import { addCampaign, launchDraft } from '../../lib/campaigns'
import { scopeForCampaign } from '../../lib/listActions'
import { addSavedList } from '../../lib/savedLists'

export function useListActions() {
  const [open, setOpen] = useState(null) // { action, scope, draft, onDone }
  const [toast, setToast] = useState(null)

  const say = (message) => setToast({ id: Date.now(), message })

  const finish = (message) => {
    say(message)
    open?.onDone?.()
    setOpen(null)
  }

  const run = (action, scope, onDone) => {
    if (action === 'enrich') {
      say(COPY.toast.enriched(scope.accounts))
      onDone?.()
      return
    }
    setOpen({ action, scope, onDone })
  }

  const launch = (draft) =>
    setOpen({ action: 'campaign', scope: scopeForCampaign(draft), draft })

  const overlay = (
    <>
      {open?.action === 'campaign' && (
        <CampaignSetupModal
          scope={open.scope}
          draft={open.draft}
          onClose={() => setOpen(null)}
          onLaunch={({ kind, name, when, campaign }) => {
            if (open.draft) launchDraft(open.draft.id, campaign)
            else addCampaign(campaign)
            finish(
              kind === 'email'
                ? COPY.toast.email(name, campaign.contacts.length)
                : COPY.toast[kind](name, when),
            )
          }}
        />
      )}

      {open?.action === 'save' && (
        <SaveListModal
          scope={open.scope}
          onClose={() => setOpen(null)}
          onSave={(name) => {
            addSavedList({
              name,
              records: open.scope.accounts,
              contacts: open.scope.contacts,
              companyIds: open.scope.companyIds,
              seed: open.scope.seed,
            })
            finish(COPY.toast.saved(name))
          }}
        />
      )}

      <Toast toast={toast} onDone={() => setToast(null)} />
    </>
  )

  return { run, launch, say, overlay }
}
