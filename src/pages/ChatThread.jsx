/**
 * A CHAT THREAD at /chat/<id>, modelled on Lightfield.
 *
 * The conversation on the left, with the composer pinned at the bottom.
 * Clicking a company in a result opens it in a panel on the right.
 *
 * The chat itself lives in src/lib/chats.js, so it survives navigating
 * away and back, and a reload. Each reply is drawn by AgentReply.jsx.
 *
 * The Window pills and the panel follow the workspace's seller type, set
 * at onboarding in src/data/workspace.js. Chat never changes it.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import HOME from '../../content/chat/home.json'
import REPLIES from '../../content/chat/replies.json'
import { AgentReply } from '../components/chat/AgentReply'
import { CompanyPanel } from '../components/chat/CompanyPanel'
import { Composer } from '../components/chat/Composer'
import { useListActions } from '../components/campaign/useListActions'
import { TopBar } from '../components/layout/TopBar'
import { EmptyState } from '../components/ui'
import { workspaceArchetype } from '../data/workspace'
import { sendMessage, useChats } from '../lib/chats'

function UserBubble({ text }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[80%] rounded-lg bg-surface-sunken px-3.5 py-2 text-sm whitespace-pre-wrap text-txt">
        {text}
      </p>
    </div>
  )
}

/** The same three dots as the floating assistant. */
function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-1" role="status" aria-label="LeadPlus is typing">
      {[0, 1, 2].map((i) => (
        <span key={i} className="lp-typing-dot size-1.5 rounded-full bg-txt-3" />
      ))}
    </span>
  )
}

function Thread({ chat, typing }) {
  const [openId, setOpenId] = useState(null)
  const actions = useListActions()
  const scrollRef = useRef(null)
  const closePanel = useCallback(() => setOpenId(null), [])
  const archetype = workspaceArchetype()

  // Keep the newest message in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [chat.messages.length, typing])

  // A suggested prompt under a "could not match" reply carries on in this
  // chat, as if it had been typed.
  const ask = (text) => sendMessage(chat.id, text)

  return (
    <div className="flex h-full min-w-0 flex-col">
      <TopBar breadcrumb={[{ label: REPLIES.breadcrumbRoot, to: '/chat' }, chat.title]} showSearch={false} />

      <div className="flex min-h-0 flex-1 bg-surface">
        <div className="flex min-w-0 flex-1 flex-col">
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            <div className="mx-auto space-y-6 px-6 pt-6 pb-4" style={{ maxWidth: 'var(--lp-chat-w)' }}>
              {chat.messages.map((m) =>
                m.from === 'user' ? (
                  <UserBubble key={m.id} text={m.text} />
                ) : (
                  <AgentReply
                    key={m.id}
                    chatId={chat.id}
                    message={m}
                    title={chat.title}
                    archetype={archetype}
                    openId={openId}
                    onOpen={(id) => setOpenId((cur) => (cur === id ? null : id))}
                    onPrompt={ask}
                    onAction={actions.run}
                  />
                ),
              )}
              {typing && <TypingDots />}
            </div>
          </div>

          <div className="mx-auto w-full shrink-0 px-6 pt-2 pb-5" style={{ maxWidth: 'var(--lp-chat-w)' }}>
            <Composer
              size="sm"
              placeholder={HOME.threadPlaceholder}
              onSend={ask}
              busy={typing}
              autoFocus
            />
          </div>
        </div>

        {openId && (
          <CompanyPanel companyId={openId} archetype={archetype} onClose={closePanel} />
        )}
      </div>

      {actions.overlay}
    </div>
  )
}

export default function ChatThread() {
  const { chatId } = useParams()
  const { chats, typing } = useChats()
  const chat = chats.find((c) => c.id === chatId)

  if (!chat) {
    return (
      <div className="flex h-full min-w-0 flex-col">
        <TopBar
          breadcrumb={[{ label: REPLIES.breadcrumbRoot, to: '/chat' }, REPLIES.notFound.title]}
          showSearch={false}
        />
        <main className="flex-1 overflow-y-auto bg-surface px-6 py-5">
          <EmptyState title={REPLIES.notFound.title}>
            {REPLIES.notFound.body}{' '}
            <Link to="/chat" className="text-accent hover:underline">
              {REPLIES.notFound.link}
            </Link>
          </EmptyState>
        </main>
      </div>
    )
  }

  // Keyed by chat so moving between chats closes the panel and resets the
  // composer.
  return <Thread key={chat.id} chat={chat} typing={Boolean(typing[chat.id])} />
}
