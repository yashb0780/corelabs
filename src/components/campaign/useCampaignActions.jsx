/**
 * Everything a person can do to a campaign once it exists, shared by the
 * Campaigns table's row menu and the campaign's own page, so the two can
 * never behave differently:
 *
 *   const actions = useCampaignActions()
 *   actions.launch(id)      opens Start a campaign at the draft's own screen
 *   actions.pause(id)       and resume(id), duplicate(id)
 *   actions.setRule(id, rule)
 *   actions.classify(campaignId, contactId, type)   the review buttons
 *   actions.resumeOutreach(campaignId, companyId)   the banner button
 *   actions.run(...)        Start a campaign on a scope, from useListActions
 *   {actions.overlay}       render once: the setup window and the toast
 *
 * Every change is made by the store in src/lib/campaigns.js and confirmed
 * by a toast. The toasts that report a consequence (who got paused, when
 * the next send is) read the campaign back afterwards, so they describe
 * what actually happened rather than what was expected to.
 */
import { useListActions } from './useListActions'
import { CAMPAIGN_SCREEN_COPY as COPY, SUPPRESSION_RULES } from '../../data/campaigns'
import { campaignView } from '../../lib/campaignActivity'
import {
  classifyReply,
  duplicateCampaign,
  getCampaigns,
  pauseCampaign,
  resumeCampaign,
  resumeOutreach,
  setSuppressionRule,
} from '../../lib/campaigns'
import { formatLongDateTime, splitAt } from '../../lib/schedule'

const T = COPY.detail.toast

/** Which of Launch, Pause and Resume a campaign offers. Duplicate always is. */
export function actionsFor(status) {
  return {
    launch: status === 'draft',
    pause: status === 'active' || status === 'scheduled',
    resume: status === 'paused',
  }
}

const longAt = (at) => {
  const { date, time } = splitAt(at)
  return formatLongDateTime(date, time)
}

const find = (id) => getCampaigns().find((c) => c.id === id)
const viewOf = (id) => campaignView(find(id))

export function useCampaignActions() {
  const actions = useListActions()
  const { say } = actions

  return {
    ...actions,

    launch: (id) => actions.launch(find(id)),

    pause: (id) => {
      pauseCampaign(id)
      say(COPY.toast.paused(find(id).name))
    },

    resume: (id) => {
      resumeCampaign(id)
      const v = viewOf(id)
      say(v.stats.nextSendAt ? COPY.toast.resumedNext(v.name, longAt(v.stats.nextSendAt)) : COPY.toast.resumed(v.name))
    },

    duplicate: (id) => {
      const copy = duplicateCampaign(id)
      say(COPY.toast.duplicated(copy.name))
      return copy
    },

    setRule: (id, rule) => {
      setSuppressionRule(id, rule)
      say(T.rule(SUPPRESSION_RULES.find((r) => r.id === rule).label))
    },

    classify: (campaignId, contactId, type) => {
      classifyReply(campaignId, contactId, type)
      const v = viewOf(campaignId)
      const who = v.activity.find((a) => a.id === contactId)
      if (type === 'ooo') return say(T.markedOoo(who.contactName))
      if (type === 'not_interested') return say(T.markedNotInterested(who.contactName))
      const paused = v.activity.filter((a) => a.suppressedBy === contactId).length
      if (paused) return say(T.markedCompany(who.contactName, paused, who.companyName))
      if (who.status === 'stopped') return say(T.markedStopped(who.contactName))
      say(T.markedKeepSending(who.contactName))
    },

    resumeOutreach: (campaignId, companyId) => {
      const before = viewOf(campaignId).activity.filter(
        (a) => a.companyId === companyId && a.status === 'paused_colleague',
      )
      if (before.length === 0) return
      const by = viewOf(campaignId).activity.find((a) => a.id === before[0].suppressedBy)
      resumeOutreach(campaignId, companyId)
      say(T.outreachResumed(before.length, before[0].companyName, by.contactName))
    },
  }
}
