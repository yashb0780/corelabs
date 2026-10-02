/**
 * THE SKILL EDITOR at /skills/new and /skills/<id>/edit.
 *
 * Fields: name, description, category, scope, inputs, when to use,
 * instructions (markdown), output format, and the knowledge it uses.
 * Saving adds the skill to the library (src/lib/skills.js), where it lasts
 * until the page is reloaded, and opens its page.
 *
 * Only Workspace skills and My skills can be edited. A System skill's edit
 * address says so instead of showing the form. New skills can be My skills
 * or Workspace, never System.
 *
 * Every label is in content/skills/library.json.
 */
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import LIBRARY from '../../content/skills/library.json'
import { Checkbox, Field, SegmentedControl, Select, TagInput, TextArea, TextInput } from '../components/form'
import { PageShell } from '../components/layout/PageShell'
import { Button, EmptyState } from '../components/ui'
import { addSkill, canEdit, updateSkill, useSkills } from '../lib/skills'

const E = LIBRARY.editor
const F = E.fields

const BLANK = {
  name: '',
  description: '',
  category: LIBRARY.categories[0].id,
  scope: 'mine',
  inputs: ['account'],
  whenToUse: '',
  instructions: '',
  outputFormat: '',
  knowledge: [],
}

const FIELDS = Object.keys(BLANK)

function Form({ skill, skills }) {
  const navigate = useNavigate()
  const [form, setForm] = useState(() =>
    skill ? Object.fromEntries(FIELDS.map((k) => [k, skill[k]])) : BLANK,
  )
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))

  const toggleInput = (type, on) =>
    setForm((f) => ({
      ...f,
      inputs: on ? [...f.inputs, type] : f.inputs.filter((t) => t !== type),
    }))

  const valid = form.name.trim() && form.inputs.length > 0

  const save = () => {
    if (!valid) return
    const fields = { ...form, name: form.name.trim(), description: form.description.trim() }
    if (skill) {
      updateSkill(skill.id, fields)
      navigate(`/skills/${skill.id}`)
    } else {
      navigate(`/skills/${addSkill(fields)}`)
    }
  }

  // Suggest the knowledge other skills already use.
  const knownKnowledge = [...new Set(skills.flatMap((s) => s.knowledge))]

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
      className="lp-card max-w-3xl space-y-5"
    >
      <Field label={F.name.label} htmlFor="skill-name">
        <TextInput id="skill-name" value={form.name} onChange={set('name')} placeholder={F.name.placeholder} autoFocus />
      </Field>

      <Field label={F.description.label} htmlFor="skill-description">
        <TextInput
          id="skill-description"
          value={form.description}
          onChange={set('description')}
          placeholder={F.description.placeholder}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={F.category.label} htmlFor="skill-category">
          <Select
            id="skill-category"
            value={form.category}
            onChange={set('category')}
            options={LIBRARY.categories.map((c) => ({ value: c.id, label: c.label }))}
          />
        </Field>
        <Field label={F.scope.label} hint={F.scope.hint}>
          <SegmentedControl value={form.scope} onChange={set('scope')} options={E.scopeOptions} label={F.scope.label} />
        </Field>
      </div>

      <Field label={F.inputs.label} hint={F.inputs.hint}>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {Object.entries(LIBRARY.inputs).map(([type, input]) => (
            <label key={type} className="inline-flex cursor-pointer items-center gap-2 text-sm text-txt">
              <Checkbox
                checked={form.inputs.includes(type)}
                onChange={(on) => toggleInput(type, on)}
                label={input.label}
              />
              {input.label}
            </label>
          ))}
        </div>
      </Field>

      <Field label={F.whenToUse.label} htmlFor="skill-when">
        <TextArea id="skill-when" rows={3} value={form.whenToUse} onChange={set('whenToUse')} placeholder={F.whenToUse.placeholder} />
      </Field>

      <Field label={F.instructions.label} hint={F.instructions.hint} htmlFor="skill-instructions">
        <TextArea
          id="skill-instructions"
          rows={10}
          value={form.instructions}
          onChange={set('instructions')}
          placeholder={F.instructions.placeholder}
        />
      </Field>

      <Field label={F.outputFormat.label} htmlFor="skill-output">
        <TextArea id="skill-output" rows={4} value={form.outputFormat} onChange={set('outputFormat')} placeholder={F.outputFormat.placeholder} />
      </Field>

      <Field label={F.knowledge.label}>
        <TagInput
          values={form.knowledge}
          onChange={set('knowledge')}
          placeholder={F.knowledge.placeholder}
          suggestions={knownKnowledge}
        />
      </Field>

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button onClick={() => navigate(skill ? `/skills/${skill.id}` : '/skills')}>{E.cancel}</Button>
        <Button type="submit" variant="primary" icon="check" disabled={!valid}>
          {E.save}
        </Button>
      </div>
    </form>
  )
}

export default function SkillEditor() {
  const { skillId } = useParams()
  const skills = useSkills()
  const skill = skillId ? skills.find((s) => s.id === skillId) : null
  const crumbs = [LIBRARY.breadcrumbRoot, { label: LIBRARY.title, to: '/skills' }]

  if (skillId && (!skill || !canEdit(skill))) {
    const title = skill ? E.systemTitle : LIBRARY.detail.notFoundTitle
    return (
      <PageShell breadcrumb={[...crumbs, title]} title={title}>
        <EmptyState title={title}>
          {skill ? LIBRARY.readOnlyHint : LIBRARY.detail.notFoundBody}{' '}
          <Link to={skill ? `/skills/${skill.id}` : '/skills'} className="text-accent hover:underline">
            {LIBRARY.detail.backToSkills}
          </Link>
        </EmptyState>
      </PageShell>
    )
  }

  return (
    <PageShell
      breadcrumb={skill ? [...crumbs, { label: skill.name, to: `/skills/${skill.id}` }, E.editTitle] : [...crumbs, E.newTitle]}
      title={skill ? E.editTitle : E.newTitle}
      subtitle={skill ? skill.name : E.newSubtitle}
    >
      {/* Keyed so moving from one skill's editor to another starts fresh. */}
      <Form key={skillId ?? 'new'} skill={skill} skills={skills} />
    </PageShell>
  )
}
