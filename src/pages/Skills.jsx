/**
 * SKILLS - the library at /skills. No brief; modelled on how Attio and
 * Lightfield present saved agent instructions.
 *
 * Tabs filter by scope (All, Workspace, My skills, System). Under them the
 * skills are grouped by category, one card each. A card opens the skill's
 * page; its Run button opens a new chat with the skill attached.
 *
 * The skills are the files in content/skills/, held by src/lib/skills.js.
 * Every word on the page is in content/skills/library.json.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LIBRARY from '../../content/skills/library.json'
import { PageShell } from '../components/layout/PageShell'
import { SkillCard } from '../components/skills/SkillCard'
import { Button, EmptyNote, SectionLabel, Tabs } from '../components/ui'
import { useSkills } from '../lib/skills'

export default function Skills() {
  const navigate = useNavigate()
  const skills = useSkills()
  const [tab, setTab] = useState('all')

  const inTab = (t) => (t === 'all' ? skills : skills.filter((s) => s.scope === t))
  const shown = inTab(tab)
  const groups = LIBRARY.categories
    .map((c) => ({ ...c, skills: shown.filter((s) => s.category === c.id) }))
    .filter((g) => g.skills.length)

  const run = (skill) => navigate('/chat', { state: { skillId: skill.id } })

  return (
    <PageShell
      breadcrumb={[LIBRARY.breadcrumbRoot, LIBRARY.title]}
      title={LIBRARY.title}
      subtitle={LIBRARY.subtitle}
      actions={
        <Button variant="primary" icon="plus" onClick={() => navigate('/skills/new')}>
          {LIBRARY.newSkill}
        </Button>
      }
    >
      <Tabs
        tabs={LIBRARY.tabs.map((t) => ({ ...t, count: inTab(t.id).length }))}
        value={tab}
        onChange={setTab}
        label={LIBRARY.title}
        idPrefix="skills"
      />

      <div
        role="tabpanel"
        id={`skills-panel-${tab}`}
        aria-labelledby={`skills-tab-${tab}`}
        className="space-y-6 pt-5"
      >
        {groups.length === 0 && <EmptyNote>{LIBRARY.emptyTab}</EmptyNote>}
        {groups.map((g) => (
          <section key={g.id}>
            <SectionLabel className="pb-[var(--lp-label-gap)]">{g.label}</SectionLabel>
            <div className="grid gap-[var(--lp-card-gap)] sm:grid-cols-2 xl:grid-cols-3">
              {g.skills.map((s) => (
                <SkillCard key={s.id} skill={s} onRun={run} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  )
}
