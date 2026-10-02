/* ==========================================================================
   READING A SKILL FILE.

   A skill in content/skills/ is a markdown file that starts with a block of
   settings between two --- lines (its "frontmatter"), then a body split into
   sections by ## headings. This reads both. Pure logic, no UI.

   Only the small part of the format the skill files use is understood, so
   no library is needed:
     key: plain text            text, which may itself contain colons
     key: [one, two, three]     a list; items cannot contain commas
     key: 3                     a number
   ========================================================================== */

function value(raw) {
  const v = raw.trim()
  if (v.startsWith('[') && v.endsWith(']')) {
    return v
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean)
  }
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v)
  return v.replace(/^["']|["']$/g, '')
}

/** "---\nname: X\n---\nbody" -> { data: { name: 'X' }, body: 'body' }. */
export function parseFrontmatter(text) {
  const match = String(text).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: String(text) }

  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const at = line.indexOf(':')
    if (at < 1 || line.trim().startsWith('#')) continue
    data[line.slice(0, at).trim()] = value(line.slice(at + 1))
  }
  return { data, body: match[2] }
}

/**
 * The body's ## sections, keyed by heading in lower case:
 * "## When to use\n..." -> { 'when to use': '...' }. Anything before the
 * first ## heading is ignored.
 */
export function splitSections(body) {
  const sections = {}
  let current = null
  for (const line of body.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+?)\s*$/)
    if (heading) {
      current = heading[1].toLowerCase()
      sections[current] = []
    } else if (current) {
      sections[current].push(line)
    }
  }
  return Object.fromEntries(
    Object.entries(sections).map(([k, lines]) => [k, lines.join('\n').trim()]),
  )
}
