/**
 * ACCOUNT PAGE, right rail card 3: JOB POSTINGS.
 *
 * Matched keywords inside each snippet get a tinted highlight, so it is
 * obvious which words triggered the signal.
 *
 * One file per section. To change this section, this is the only file to open.
 */
import { EMPTY_STATES } from '../../data/emptyStates'
import { EmptyNote, SectionCard } from '../ui'

/**
 * Splits a snippet around its matched keywords and tints the matches.
 * Case-insensitive, longest keyword first so overlaps resolve sensibly.
 */
function Highlighted({ text, keywords }) {
  if (!keywords || keywords.length === 0) return text

  const escaped = [...keywords]
    .sort((a, b) => b.length - a.length)
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi')

  const lowered = keywords.map((k) => k.toLowerCase())

  return text
    .split(pattern)
    .filter(Boolean)
    .map((part, i) =>
      lowered.includes(part.toLowerCase()) ? (
        <mark key={i} className="rounded-sm bg-accent-quiet px-0.5 text-accent">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      ),
    )
}

export function RailJobPostings({ company }) {
  const postings = company.jobPostings ?? []

  return (
    <SectionCard
      icon="briefcase"
      label="Job postings"
      aside={
        postings.length > 0 ? (
          <span className="text-2xs text-txt-3">{postings.length} recent</span>
        ) : null
      }
    >
      {postings.length === 0 ? (
        <EmptyNote>{EMPTY_STATES.jobPostings}</EmptyNote>
      ) : (
        <ul className="divide-y divide-line">
          {postings.map((p) => (
            <li key={p.title} className="py-2 first:pt-0 last:pb-0">
              <p className="text-sm font-name text-txt">{p.title}</p>
              <p className="text-2xs text-txt-3">
                {p.team} · {p.ageDays} days ago
              </p>
              <p className="mt-1 text-2xs text-txt-2">
                <Highlighted text={p.snippet} keywords={p.keywords} />
              </p>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  )
}
