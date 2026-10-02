/**
 * NEW CHAT - the empty state at /chat, modelled on Attio's home.
 *
 * A greeting, a link back to the most recent chat, a large composer, three
 * suggestion chips and a quiet list of today's signals. No tables.
 *
 * Sending, or clicking a chip, starts a chat named after the prompt and
 * opens it at /chat/<id>, where the reply lands.
 *
 * Copy: content/chat/home.json, including the name in the greeting.
 */
import { Link, useNavigate } from 'react-router-dom'
import HOME from '../../content/chat/home.json'
import { Icon } from '../components/Icon'
import { Composer } from '../components/chat/Composer'
import { SignalsList } from '../components/chat/SignalsList'
import { TopBar } from '../components/layout/TopBar'
import { ActionPill } from '../components/ui'
import { recentChats, startChat, useChats } from '../lib/chats'
import { fill } from '../lib/fill'

function greeting(now = new Date()) {
  const hour = now.getHours()
  const { morning, afternoon, evening } = HOME.greetingHours
  const part =
    hour >= morning && hour < afternoon
      ? 'morning'
      : hour >= afternoon && hour < evening
        ? 'afternoon'
        : 'evening'
  return fill(HOME.greetings[part], { name: HOME.greetingName })
}

export default function ChatHome() {
  const navigate = useNavigate()
  const { chats } = useChats()
  const recent = recentChats(chats, 1)[0]

  const start = (text) => navigate(`/chat/${startChat(text)}`)

  return (
    <div className="flex h-full min-w-0 flex-col">
      <TopBar breadcrumb={[HOME.breadcrumb]} />

      <main className="flex-1 overflow-y-auto bg-surface">
        <div
          className="mx-auto px-6 pb-24"
          style={{ maxWidth: 'var(--lp-chat-w)', paddingTop: 'var(--lp-chat-home-top)' }}
        >
          <h1 className="text-title text-txt">{greeting()}</h1>

          <div className="mt-8 space-y-2">
            {recent && (
              <Link
                to={`/chat/${recent.id}`}
                className="group inline-flex max-w-full items-center gap-1.5 px-1 text-xs text-txt-3 transition-colors duration-150 ease-lp hover:text-txt"
              >
                <Icon name="clock" className="size-3.5 shrink-0" />
                <span className="shrink-0">{HOME.recentLabel}:</span>
                <span className="truncate font-name text-txt-2 group-hover:text-txt">
                  {recent.title}
                </span>
                <Icon name="arrowRight" className="size-3 shrink-0" />
              </Link>
            )}
            <Composer
              placeholder={HOME.placeholder}
              onSend={start}
              autoFocus
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {HOME.suggestions.map((s) => (
              <ActionPill key={s} onClick={() => start(s)}>
                {s}
              </ActionPill>
            ))}
          </div>

          <div className="mt-14">
            <SignalsList />
          </div>
        </div>
      </main>
    </div>
  )
}
