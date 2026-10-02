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
     { id, title, archetype, createdAt, updatedAt, messages: [...] }
   A user message is { id, from: 'user', text }. An agent message stores
   what it decided, never the companies it found:
     { id, from: 'agent', kind: 'results', filters: [{ id, negate }], icp: [] }
     { id, from: 'agent', kind: 'brief', companyId }
     { id, from: 'agent', kind: 'nomatch' }
   The companies are found again from src/data/companies.js every time a
   thread renders, so removing a filter chip simply re-runs the search.

   ON localStorage
   The guardrails otherwise rule out localStorage. Keeping chats across a
   reload is a sanctioned exception, added at the owner's request. It stores
   one key, `lp-chats`, holding the chats above: prompts and the filters
   picked, nothing else. See the note in CLAUDE.md.
   ========================================================================== */

import { useSyncExternalStore } from 'react'
import REPLIES from '../../content/chat/replies.json'
import STARTERS from '../../content/chat/starter-chats.json'
import { DEFAULT_ARCHETYPE } from '../data/companies'
import { interpret } from './intents'

const STORAGE_KEY = 'lp-chats'
/** Oldest chats beyond this are dropped when saving, so the key stays small. */
const MAX_KEPT = 50
const HOUR = 60 * 60 * 1000

let counter = 0
const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${(counter++).toString(36)}`

/** A chat's name: its first prompt, cut to a few words, capitalised. */
export function titleFrom(prompt) {
  const all = prompt.trim().replace(/[?.!]+$/, '').split(/\s+/)
  const cut = all.slice(0, REPLIES.titleWords).join(' ')
  const title = cut.charAt(0).toUpperCase() + cut.slice(1)
  return all.length > REPLIES.titleWords ? `${title}…` : title || REPLIES.untitled
}

/** The agent's reply to a prompt. See the shapes in the banner above. */
function replyTo(text) {
  const intent = interpret(text)
  const base = { id: newId('m'), from: 'agent' }
  if (intent.kind === 'results') return { ...base, kind: 'results', filters: intent.filters, icp: [] }
  if (intent.kind === 'brief') return { ...base, kind: 'brief', companyId: intent.companyId }
  return { ...base, kind: 'nomatch' }
}

const userMessage = (text) => ({ id: newId('m'), from: 'user', text })

/* --- Loading and saving ------------------------------------------------- */

function starterChats() {
  const now = Date.now()
  return STARTERS.chats.map((s) => {
    const at = now - s.hoursAgo * HOUR
    return {
      id: s.id,
      title: titleFrom(s.prompt),
      archetype: DEFAULT_ARCHETYPE,
      createdAt: at,
      updatedAt: at,
      messages: [userMessage(s.prompt), replyTo(s.prompt)],
    }
  })
}

const isChat = (c) =>
  c && typeof c.id === 'string' && typeof c.title === 'string' && Array.isArray(c.messages)

/**
 * Saved chats if there are any, otherwise the starters. A chat saved while
 * a reply was still typing gets its reply now, so no thread is left hanging
 * on an unanswered prompt.
 */
function load() {
  let saved = null
  try {
    saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    // Blocked storage or a damaged value. Start from the starters instead.
  }
  if (!Array.isArray(saved)) return starterChats()

  return saved.filter(isChat).map((c) => {
    const last = c.messages[c.messages.length - 1]
    return last?.from === 'user' ? { ...c, messages: [...c.messages, replyTo(last.text)] } : c
  })
}

function save(chats) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(chats.slice(0, MAX_KEPT)))
  } catch {
    // Not being able to keep them is survivable: they still last the session.
  }
}

/* --- The store ---------------------------------------------------------- */

const listeners = new Set()
// `typing` holds the ids of chats waiting on a reply. It is never saved.
let state = { chats: load(), typing: {} }

function set(next) {
  const chatsChanged = next.chats !== state.chats
  state = next
  if (chatsChanged) save(state.chats)
  listeners.forEach((fn) => fn())
}

function subscribe(onChange) {
  listeners.add(onChange)
  return () => listeners.delete(onChange)
}

const getState = () => state

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
function ask(chatId, text) {
  setTyping(chatId, true)
  const reply = replyTo(text)
  window.setTimeout(() => {
    patchChat(chatId, (c) => ({ ...c, updatedAt: Date.now(), messages: [...c.messages, reply] }))
    setTyping(chatId, false)
  }, REPLIES.typingMs)
}

/** A new chat named after its first prompt. Returns its id. */
export function startChat(prompt, archetype = DEFAULT_ARCHETYPE) {
  const text = prompt.trim()
  const now = Date.now()
  const chat = {
    id: newId('chat'),
    title: titleFrom(text),
    archetype,
    createdAt: now,
    updatedAt: now,
    messages: [userMessage(text)],
  }
  set({ ...state, chats: [chat, ...state.chats] })
  ask(chat.id, text)
  return chat.id
}

export function sendMessage(chatId, prompt) {
  const text = prompt.trim()
  if (!text || state.typing[chatId]) return
  patchChat(chatId, (c) => ({
    ...c,
    updatedAt: Date.now(),
    messages: [...c.messages, userMessage(text)],
  }))
  ask(chatId, text)
}

export function setChatArchetype(chatId, archetype) {
  patchChat(chatId, (c) => ({ ...c, archetype }))
}

/** Changes one agent message, e.g. a removed filter chip. */
export function updateMessage(chatId, messageId, patch) {
  patchChat(chatId, (c) => ({
    ...c,
    messages: c.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
  }))
}
