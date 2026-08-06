/**
 * Inline stroke icons. Local, so there is no icon package and no runtime
 * request. Deliberately plain: 1.5px stroke, no fills, no color of their
 * own - they inherit the text color around them.
 *
 * TO ADD AN ICON: add an entry to `paths` on a 16x16 grid, then use it as
 * <Icon name="yourName" />.
 */
const paths = {
  target: (
    <>
      <circle cx="8" cy="8" r="6.25" />
      <circle cx="8" cy="8" r="3.25" />
      <circle cx="8" cy="8" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  layers: (
    <>
      <path d="M8 1.75 14.25 5 8 8.25 1.75 5z" />
      <path d="M1.75 8 8 11.25 14.25 8" />
      <path d="M1.75 11 8 14.25 14.25 11" />
    </>
  ),
  activity: (
    <>
      <path d="M1.75 8h3l2-4.5 2.5 9L11.5 8h2.75" />
    </>
  ),
  bookmark: (
    <>
      <path d="M4 2.25h8a.75.75 0 0 1 .75.75v10.75L8 11.25l-4.75 2.5V3a.75.75 0 0 1 .75-.75z" />
    </>
  ),
  megaphone: (
    <>
      <path d="M2 6.5 9.5 3v10L2 9.5z" />
      <path d="M9.5 5.2c1.6.3 2.5 1.3 2.5 2.8s-.9 2.5-2.5 2.8" />
      <path d="M4 9.8v2.7c0 .5.4.9.9.9h.8c.5 0 .9-.4.9-.9v-1.9" />
    </>
  ),
  sparkle: (
    <>
      <path d="M6 1.75 7.3 5.2 10.75 6.5 7.3 7.8 6 11.25 4.7 7.8 1.25 6.5 4.7 5.2z" />
      <path d="M11.75 9 12.4 10.85 14.25 11.5 12.4 12.15 11.75 14 11.1 12.15 9.25 11.5 11.1 10.85z" />
    </>
  ),
  book: (
    <>
      <path d="M2.25 3.25A1.5 1.5 0 0 1 3.75 1.75H8v12.5H3.75a1.5 1.5 0 0 1-1.5-1.5z" />
      <path d="M13.75 3.25a1.5 1.5 0 0 0-1.5-1.5H8v12.5h4.25a1.5 1.5 0 0 0 1.5-1.5z" />
    </>
  ),
  building: (
    <>
      <rect x="2.25" y="2.25" width="7" height="11.5" rx="1" />
      <path d="M9.25 6.5h4.5v7.25h-4.5" />
      <path d="M4.5 5h2.5M4.5 8h2.5M4.5 11h2.5M11 9h1.25" />
    </>
  ),
  users: (
    <>
      <circle cx="6" cy="5.5" r="2.6" />
      <path d="M1.75 13.5c0-2.3 1.9-3.9 4.25-3.9s4.25 1.6 4.25 3.9" />
      <path d="M11 3.3a2.4 2.4 0 0 1 0 4.6" />
      <path d="M12 9.9c1.4.5 2.25 1.8 2.25 3.6" />
    </>
  ),
  box: (
    <>
      <path d="M8 1.75 14.25 5v6L8 14.25 1.75 11V5z" />
      <path d="M1.75 5 8 8.25 14.25 5M8 8.25v6" />
    </>
  ),
  grid: (
    <>
      <rect x="2" y="2" width="5" height="5" rx="1" />
      <rect x="9" y="2" width="5" height="5" rx="1" />
      <rect x="2" y="9" width="5" height="5" rx="1" />
      <rect x="9" y="9" width="5" height="5" rx="1" />
    </>
  ),
  settings: (
    <>
      <circle cx="8" cy="8" r="2.4" />
      <path d="M8 1.5v1.8M8 12.7v1.8M14.5 8h-1.8M3.3 8H1.5M12.6 3.4l-1.3 1.3M4.7 11.3l-1.3 1.3M12.6 12.6l-1.3-1.3M4.7 4.7 3.4 3.4" />
    </>
  ),
  search: (
    <>
      <circle cx="7" cy="7" r="4.75" />
      <path d="M10.5 10.5 14 14" />
    </>
  ),
  filter: (
    <>
      <path d="M2 3h12l-4.4 5v5.2L6.4 11.5V8z" />
    </>
  ),
  moon: (
    <>
      <path d="M13.2 9.7A5.6 5.6 0 0 1 6.3 2.8a5.75 5.75 0 1 0 6.9 6.9z" />
    </>
  ),
  sun: (
    <>
      <circle cx="8" cy="8" r="3.1" />
      <path d="M8 1.4v1.6M8 13v1.6M14.6 8H13M3 8H1.4M12.7 3.3l-1.1 1.1M4.4 11.6l-1.1 1.1M12.7 12.7l-1.1-1.1M4.4 4.4 3.3 3.3" />
    </>
  ),
  chevronDown: (
    <>
      <path d="M4 6.25 8 10.25l4-4" />
    </>
  ),
  chevronLeft: (
    <>
      <path d="M10 3.5 5.5 8l4.5 4.5" />
    </>
  ),
  chevronRight: (
    <>
      <path d="M6 3.5 10.5 8 6 12.5" />
    </>
  ),
  arrowDown: (
    <>
      <path d="M8 3v10M4.25 9.25 8 13l3.75-3.75" />
    </>
  ),
  plus: (
    <>
      <path d="M8 3.25v9.5M3.25 8h9.5" />
    </>
  ),
  check: (
    <>
      <path d="M3 8.5 6.25 11.75 13 5" />
    </>
  ),
}

export function Icon({ name, className = 'size-4' }) {
  const d = paths[name]
  if (!d) return null
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {d}
    </svg>
  )
}
