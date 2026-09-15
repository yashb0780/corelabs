/**
 * Dates and times for scheduling a campaign. Pure logic, no UI.
 *
 * A date is a "YYYY-MM-DD" string, which is what a date picker gives back.
 * A time is a 24 hour "HH:MM" string, which is what the time picker stores,
 * and is only ever shown to people as "9:00 AM". Everything is local time.
 */

const pad = (n) => String(n).padStart(2, '0')

/** "YYYY-MM-DD" for a Date, in local time. */
function iso(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** A Date for a date and time. Built from the parts, not parsed, so it
    never slips a day in a timezone behind UTC. */
export function toDate(dateIso, time = '00:00') {
  const [y, m, d] = dateIso.split('-').map(Number)
  const [h, min] = time.split(':').map(Number)
  return new Date(y, m - 1, d, h, min)
}

export const todayIso = () => iso(new Date())

export function addDays(dateIso, days) {
  const d = toDate(dateIso)
  d.setDate(d.getDate() + days)
  return iso(d)
}

export const tomorrowIso = () => addDays(todayIso(), 1)

/** The current minute as a date and a time, for something that happens now. */
export function nowParts() {
  const d = new Date()
  return { date: iso(d), time: `${pad(d.getHours())}:${pad(d.getMinutes())}` }
}

/*
 * A moment, stored as one "YYYY-MM-DDTHH:MM" string in local time: a sent
 * step, a reply, a pause. `joinAt` and `splitAt` convert to and from the
 * date and time pair the formatters below take.
 */
export const joinAt = (dateIso, time) => `${dateIso}T${time}`

export function splitAt(at) {
  const [date, time] = at.split('T')
  return { date, time }
}

/** Milliseconds since 1970 for a moment, so moments can be compared. */
export function atMs(at) {
  const { date, time } = splitAt(at)
  return toDate(date, time).getTime()
}

/** The moment for a number of milliseconds, to the minute. */
export function msToAt(ms) {
  const d = new Date(ms)
  return joinAt(iso(d), `${pad(d.getHours())}:${pad(d.getMinutes())}`)
}

export const nowAt = () => msToAt(Date.now())

/** When a sequence step sends: the start date plus the step's day offset,
    at the step's own time. Null while the step's day is blank. */
export function stepSend(start, step) {
  if (step.day === '') return null
  return { date: addDays(start.date, Number(step.day)), time: step.time }
}

/** True if the date and time have already gone by, or the date is blank. */
export function isPast(dateIso, time) {
  if (!dateIso) return true
  return toDate(dateIso, time) <= new Date()
}

/** "09:00" becomes "9:00 AM"; "13:30" becomes "1:30 PM". */
export function formatTime(time) {
  const [h, m] = time.split(':').map(Number)
  return `${h % 12 || 12}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`
}

/**
 * Every 15 minutes of the day, as options for the time picker. On today's
 * date, times that have already gone by are disabled rather than hidden,
 * so the list never jumps about.
 */
export function timeOptions(dateIso) {
  const past = dateIso === todayIso() ? new Date() : null
  const options = []
  for (let mins = 0; mins < 24 * 60; mins += 15) {
    const value = `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`
    options.push({
      value,
      label: formatTime(value),
      disabled: past ? toDate(dateIso, value) <= past : false,
    })
  }
  return options
}

// The year is added only when it is not this year, so near dates stay short.
const yearIfNeeded = (d) =>
  d.getFullYear() === new Date().getFullYear() ? '' : ` ${d.getFullYear()}`

/** "Friday, 11 September", for summary lines and toasts. */
export function formatLongDate(dateIso) {
  const d = toDate(dateIso)
  const weekday = d.toLocaleDateString('en-GB', { weekday: 'long' })
  const dayMonth = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
  return `${weekday}, ${dayMonth}${yearIfNeeded(d)}`
}

/** "Friday, 11 September at 9:00 AM". */
export function formatLongDateTime(dateIso, time) {
  return `${formatLongDate(dateIso)} at ${formatTime(time)}`
}

// Spelled out rather than left to the browser, which writes September as
// "Sept" in some places and "Sep" in others.
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** "Mon 14 Sep, 9:00 AM", for the resolved date beside a sequence step. */
export function formatShortDateTime(dateIso, time) {
  const d = toDate(dateIso)
  const date = `${SHORT_DAYS[d.getDay()]} ${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`
  return `${date}${yearIfNeeded(d)}, ${formatTime(time)}`
}
