/**
 * Renders the small part of markdown the skills use, so a skill's
 * instructions read like a SKILL.md and a skill run reads like an answer.
 * Written here rather than added as a library.
 *
 * Understood:
 *   ## Heading, ### Heading   section headings
 *   1. step                   numbered lists
 *   - item                    bullet lists; indent a line to nest it once
 *   > line                    a quoted block, line breaks kept (emails)
 *   **bold**, `code`          inside any line
 * Lines next to each other form one paragraph, keeping their line breaks.
 * A blank line starts a new block.
 *
 * Nothing is read as HTML, so text in a skill can never inject markup.
 */
import { Fragment } from 'react'
import { cx } from './cx'

/* --- Reading ------------------------------------------------------------ */

const ITEM = /^(\s*)(?:[-*]|(\d+)[.)])\s+(.*)$/

function parse(source) {
  const blocks = []
  let para = null
  let list = null
  let quote = null

  const close = () => {
    para = null
    list = null
    quote = null
  }

  for (const raw of String(source ?? '').replace(/\r/g, '').split('\n')) {
    const line = raw.replace(/\s+$/, '')

    if (!line.trim()) {
      close()
      continue
    }

    const h = line.match(/^(#{1,4})\s+(.*)$/)
    if (h) {
      close()
      blocks.push({ type: 'heading', level: h[1].length, text: h[2] })
      continue
    }

    const q = line.match(/^>\s?(.*)$/)
    if (q) {
      if (!quote) {
        close()
        quote = { type: 'quote', lines: [] }
        blocks.push(quote)
      }
      quote.lines.push(q[1])
      continue
    }

    const item = line.match(ITEM)
    if (item) {
      const [, indent, number, text] = item
      const ordered = number !== undefined
      // An indented item nests under the last item of the list above it.
      if (indent.length >= 2 && list?.items.length) {
        const parent = list.items[list.items.length - 1]
        parent.children ??= { ordered, items: [] }
        parent.children.items.push({ text })
        continue
      }
      if (!list || list.ordered !== ordered) {
        para = null
        quote = null
        list = { type: 'list', ordered, items: [] }
        blocks.push(list)
      }
      list.items.push({ text })
      continue
    }

    // An indented plain line carries on the list item above it.
    if (list && /^\s{2,}/.test(raw)) {
      list.items[list.items.length - 1].text += ` ${line.trim()}`
      continue
    }

    if (!para) {
      list = null
      quote = null
      para = { type: 'para', lines: [] }
      blocks.push(para)
    }
    para.lines.push(line)
  }
  return blocks
}

/* --- Drawing ------------------------------------------------------------ */

function Inline({ text }) {
  return String(text)
    .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
    .filter(Boolean)
    .map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**'))
        return (
          <strong key={i} className="font-label text-txt">
            {part.slice(2, -2)}
          </strong>
        )
      if (part.startsWith('`') && part.endsWith('`'))
        return (
          <code key={i} className="rounded-sm bg-surface-sunken px-1 py-px font-mono text-2xs text-txt">
            {part.slice(1, -1)}
          </code>
        )
      return <Fragment key={i}>{part}</Fragment>
    })
}

function Lines({ lines }) {
  return lines.map((l, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      <Inline text={l} />
    </Fragment>
  ))
}

function List({ ordered, items }) {
  const Tag = ordered ? 'ol' : 'ul'
  return (
    <Tag className={cx('space-y-1 pl-5 marker:text-txt-3', ordered ? 'list-decimal' : 'list-disc')}>
      {items.map((item, i) => (
        <li key={i} className="pl-0.5">
          <Inline text={item.text} />
          {item.children && (
            <div className="mt-1">
              <List {...item.children} />
            </div>
          )}
        </li>
      ))}
    </Tag>
  )
}

/**
 * `body` is the colour of plain text: 'muted' (txt-2) on a skill's page,
 * 'strong' (txt) for an answer in a chat, matching the chat's other text.
 */
export function Markdown({ source, body = 'muted', className }) {
  const blocks = parse(source)
  return (
    <div className={cx('space-y-2.5 text-sm', body === 'strong' ? 'text-txt' : 'text-txt-2', className)}>
      {blocks.map((b, i) => {
        if (b.type === 'heading')
          return (
            <p key={i} className={cx('font-label text-txt', i > 0 && 'pt-1.5')}>
              <Inline text={b.text} />
            </p>
          )
        if (b.type === 'list') return <List key={i} {...b} />
        if (b.type === 'quote')
          return (
            <blockquote key={i} className="rounded-md border border-line bg-surface-sunken px-3.5 py-2.5 text-txt">
              <Lines lines={b.lines} />
            </blockquote>
          )
        return (
          <p key={i}>
            <Lines lines={b.lines} />
          </p>
        )
      })}
    </div>
  )
}
