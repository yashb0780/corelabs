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
 *   src/components/campaign/useListActions.jsx    Start a campaign, and toasts
 */
import { useEffect, useState } from 'react'
import { PageShell } from '../components/layout/PageShell'
import { CampaignMetrics } from '../components/campaign/CampaignMetrics'
import { CampaignTable } from '../components/campaign/CampaignTable'
import { ListPickerModal } from '../components/campaign/ListPickerModal'
import { useListActions } from '../components/campaign/useListActions'
import { SearchInput } from '../components/form'
import { Button, EmptyState, FilterPill } from '../components/ui'
import { CAMPAIGN_SCREEN_COPY as COPY, CAMPAIGN_STATUSES } from '../data/campaigns'
import { campaignMetrics, campaignView } from '../lib/campaignActivity'
import {
  duplicateCampaign,
  getCampaigns,
  pauseCampaign,
  resumeCampaign,
  useCampaigns,
} from '../lib/campaigns'
import { scopeForList } from '../lib/listActions'
import { atMs, formatLongDateTime, splitAt } from '../lib/schedule'

const STATUS_ORDER = ['active', 'scheduled', 'paused', 'completed', 'draft']

/* Sends go out and statuses change as time passes, so the page redraws
   every half minute: a scheduled campaign turns Active while you watch. */
function useClockTick() {
  const [, setTick] = useState(0)
  useEffect(() => {
    const t = window.setInterval(() => setTick((n) => n + 1), 30 * 1000)
    return () => window.clearInterval(t)
  }, [])
}

/* Newest first by last activity. A campaign with none yet sorts by when it
   was created, which is also the date its row shows. */
const sortKey = (v) => atMs(v.stats.lastActivityAt ?? v.createdAt)

const longAt = (at) => {
  const { date, time } = splitAt(at)
  return formatLongDateTime(date, time)
}

export default function Campaigns() {
  useClockTick()
  const campaigns = useCampaigns()
  const actions = useListActions()
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

  const find = (id) => getCampaigns().find((c) => c.id === id)

  const resume = (id) => {
    resumeCampaign(id)
    const v = campaignView(find(id))
    actions.say(v.stats.nextSendAt ? COPY.toast.resumedNext(v.name, longAt(v.stats.nextSendAt)) : COPY.toast.resumed(v.name))
  }

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
              onLaunch={(id) => actions.launch(find(id))}
              onPause={(id) => {
                pauseCampaign(id)
                actions.say(COPY.toast.paused(find(id).name))
              }}
              onResume={resume}
              onDuplicate={(id) => actions.say(COPY.toast.duplicated(duplicateCampaign(id).name))}
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
