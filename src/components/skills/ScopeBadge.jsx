/**
 * The badge saying whose a skill is: System, Workspace or My skill. The
 * words and tone come from content/skills/library.json; the pill is the
 * same TonePill the Decision Phase uses.
 */
import LIBRARY from '../../../content/skills/library.json'
import { TonePill } from '../ui'

export function ScopeBadge({ scope }) {
  const s = LIBRARY.scopes[scope] ?? LIBRARY.scopes.workspace
  return <TonePill tone={s.tone}>{s.label}</TonePill>
}
