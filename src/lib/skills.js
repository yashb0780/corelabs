/* ==========================================================================
   THE SKILLS LIBRARY.

   The seed skills are the markdown files in content/skills/, read when the
   app loads. Held at module scope like the saved lists, so a skill written
   or edited on the Skills screens is still there after navigating to a chat
   and back.

   In memory only. A reload goes back to the files, so a new skill, or an
   edit to a Workspace skill, lasts until then. That keeps the guardrail on
   localStorage intact: no new key.

   A skill:
     { id, name, description, category, scope, order, inputs: [type],
       knowledge: [text], example, whenToUse, instructions, outputFormat,
       seeded }
   scope is 'system', 'workspace' or 'mine'. inputs are the types in
   content/skills/library.json: account, list, segment, campaign, workspace.
   `example` is what the Example output runs on (a company or campaign id).
   `seeded` marks a skill that came from a file: only those have a scripted
   run in src/lib/skillRuns.js.
   ========================================================================== */

import { useSyncExternalStore } from 'react'
import LIBRARY from '../../content/skills/library.json'
import { parseFrontmatter, splitSections } from './frontmatter'

const FILES = import.meta.glob('../../content/skills/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const asList = (v) => (Array.isArray(v) ? v : v ? [v] : [])

function fromFile(path, text) {
  const id = path.split('/').pop().replace(/\.md$/, '')
  const { data, body } = parseFrontmatter(text)
  const sections = splitSections(body)
  return {
    id,
    name: data.name ?? id,
    description: data.description ?? '',
    category: data.category ?? LIBRARY.categories[0].id,
    scope: data.scope ?? 'workspace',
    order: data.order ?? 99,
    inputs: asList(data.inputs),
    knowledge: asList(data.knowledge),
    example: data.example ?? null,
    whenToUse: sections['when to use'] ?? '',
    instructions: sections.instructions ?? '',
    outputFormat: sections['output format'] ?? '',
    seeded: true,
  }
}

const CATEGORY_ORDER = LIBRARY.categories.map((c) => c.id)

/** Category order from library.json, then each skill's own order. */
const byPlace = (a, b) =>
  CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) ||
  a.order - b.order ||
  a.name.localeCompare(b.name)

const listeners = new Set()
let skills = Object.entries(FILES)
  .map(([path, text]) => fromFile(path, text))
  .sort(byPlace)

function set(next) {
  skills = [...next].sort(byPlace)
  listeners.forEach((fn) => fn())
}

function subscribe(onChange) {
  listeners.add(onChange)
  return () => listeners.delete(onChange)
}

const getSkills = () => skills

export function useSkills() {
  return useSyncExternalStore(subscribe, getSkills, getSkills)
}

export function getSkill(id) {
  return skills.find((s) => s.id === id) ?? null
}

/** System skills are maintained by LeadPlus; the rest can be edited. */
export const canEdit = (skill) => skill.scope !== 'system'

/** "Competitor check" -> "competitor-check", made unique. */
function newId(name) {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'skill'
  let id = base
  for (let n = 2; skills.some((s) => s.id === id) || id === 'new'; n++) id = `${base}-${n}`
  return id
}

/** Adds a skill written in the editor. Returns its id. */
export function addSkill(fields) {
  const skill = {
    order: 99,
    example: null,
    ...fields,
    id: newId(fields.name),
    seeded: false,
  }
  set([...skills, skill])
  return skill.id
}

export function updateSkill(id, fields) {
  set(skills.map((s) => (s.id === id ? { ...s, ...fields } : s)))
}

/**
 * Skills whose name, description or category match the text, in library
 * order. Used by the picker in the chat box.
 */
export function searchSkills(list, query) {
  const q = query.trim().toLowerCase()
  if (!q) return list
  const label = (id) => LIBRARY.categories.find((c) => c.id === id)?.label ?? ''
  return list.filter((s) =>
    [s.name, s.description, label(s.category)].some((t) => t.toLowerCase().includes(q)),
  )
}
