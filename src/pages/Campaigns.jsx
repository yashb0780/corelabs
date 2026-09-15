/**
 * CAMPAIGNS. Section 9 of BRIEF.md.
 *
 * What is running, who has replied, and who we have stopped writing to.
 * The header, five metric cards, then every campaign in a table with a
 * search box and status filters above it.
 *
 * Campaigns live in src/lib/campaigns.js rather than in this page, because
 * a campaign scheduled on Company Search or from the assistant has to be
 * here afterwards. Everything shown about one (its status, where each
 * contact is, every count) is worked out by src/lib/campaignActivity.js.
 * Nothing is persisted: a reload goes back to src/data/campaigns.js.
 *
 * "New campaign" asks for a saved list, then opens the same Start a
 * campaign window as everywhere else. Launch on a draft opens that window
 * at the draft's own screen.
 *
 * The pieces this page uses:
 *   src/components/campaign/CampaignMetrics.jsx   the five cards
 *   src/components/campaign/CampaignTable.jsx     the table
 *   src/components/campaign/ListPickerModal.jsx   "Choose a saved list"
 *   src/components/campaign/useCampaignActions.jsx  what the menu does, and toasts
 */
import { useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { CampaignMetrics } from '../components/campaign/CampaignMetrics'
import { CampaignTable } from '../components/campaign/CampaignTable'
import { ListPickerModal } from '../components/campaign/ListPickerModal'
import { useCampaignActions } from '../components/campaign/useCampaignActions'
import { SearchInput } from '../components/form'
import { Button, EmptyState, FilterPill } from '../components/ui'
import { CAMPAIGN_SCREEN_COPY as COPY, CAMPAIGN_STATUSES } from '../data/campaigns'
import { campaignMetrics, campaignView } from '../lib/campaignActivity'
import { useCampaignClock, useCampaigns } from '../lib/campaigns'
import { scopeForList } from '../lib/listActions'
import { atMs } from '../lib/schedule'

const STATUS_ORDER = ['active', 'scheduled', 'paused', 'completed', 'draft']

/* Newest first by last activity. A campaign with none yet sorts by when it
   was created, which is also the date its row shows. */
const sortKey = (v) => atMs(v.stats.lastActivityAt ?? v.createdAt)

export default function Campaigns() {
  useCampaignClock()
  const campaigns = useCampaigns()
  const actions = useCampaignActions()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState(null)
  const [picking, setPicking] = useState(false)

  const views = campaigns.map((c) => campaignView(c))
  const metrics = campaignMetrics(views)

  const q = query.trim().toLowerCase()
  const shown = views
    .filter((v) => (!status || v.status === status) && (!q || v.name.toLowerCase().includes(q)))
    .sort((a, b) => sortKey(b) - sortKey(a))

  const countOf = (s) => views.filter((v) => v.status === s).length

  return (
    <PageShell
      breadcrumb={['Workspace', 'Campaigns']}
      title={COPY.title}
      subtitle={COPY.subtitle}
      actions={
        <Button variant="primary" icon="plus" onClick={() => setPicking(true)}>
          {COPY.newCampaign}
        </Button>
      }
    >
      {views.length === 0 ? (
        <EmptyState title={COPY.empty.title}>{COPY.empty.body}</EmptyState>
      ) : (
        <div className="lp-stack">
          <CampaignMetrics metrics={metrics} />

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <div className="w-full sm:w-72">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder={COPY.search}
                aria-label={COPY.search}
              />
            </div>
            <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-line xl:block" />
            <div role="group" aria-label={COPY.filterLabel} className="flex flex-wrap items-center gap-2">
              <FilterPill active={status === null} count={views.length} onClick={() => setStatus(null)}>
                {COPY.all}
              </FilterPill>
              {STATUS_ORDER.map((s) => (
                <FilterPill
                  key={s}
                  active={status === s}
                  count={countOf(s)}
                  onClick={() => setStatus(status === s ? null : s)}
                >
                  {CAMPAIGN_STATUSES[s].label}
                </FilterPill>
              ))}
            </div>
          </div>

          {shown.length === 0 ? (
            <div className="rounded-lg border border-dashed border-line px-4 py-8 text-center">
              <p className="text-sm text-txt-2">{COPY.noMatch.body}</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={() => {
                  setQuery('')
                  setStatus(null)
                }}
              >
                {COPY.noMatch.clear}
              </Button>
            </div>
          ) : (
            <CampaignTable
              campaigns={shown}
              onLaunch={actions.launch}
              onPause={actions.pause}
              onResume={actions.resume}
              onDuplicate={actions.duplicate}
            />
          )}
        </div>
      )}

      {picking && (
        <ListPickerModal
          onClose={() => setPicking(false)}
          onContinue={(list) => {
            setPicking(false)
            actions.run('campaign', scopeForList(list))
          }}
        />
      )}

      {actions.overlay}
    </PageShell>
  )
}
