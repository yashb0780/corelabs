/**
 * One reply from the chat agent, in the order Lightfield shows it:
 *
 *   step chips    what it did: Interpreted request, Searched 12 companies...
 *   the answer    a sentence or two
 *   Interpreted as  the filters it applied, each removable. Removing one
 *                 re-runs the search, because results are never stored:
 *                 they are found again from the message's filters.
 *   result card   the companies, see ResultCard.jsx
 *   action pills  Start a campaign from this list, Save as a list, and
 *                 Refine by ICP
 *
 * The three kinds of message and what they store are described in
 * src/lib/chats.js. All copy comes from content/chat/replies.json.
 */
import { Link } from 'react-router-dom'
import REPLIES from '../../../content/chat/replies.json'
import { getCompany, getPhase } from '../../data/companies'
import { ICP_REFINE_COPY } from '../../data/vendorProfile'
import { updateMessage } from '../../lib/chats'
import { fill, listOf, plural } from '../../lib/fill'
import { deriveIcpFilters } from '../../lib/icp'
import { filterLabel, runFilters } from '../../lib/intents'
import { scopeForCompanies } from '../../lib/listActions'
import { getVendorProfile, useVendorProfile } from '../../lib/profile'
import { Icon } from '../Icon'
import { ActionPills } from '../campaign/ActionPills'
import { ActionPill, Chip, EmptyNote } from '../ui'
import { ResultCard } from './ResultCard'

const COPY = REPLIES

/* --- Pieces ------------------------------------------------------------- */

function Steps({ steps }) {
  if (!steps.length) return null
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {steps.map((s) => (
        <Chip key={s} className="text-txt-3">
          <Icon name="check" className="size-3 shrink-0" />
          {s}
        </Chip>
      ))}
    </div>
  )
}

function RemovableChip({ label, onRemove }) {
  return (
    <span className="inline-flex h-7 items-center gap-1 rounded-full border border-accent bg-accent-quiet pr-1 pl-3 text-xs font-name text-accent">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={fill(COPY.removeFilter, { label })}
        title={fill(COPY.removeFilter, { label })}
        className="grid size-5 place-items-center rounded-full transition-colors duration-150 ease-lp hover:bg-accent hover:text-accent-txt"
      >
        <Icon name="close" className="size-3" />
      </button>
    </span>
  )
}

function InterpretedAs({ chips }) {
  if (!chips.length) return null
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="lp-label mr-1">{COPY.interpretedAs}</span>
      {chips.map((c) => (
        <RemovableChip key={c.key} label={c.label} onRemove={c.onRemove} />
      ))}
    </div>
  )
}

/**
 * The pills under a result. Start a campaign and Save as a list act on the
 * companies found, named after the chat; Refine by ICP adds the vendor
 * profile's filters as chips, or takes them off again.
 */
function Actions({ companies, title, onAction, refine }) {
  if (!companies.length && !refine) return null
  const scope = { ...scopeForCompanies(companies), name: title, saveName: title, nameFor: undefined }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {companies.length > 0 && (
        <ActionPills chat actions={['campaign', 'save']} onPick={(a) => onAction(a, scope)} />
      )}
      {refine && (
        <ActionPill
          icon={refine.on ? 'check' : 'filter'}
          onClick={refine.toggle}
          aria-pressed={refine.on}
          className={refine.on ? 'border-accent text-accent' : undefined}
        >
          {refine.on ? ICP_REFINE_COPY.applied : ICP_REFINE_COPY.apply}
        </ActionPill>
      )}
    </div>
  )
}

const Answer = ({ children }) => <p className="text-sm text-txt">{children}</p>

/* --- The three kinds of reply ------------------------------------------- */

function NoMatch({ onPrompt }) {
  return (
    <>
      <Answer>{COPY.noMatch.text}</Answer>
      <div className="flex flex-col items-start gap-1.5">
        {COPY.noMatch.prompts.map((p) => (
          <ActionPill key={p} onClick={() => onPrompt(p)}>
            {p}
          </ActionPill>
        ))}
      </div>
    </>
  )
}

function Brief({ message, title, archetype, openId, onOpen, onPrompt, onAction }) {
  const company = getCompany(message.companyId)
  if (!company) return <NoMatch onPrompt={onPrompt} />

  const phase = getPhase(company.phase)
  const signals = company.signalsFired?.length ?? 0
  const contacts = company.contacts.map((c) => `${c.name} (${c.title})`)

  return (
    <>
      <Steps
        steps={[
          COPY.steps.interpreted,
          fill(COPY.steps.opened, { company: company.name }),
          plural(COPY.steps.read, signals),
        ]}
      />
      <div className="space-y-2">
        <Answer>
          {fill(COPY.brief.lead, {
            company: company.name,
            phase: phase.label,
            score: company.icpFitScore,
          })}{' '}
          {company.whyNow
            ? fill(COPY.brief.whyNow, { title: company.whyNow.title })
            : COPY.brief.noWhyNow}
        </Answer>
        {company.brief?.fitNote && <Answer>{company.brief.fitNote}</Answer>}
        <Answer>
          {contacts.length
            ? fill(COPY.brief.contacts, { contacts: listOf(contacts) })
            : COPY.brief.noContacts}
        </Answer>
        <p className="text-2xs text-txt-3">{COPY.brief.openFull}</p>
      </div>
      <ResultCard companies={[company]} archetype={archetype} openId={openId} onOpen={onOpen} />
      <Actions companies={[company]} title={title} onAction={onAction} />
    </>
  )
}

function Results({ chatId, message, title, archetype, openId, onOpen, onAction }) {
  // Read live, so a vendor profile edited mid-chat changes the ICP chips.
  const profile = useVendorProfile()
  const icpIds = message.icp ?? []
  const icpFilters = deriveIcpFilters(profile).filter((f) => icpIds.includes(f.id))
  const { matched, notJudged, missing, total } = runFilters(message.filters, icpFilters)
  const applied = message.filters.length + icpFilters.length

  const update = (patch) => updateMessage(chatId, message.id, patch)

  const chips = [
    ...message.filters.map((f) => ({
      key: f.id,
      label: filterLabel(f),
      onRemove: () => update({ filters: message.filters.filter((x) => x.id !== f.id) }),
    })),
    ...icpFilters.map((f) => ({
      key: `icp-${f.id}`,
      label: f.label,
      onRemove: () => update({ icp: icpIds.filter((id) => id !== f.id) }),
    })),
  ]

  const answer =
    applied === 0
      ? fill(COPY.results.unfiltered, { total })
      : matched.length === 0
        ? COPY.results.none
        : plural(COPY.results.answer, matched.length, { count: matched.length, total })

  const refine = {
    on: icpFilters.length > 0,
    toggle: () => {
      if (icpFilters.length) return update({ icp: [], icpEmpty: false })
      const ids = deriveIcpFilters(getVendorProfile()).map((f) => f.id)
      update({ icp: ids, icpEmpty: ids.length === 0 })
    },
  }

  return (
    <>
      <Steps
        steps={[
          COPY.steps.interpreted,
          plural(COPY.steps.searched, total),
          plural(COPY.steps.applied, applied),
        ]}
      />
      <Answer>{answer}</Answer>
      <InterpretedAs chips={chips} />
      <ResultCard companies={matched} archetype={archetype} openId={openId} onOpen={onOpen} />
      {notJudged.length > 0 && (
        <p className="text-2xs text-txt-3">
          {plural(COPY.results.notJudged, notJudged.length, {
            names: listOf(notJudged.map((c) => c.name)),
            fields: listOf(missing, COPY.results.fieldJoin),
          })}
        </p>
      )}
      {message.icpEmpty && (
        <EmptyNote>
          {COPY.icp.nothing}{' '}
          <Link to="/vendor/vendor-profile" className="font-name text-accent hover:underline">
            {ICP_REFINE_COPY.nothingLink}
          </Link>
        </EmptyNote>
      )}
      <Actions companies={matched} title={title} onAction={onAction} refine={refine} />
    </>
  )
}

/* --- The reply ---------------------------------------------------------- */

export function AgentReply({ chatId, message, title, archetype, openId, onOpen, onPrompt, onAction }) {
  const shared = { chatId, message, title, archetype, openId, onOpen, onPrompt, onAction }
  return (
    <div className="space-y-3">
      {message.kind === 'results' && <Results {...shared} />}
      {message.kind === 'brief' && <Brief {...shared} />}
      {message.kind === 'nomatch' && <NoMatch onPrompt={onPrompt} />}
    </div>
  )
}
