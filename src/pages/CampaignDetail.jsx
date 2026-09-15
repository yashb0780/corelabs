/**
 * ONE CAMPAIGN, at /campaigns/<id>. "Campaign detail" in section 9 of
 * BRIEF.md.
 *
 * The header: the name with its status pill, where it runs, what kind it
 * is and which inbox sends it, and Launch, Pause or Resume, and Duplicate
 * with the same rules as the Campaigns table's row menu. Under it, for a
 * sequence, the suppression setting, which can be changed here. A change
 * applies to replies from then on; pauses that already happened stay until
 * someone clicks Resume outreach.
 *
 * Clicking a step anywhere on the page opens what it says, read only
 * (StepEmailModal.jsx).
 *
 * Then four tabs, one file each in src/components/campaign/:
 *   CampaignCompanies.jsx     Companies and Activity
 *   CampaignSequence.jsx      Email sequence
 *   CampaignReplies.jsx       Replies
 *   CampaignUnsubscribed.jsx  Unsubscribed
 *
 * The campaign is read from the store in src/lib/campaigns.js and worked
 * out by campaignView(), so anything changed here is on the Campaigns
 * screen too. A campaign that is not in the store, because it was added in
 * an earlier visit and the page has since been reloaded, gets a plain
 * "not found" message instead.
 */
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { CampaignCompanies } from '../components/campaign/CampaignCompanies'
import { CampaignReplies } from '../components/campaign/CampaignReplies'
import { CampaignSequence } from '../components/campaign/CampaignSequence'
import { CampaignUnsubscribed } from '../components/campaign/CampaignUnsubscribed'
import { StepEmailModal } from '../components/campaign/StepEmailModal'
import { actionsFor, useCampaignActions } from '../components/campaign/useCampaignActions'
import { Field, Select } from '../components/form'
import { Button, EmptyNote, EmptyState, Tabs, TonePill } from '../components/ui'
import {
  CAMPAIGN_SCREEN_COPY as COPY,
  CAMPAIGN_STATUSES,
  SUPPRESSION_RULES,
} from '../data/campaigns'
import { campaignView } from '../lib/campaignActivity'
import { useCampaign, useCampaignClock } from '../lib/campaigns'

const D = COPY.detail
const RULE_OPTIONS = SUPPRESSION_RULES.map((r) => ({ value: r.id, label: r.label }))

/* What an interested reply does in this campaign, and a way to change it. */
function RuleSetting({ value, onChange }) {
  const rule = SUPPRESSION_RULES.find((r) => r.id === value)
  return (
    <div className="lp-card flex flex-wrap items-end gap-x-6 gap-y-3">
      <div className="w-full sm:w-72">
        <Field label={D.rule.label} htmlFor="suppression-rule">
          <Select id="suppression-rule" value={value} onChange={onChange} options={RULE_OPTIONS} />
        </Field>
      </div>
      <div className="min-w-0 flex-1 pb-0.5 leading-snug">
        <p className="text-sm text-txt-2">{rule.hint}</p>
        <p className="mt-0.5 text-2xs text-txt-3">{D.rule.note}</p>
      </div>
    </div>
  )
}

export default function CampaignDetail() {
  useCampaignClock()
  const { campaignId } = useParams()
  const campaign = useCampaign(campaignId)
  const actions = useCampaignActions()
  const [tab, setTab] = useState('companies')
  // The step whose subject and body are open, by index, or null.
  const [viewing, setViewing] = useState(null)
  const crumbs = ['Workspace', { label: COPY.title, to: '/campaigns' }]

  if (!campaign) {
    return (
      <PageShell breadcrumb={[...crumbs, D.notFound.title]} title={COPY.title}>
        <EmptyState title={D.notFound.title}>
          {D.notFound.body}{' '}
          <Link to="/campaigns" className="text-accent hover:underline">
            {D.notFound.back}
          </Link>
        </EmptyState>
      </PageShell>
    )
  }

  const view = campaignView(campaign)
  const status = CAMPAIGN_STATUSES[view.status]
  const can = actionsFor(view.status)
  const id = campaign.id

  const tabs = [
    { id: 'companies', label: D.tabs.companies, count: view.stats.accounts },
    { id: 'sequence', label: D.tabs.sequence, count: view.sequence.length },
    { id: 'replies', label: D.tabs.replies, count: view.stats.replies.total },
    { id: 'unsubscribed', label: D.tabs.unsubscribed, count: view.stats.unsubscribed },
  ]

  const panels = {
    companies: (
      <CampaignCompanies
        view={view}
        onResumeOutreach={(companyId) => actions.resumeOutreach(id, companyId)}
        onViewStep={setViewing}
      />
    ),
    sequence: <CampaignSequence campaign={campaign} view={view} onViewStep={setViewing} />,
    replies: (
      <CampaignReplies
        view={view}
        onClassify={(contactId, type) => actions.classify(id, contactId, type)}
        onViewStep={setViewing}
      />
    ),
    unsubscribed: <CampaignUnsubscribed view={view} onViewStep={setViewing} />,
  }

  return (
    <PageShell
      breadcrumb={[...crumbs, view.name]}
      title={
        <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
          {view.name}
          <span className="tracking-normal">
            <TonePill tone={status.tone} dashed={status.dashed}>
              {status.label}
            </TonePill>
          </span>
        </span>
      }
      subtitle={[view.listName ?? COPY.fromCompanySearch, D.types[view.type], view.inbox].join(' · ')}
      actions={
        <>
          {can.launch && (
            <Button variant="primary" icon="clock" onClick={() => actions.launch(id)}>
              {COPY.menu.launch}
            </Button>
          )}
          {can.pause && (
            <Button icon="pause" onClick={() => actions.pause(id)}>
              {COPY.menu.pause}
            </Button>
          )}
          {can.resume && (
            <Button variant="primary" icon="play" onClick={() => actions.resume(id)}>
              {COPY.menu.resume}
            </Button>
          )}
          <Button icon="copy" onClick={() => actions.duplicate(id)}>
            {COPY.menu.duplicate}
          </Button>
        </>
      }
    >
      <div className="lp-stack">
        {/* A single email has one send and nothing left to stop. */}
        {view.type === 'sequence' && (
          <RuleSetting value={view.suppressionRule} onChange={(rule) => actions.setRule(id, rule)} />
        )}

        <div className="pt-2">
          <Tabs tabs={tabs} value={tab} onChange={setTab} label={D.tabs.label} idPrefix="campaign" />
        </div>

        <div
          role="tabpanel"
          id={`campaign-panel-${tab}`}
          aria-labelledby={`campaign-tab-${tab}`}
          className="lp-stack"
        >
          {/* A draft still lists who is in scope and its steps; it has no
              replies or unsubscribes to show, so those tabs say only this. */}
          {view.status === 'draft' && <EmptyNote>{D.draftNote}</EmptyNote>}
          {!(view.status === 'draft' && (tab === 'replies' || tab === 'unsubscribed')) && panels[tab]}
        </div>
      </div>

      {viewing !== null && view.sequence[viewing] && (
        <StepEmailModal view={view} index={viewing} onClose={() => setViewing(null)} />
      )}

      {actions.overlay}
    </PageShell>
  )
}
