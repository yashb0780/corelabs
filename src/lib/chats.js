/* ==========================================================================
   THE CHATS.

   Held at module scope, above the router, like the theme and the saved
   lists: the sidebar's Chats list, the New chat page and a thread all read
   the same chats, and every page renders its own PageShell, so anything kept
   in a page's state would be gone the moment you navigated.

   A reply is worked out the moment its prompt is sent, but lands after a
   short typing pause. The timer lives here too, so leaving a thread before
   the reply lands does not lose it.

   WHAT A CHAT LOOKS LIKE
     { id, title, createdAt, updatedAt, messages: [...] }
   Chats do not carry a seller type. That is set once at onboarding, in
   src/data/workspace.js, and every thread reads it from there.
   A user message is { id, from: 'user', text, at, skill? }. `skill` is set
   when a skill was attached in the chat box:
     { id, name, input: { type, id }, inputLabel }
   An agent message stores what it decided, never the companies it found:
     { id, from: 'agent', kind: 'results', filters: [{ id, negate }], icp: [] }
     { id, from: 'agent', kind: 'brief', companyId }
     { id, from: 'agent', kind: 'skill', skillId, input: { type, id } }
     { id, from: 'agent', kind: 'nomatch' }
   A skill run is scripted from the data each time it renders, by
   src/lib/skillRuns.js, the same way a result is.
   The companies are found again from src/data/companies.js every time a
   thread renders, so removing a filter chip simply re-runs the search.

   ON localStorage
   The guardrails otherwise rule out localStorage. Keeping chats across a
   reload is a sanctioned exception, added at the owner's request. It stores
   one key, `lp-chats`, holding { chats, chatsCollapsed }: the chats above
   (prompts and the filters picked) and whether the sidebar's Chats list is
   collapsed. Nothing else. See the note in CLAUDE.md.

   Before the Chats list could collapse, the key held the list of chats on
   its own. A value saved that way still loads, as expanded.
   ========================================================================== */

import { useSyncExternalStore } from 'react'
import REPLIES from '../../content/chat/replies.json'
import STARTERS from '../../content/chat/starter-chats.json'
import { interpret } from './intents'

const STORAGE_KEY = 'lp-chats'
/** Oldest chats beyond this are dropped when saving, so the key stays small. */
const MAX_KEPT = 50
const HOUR = 60 * 60 * 1000

let counter = 0
const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${(counter++).toString(36)}`

/** A chat started from a skill: "Account brief · Cummins", plus any text. */
function titleFor(text, skill) {
  if (!skill) return titleFrom(text)
  const base = skill.inputLabel ? `${skill.name} · ${skill.inputLabel}` : skill.name
  return text ? `${base}: ${titleFrom(text)}` : base
}

/** A chat's name: its first prompt, cut to a few words, capitalised. */
export function titleFrom(prompt) {
  const all = prompt.trim().replace(/[?.!]+$/, '').split(/\s+/)
  const cut = all.slice(0, REPLIES.titleWords).join(' ')
  const title = cut.charAt(0).toUpperCase() + cut.slice(1)
  return all.length > REPLIES.titleWords ? `${title}…` : title || REPLIES.untitled
}

/** The agent's reply to a prompt. See the shapes in the banner above. */
function replyTo(text, skill) {
  const base = { id: newId('m'), from: 'agent' }
  if (skill) return { ...base, kind: 'skill', skillId: skill.id, input: skill.input }
  const intent = interpret(text)
  if (intent.kind === 'results') return { ...base, kind: 'results', filters: intent.filters, icp: [] }
  if (intent.kind === 'brief') return { ...base, kind: 'brief', companyId: intent.companyId }
  return { ...base, kind: 'nomatch' }
}

const userMessage = (text, skill) => ({
  id: newId('m'),
  from: 'user',
  text,
  at: Date.now(),
  ...(skill ? { skill } : {}),
})

/* --- Loading and saving ------------------------------------------------- */

function starterChats() {
  const now = Date.now()
  return STARTERS.chats.map((s) => {
    const at = now - s.hoursAgo * HOUR
    return {
      id: s.id,
      title: titleFrom(s.prompt),
      createdAt: at,
      updatedAt: at,
      messages: [userMessage(s.prompt), replyTo(s.prompt)],
    }
  })
}

const isChat = (c) =>
  c && typeof c.id === 'string' && typeof c.title === 'string' && Array.isArray(c.messages)

/**
 * Saved chats if there are any, otherwise the starters, plus whether the
 * Chats list was collapsed. A chat saved while a reply was still typing
 * gets its reply now, so no thread is left hanging on an unanswered prompt.
 */
function load() {
  let saved = null
  try {
    saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    // Blocked storage or a damaged value. Start from the starters instead.
  }
  // The older shape: just the list of chats.
  if (Array.isArray(saved)) saved = { chats: saved }

  const chatsCollapsed = saved?.chatsCollapsed === true
  if (!Array.isArray(saved?.chats)) return { chats: starterChats(), chatsCollapsed }

  const chats = saved.chats.filter(isChat).map((c) => {
    const last = c.messages[c.messages.length - 1]
    return last?.from === 'user'
      ? { ...c, messages: [...c.messages, replyTo(last.text, last.skill)] }
      : c
  })
  return { chats, chatsCollapsed }
}

function save({ chats, chatsCollapsed }) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ chats: chats.slice(0, MAX_KEPT), chatsCollapsed }),
    )
  } catch {
    // Not being able to keep them is survivable: they still last the session.
  }
}

/* --- The store ---------------------------------------------------------- */

const listeners = new Set()
// `typing` holds the ids of chats waiting on a reply. It is never saved.
let state = { ...load(), typing: {} }

function set(next) {
  const changed = next.chats !== state.chats || next.chatsCollapsed !== state.chatsCollapsed
  state = next
  if (changed) save(state)
  listeners.forEach((fn) => fn())
}

function subscribe(onChange) {
  listeners.add(onChange)
  return () => listeners.delete(onChange)
}

const getState = () => state

/** Whether an address is the chat interface: /chat or a thread under it. */
export const isChatPath = (pathname) => pathname === '/chat' || pathname.startsWith('/chat/')

export function useChats() {
  return useSyncExternalStore(subscribe, getState, getState)
}

/** Newest activity first. */
export function recentChats(chats, limit) {
  return [...chats].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, limit)
}

function patchChat(id, fn) {
  set({ ...state, chats: state.chats.map((c) => (c.id === id ? fn(c) : c)) })
}

function setTyping(id, on) {
  const typing = { ...state.typing }
  if (on) typing[id] = true
  else delete typing[id]
  set({ ...state, typing })
}

/** Adds the user's message now and the reply after the typing pause. */
function ask(chatId, text, skill) {
  setTyping(chatId, true)
  const reply = replyTo(text, skill)
  window.setTimeout(() => {
    patchChat(chatId, (c) => ({ ...c, updatedAt: Date.now(), messages: [...c.messages, reply] }))
    setTyping(chatId, false)
  }, REPLIES.typingMs)
}

/** Collapses or expands the sidebar's Chats list. Remembered across reloads. */
export function toggleChatsCollapsed() {
  set({ ...state, chatsCollapsed: !state.chatsCollapsed })
}

/**
 * A new chat named after its first prompt, or after the skill attached to
 * it. Returns its id.
 */
export function startChat(prompt, skill = null) {
  const text = prompt.trim()
  const now = Date.now()
  const chat = {
    id: newId('chat'),
    title: titleFor(text, skill),
    createdAt: now,
    updatedAt: now,
    messages: [userMessage(text, skill)],
  }
  set({ ...state, chats: [chat, ...state.chats] })
  ask(chat.id, text, skill)
  return chat.id
}

/** A message with only a skill attached and no text is fine. */
export function sendMessage(chatId, prompt, skill = null) {
  const text = prompt.trim()
  if ((!text && !skill) || state.typing[chatId]) return
  patchChat(chatId, (c) => ({
    ...c,
    updatedAt: Date.now(),
    messages: [...c.messages, userMessage(text, skill)],
  }))
  ask(chatId, text, skill)
}

/**
 * Every time a skill was run from a chat in this browser, newest first, for
 * the Recent runs on its page: { chatId, at, input, inputLabel }.
 */
export function skillRunsIn(chats, skillId) {
  return chats
    .flatMap((c) =>
      c.messages
        .filter((m) => m.from === 'user' && m.skill?.id === skillId)
        .map((m) => ({ chatId: c.id, at: m.at ?? c.updatedAt, input: m.skill.input, inputLabel: m.skill.inputLabel })),
    )
    .sort((a, b) => b.at - a.at)
}

/** Changes one agent message, e.g. a removed filter chip. */
export function updateMessage(chatId, messageId, patch) {
  patchChat(chatId, (c) => ({
    ...c,
    messages: c.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
  }))
}
