/**
 * A skill's run in a chat thread: the step chips, the scripted answer
 * (src/lib/skillRuns.js, rendered as markdown), then the companies it
 * found with the usual action pills. Clicking a company opens the panel,
 * exactly as under any other reply.
 *
 * The run is worked out from the data each time it is drawn, so it always
 * matches what the rest of the prototype says about that account.
 */
import { Link } from 'react-router-dom'
import OUT from '../../../content/skills/outputs.json'
import { runSkill } from '../../lib/skillRuns'
import { useSkills } from '../../lib/skills'
import { Markdown } from '../Markdown'
import { Actions, Steps } from './AgentReply'
import { ResultCard } from './ResultCard'

export function SkillReply({ message, title, archetype, openId, onOpen, onAction }) {
  const skill = useSkills().find((s) => s.id === message.skillId)
  if (!skill) return <p className="text-sm text-txt">{OUT.missing}</p>

  const run = runSkill(skill, message.input)

  return (
    <>
      <Steps steps={run.steps} />
      <Markdown source={run.markdown} body="strong" />
      {run.companies.length > 0 && (
        <ResultCard companies={run.companies} archetype={archetype} openId={openId} onOpen={onOpen} />
      )}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Actions companies={run.companies} title={title} onAction={onAction} />
        <Link to={`/skills/${skill.id}`} className="text-2xs font-name text-txt-3 transition-colors duration-150 ease-lp hover:text-txt">
          {OUT.viewSkill}
        </Link>
      </div>
    </>
  )
}
