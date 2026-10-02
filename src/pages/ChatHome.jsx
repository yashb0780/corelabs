/**
 * NEW CHAT - the empty state at /chat, modelled on Attio's home.
 *
 * A greeting, a large composer and three suggestion chips, centred on the
 * page and nothing else. The sidebar's Chats list is the way back into an
 * earlier chat, so the page does not repeat it.
 *
 * The top bar has no company search here, and the floating assistant
 * button is hidden (see AssistantWidget.jsx): this page is already a chat.
 *
 * Sending, or clicking a chip, starts a chat named after the prompt and
 * opens it at /chat/<id>, where the reply lands.
 *
 * Copy: content/chat/home.json, including the name in the greeting.
 */
import { useNavigate } from 'react-router-dom'
import HOME from '../../content/chat/home.json'
import { Composer } from '../components/chat/Composer'
import { TopBar } from '../components/layout/TopBar'
import { ActionPill } from '../components/ui'
import { startChat } from '../lib/chats'
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
  const start = (text) => navigate(`/chat/${startChat(text)}`)

  return (
    <div className="flex h-full min-w-0 flex-col">
      <TopBar breadcrumb={[HOME.breadcrumb]} showSearch={false} />

      <main className="flex-1 overflow-y-auto bg-surface">
        {/* Centred in the space below the top bar. The extra padding at the
            bottom lifts the group a little above the true middle, which
            reads as centred; dead centre looks low. */}
        <div
          className="mx-auto flex min-h-full flex-col justify-center px-6 pt-10 pb-[18vh]"
          style={{ maxWidth: 'var(--lp-chat-w)' }}
        >
          <h1 className="text-center text-title text-txt">{greeting()}</h1>

          <div className="mt-8">
            <Composer placeholder={HOME.placeholder} onSend={start} autoFocus />
          </div>

          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {HOME.suggestions.map((s) => (
              <ActionPill key={s} onClick={() => start(s)}>
                {s}
              </ActionPill>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
