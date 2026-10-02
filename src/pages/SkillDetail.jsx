/**
 * ONE SKILL at /skills/<id>, laid out like the account page: a wide main
 * column and a right rail.
 *
 *   main   Description, When to use, Instructions (rendered like a
 *          SKILL.md), Example output
 *   rail   Inputs, Knowledge used, Recent runs
 *
 * Example output is the skill's real scripted run (src/lib/skillRuns.js)
 * on its example account or campaign, so it always matches the data.
 * Recent runs are the seeded ones in content/skills/recent-runs.json plus
 * any run from a chat in this browser, which link back to that chat.
 *
 * Workspace skills and My skills have Edit. System skills are read only.
 * Run skill opens a new chat with the skill attached in the chat box.
 */
import { Link, useNavigate, useParams } from 'react-router-dom'
import LIBRARY from '../../content/skills/library.json'
import RUNS from '../../content/skills/recent-runs.json'
import { Markdown } from '../components/Markdown'
import { ResultCard } from '../components/chat/ResultCard'
import { PageShell } from '../components/layout/PageShell'
import { ScopeBadge } from '../components/skills/ScopeBadge'
import { Avatar, Button, Chip, EmptyNote, EmptyState, SectionCard } from '../components/ui'
import { CURRENT_USER_ID, getTeammate } from '../data/teammates'
import { workspaceArchetype } from '../data/workspace'
import { skillRunsIn, useChats } from '../lib/chats'
import { fill } from '../lib/fill'
import { formatShortDate, formatTime } from '../lib/schedule'
import { defaultInput, inputLabel, runSkill } from '../lib/skillRuns'
import { canEdit, useSkills } from '../lib/skills'

const D = LIBRARY.detail
const categoryLabel = (id) => LIBRARY.categories.find((c) => c.id === id)?.label ?? ''

/** A local "2026-09-30T16:20" or a timestamp -> "Wed 30 Sep, 4:20 PM". */
function when(at) {
  const d = new Date(at)
  const pad = (n) => String(n).padStart(2, '0')
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  return `${formatShortDate(date)}, ${formatTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`)}`
}

function Text({ children }) {
  return children ? <Markdown source={children} /> : <EmptyNote>{D.notWritten}</EmptyNote>
}

function RecentRuns({ skill }) {
  const { chats } = useChats()
  const mine = getTeammate(CURRENT_USER_ID)
  const runs = [
    ...skillRunsIn(chats, skill.id).map((r) => ({ ...r, by: CURRENT_USER_ID })),
    ...(RUNS.runs[skill.id] ?? []).map((r) => ({ ...r, inputLabel: inputLabel(r.input) })),
  ]
    .sort((a, b) => new Date(b.at) - new Date(a.at))
    .slice(0, 5)

  if (!runs.length) return <EmptyNote>{D.noRuns}</EmptyNote>

  return (
    <ul className="divide-y divide-line">
      {runs.map((r, i) => {
        const person = getTeammate(r.by) ?? mine
        const you = r.by === CURRENT_USER_ID
        return (
          <li key={i} className="flex items-center gap-2.5 py-2 first:pt-0 last:pb-0">
            <Avatar person={person} />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm text-txt">
                <span className="font-name">{you ? D.you : person.name}</span>
                <span className="text-txt-3"> · </span>
                {r.inputLabel}
              </p>
              <p className="text-2xs text-txt-3">{when(r.at)}</p>
            </div>
            {r.chatId && (
              <Link to={`/chat/${r.chatId}`} className="shrink-0 text-2xs font-name text-accent hover:underline">
                {D.openChat}
              </Link>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default function SkillDetail() {
  const { skillId } = useParams()
  const navigate = useNavigate()
  const skill = useSkills().find((s) => s.id === skillId)

  if (!skill) {
    return (
      <PageShell breadcrumb={[LIBRARY.breadcrumbRoot, { label: LIBRARY.title, to: '/skills' }]} title={D.notFoundTitle}>
        <EmptyState title={D.notFoundTitle}>
          {D.notFoundBody}{' '}
          <Link to="/skills" className="text-accent hover:underline">
            {D.backToSkills}
          </Link>
        </EmptyState>
      </PageShell>
    )
  }

  const example = defaultInput(skill)
  const run = runSkill(skill, example)
  const editable = canEdit(skill)

  return (
    <PageShell
      breadcrumb={[LIBRARY.breadcrumbRoot, { label: LIBRARY.title, to: '/skills' }, skill.name]}
      title={skill.name}
      subtitle={categoryLabel(skill.category)}
      actions={
        <>
          <ScopeBadge scope={skill.scope} />
          {editable ? (
            <Button icon="pencil" onClick={() => navigate(`/skills/${skill.id}/edit`)}>
              {LIBRARY.edit}
            </Button>
          ) : (
            <Chip title={LIBRARY.readOnlyHint}>{LIBRARY.readOnly}</Chip>
          )}
          <Button
            variant="primary"
            icon="play"
            onClick={() => navigate('/chat', { state: { skillId: skill.id } })}
          >
            {LIBRARY.runSkill}
          </Button>
        </>
      }
    >
      <div className="grid items-start gap-[var(--lp-card-gap)] lg:grid-cols-[65fr_35fr]">
        <div className="lp-stack min-w-0">
          <SectionCard icon="file" label={D.description}>
            <Text>{skill.description}</Text>
          </SectionCard>
          <SectionCard icon="target" label={D.whenToUse}>
            <Text>{skill.whenToUse}</Text>
          </SectionCard>
          <SectionCard icon="book" label={D.instructions}>
            <Text>{skill.instructions}</Text>
          </SectionCard>
          <SectionCard
            icon="sparkle"
            label={D.exampleOutput}
            aside={<span className="text-2xs text-txt-3">{fill(D.exampleOn, { input: inputLabel(example) })}</span>}
          >
            <div className="space-y-3">
              <Markdown source={run.markdown} />
              {run.companies.length > 0 && (
                <ResultCard
                  companies={run.companies}
                  archetype={workspaceArchetype()}
                  openId={null}
                  onOpen={(id) => navigate(`/leads/${id}`)}
                />
              )}
            </div>
          </SectionCard>
        </div>

        <div className="lp-stack min-w-0 lg:sticky lg:top-5">
          <SectionCard icon="box" label={D.inputs}>
            <ul className="space-y-1 text-sm text-txt-2">
              {skill.inputs.map((t) => (
                <li key={t}>{LIBRARY.inputs[t]?.label ?? t}</li>
              ))}
            </ul>
          </SectionCard>
          <SectionCard icon="layers" label={D.knowledge}>
            {skill.knowledge.length ? (
              <div className="flex flex-wrap gap-1.5">
                {skill.knowledge.map((k) => (
                  <Chip key={k}>{k}</Chip>
                ))}
              </div>
            ) : (
              <EmptyNote>{D.noKnowledge}</EmptyNote>
            )}
          </SectionCard>
          <SectionCard icon="clock" label={D.recentRuns}>
            <RecentRuns skill={skill} />
          </SectionCard>
        </div>
      </div>
    </PageShell>
  )
}
