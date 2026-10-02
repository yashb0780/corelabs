/**
 * One skill on the Skills library: name, a line of description, its scope
 * badge and a Run button. The whole card opens the skill's page; Run opens
 * a new chat with the skill attached instead.
 */
import { Link } from 'react-router-dom'
import LIBRARY from '../../../content/skills/library.json'
import { Button } from '../ui'
import { ScopeBadge } from './ScopeBadge'

export function SkillCard({ skill, onRun }) {
  return (
    <article className="lp-card relative flex flex-col gap-3 transition-colors duration-150 ease-lp hover:border-line-strong">
      <div className="min-w-0">
        {/* The link's ::after covers the card, so the whole card is the
            link without wrapping the Run button inside it. */}
        <Link
          to={`/skills/${skill.id}`}
          className="text-sm font-name text-txt after:absolute after:inset-0 after:rounded-lg"
        >
          {skill.name}
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-txt-2">{skill.description}</p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2">
        <ScopeBadge scope={skill.scope} />
        <Button size="sm" icon="play" onClick={() => onRun(skill)} className="relative z-10">
          {LIBRARY.run}
        </Button>
      </div>
    </article>
  )
}
