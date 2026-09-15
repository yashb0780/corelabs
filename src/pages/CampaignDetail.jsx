/**
 * One campaign, at /campaigns/<id>.
 *
 * NOT BUILT YET. This is step 3 in "Build progress" at the end of section 9
 * of BRIEF.md, which specifies the page: a header with the suppression
 * setting, then tabs for Companies and Activity, Email sequence, Replies and
 * Unsubscribed. Until then the address works, so a row on the Campaigns
 * screen has somewhere honest to go, and says plainly that it is not built.
 *
 * A campaign that is not in the store, because it was added in an earlier
 * visit and the page has since been reloaded, gets the "not found" message
 * from the brief instead.
 */
import { Link, useParams } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { EmptyState } from '../components/ui'
import { CAMPAIGN_SCREEN_COPY as COPY } from '../data/campaigns'
import { useCampaign } from '../lib/campaigns'

export default function CampaignDetail() {
  const { campaignId } = useParams()
  const campaign = useCampaign(campaignId)
  const crumbs = ['Workspace', { label: COPY.title, to: '/campaigns' }]

  if (!campaign) {
    const { notFound } = COPY.detail
    return (
      <PageShell breadcrumb={[...crumbs, notFound.title]} title={COPY.title}>
        <EmptyState title={notFound.title}>
          {notFound.body}{' '}
          <Link to="/campaigns" className="text-accent hover:underline">
            {notFound.back}
          </Link>
        </EmptyState>
      </PageShell>
    )
  }

  return (
    <PageShell breadcrumb={[...crumbs, campaign.name]} title={campaign.name}>
      <EmptyState title={COPY.detail.notBuilt.title}>{COPY.detail.notBuilt.body}</EmptyState>
    </PageShell>
  )
}
