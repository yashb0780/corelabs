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
  timeline: (
    <>
      <path d="M1.75 8h12.5" />
      <circle cx="4" cy="8" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="12" cy="8" r="1.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 4.5V8l2.4 1.6" />
    </>
  ),
  briefcase: (
    <>
      <rect x="1.75" y="4.75" width="12.5" height="8.5" rx="1.5" />
      <path d="M5.75 4.75V3.5a1 1 0 0 1 1-1h2.5a1 1 0 0 1 1 1v1.25" />
      <path d="M1.75 8.5h12.5" />
    </>
  ),
  download: (
    <>
      <path d="M8 2.5v7.5M4.75 7.25 8 10.5l3.25-3.25" />
      <path d="M2.5 12.25v.5a.75.75 0 0 0 .75.75h9.5a.75.75 0 0 0 .75-.75v-.5" />
    </>
  ),
  star: (
    <>
      <path d="M8 2 9.85 5.9l4.15.55-3.05 2.9.78 4.15L8 11.55 4.27 13.5l.78-4.15L2 6.45l4.15-.55z" />
    </>
  ),
  trendingUp: (
    <>
      <path d="M1.75 11.5 6 7.25l2.5 2.5L14.25 4" />
      <path d="M10.5 4h3.75v3.75" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M2.75 8h10.5M9.5 4.25 13.25 8 9.5 11.75" />
    </>
  ),
  network: (
    <>
      <circle cx="8" cy="3.25" r="1.75" />
      <circle cx="3.5" cy="12" r="1.75" />
      <circle cx="12.5" cy="12" r="1.75" />
      <path d="M8 5v3M6.6 9.4 4.6 10.7M9.4 9.4l2 1.3" />
    </>
  ),
  mail: (
    <>
      <rect x="1.75" y="3.25" width="12.5" height="9.5" rx="1.5" />
      <path d="m2.25 4.5 5.05 3.7a1.2 1.2 0 0 0 1.4 0l5.05-3.7" />
    </>
  ),
  chat: (
    <>
      <path d="M14.25 8.25c0 2.9-2.8 5.25-6.25 5.25a7.4 7.4 0 0 1-2.1-.3L2.25 14.25l1-2.85A4.9 4.9 0 0 1 1.75 8.25C1.75 5.35 4.55 3 8 3s6.25 2.35 6.25 5.25z" />
    </>
  ),
  plug: (
    <>
      <path d="M9.5 2.75 13.25 6.5a2.65 2.65 0 0 1 0 3.75l-1.5 1.5a2.65 2.65 0 0 1-3.75 0L4.25 8a2.65 2.65 0 0 1 0-3.75l1.5-1.5a2.65 2.65 0 0 1 3.75 0z" />
      <path d="M6.5 9.5 4 12M11.5 6.5 14 4" />
    </>
  ),
  map: (
    <>
      <path d="M1.75 4 6 2.25 10 4l4.25-1.75v9.5L10 13.5 6 11.75l-4.25 1.75z" />
      <path d="M6 2.25v9.5M10 4v9.5" />
    </>
  ),
  file: (
    <>
      <path d="M9 1.75H4.5a1.25 1.25 0 0 0-1.25 1.25v10a1.25 1.25 0 0 0 1.25 1.25h7a1.25 1.25 0 0 0 1.25-1.25V5.5z" />
      <path d="M9 1.75V5.5h3.75M5.75 8.75h4.5M5.75 11.25h3" />
    </>
  ),
  close: (
    <>
      <path d="M3.75 3.75 12.25 12.25M12.25 3.75 3.75 12.25" />
    </>
  ),
  /**
   * Solid speech bubble with three dots. The dots are holes cut by
   * fill-rule="evenodd" rather than shapes of their own, so whatever sits
   * behind the icon shows through them. That keeps the icon free of any
   * colour and lets it work on the accent in both themes.
   */
  chatFilled: (
    <path
      fill="currentColor"
      stroke="none"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.25 2.25h7.5a2.5 2.5 0 0 1 2.5 2.5v4.5a2.5 2.5 0 0 1-2.5 2.5H8l-3.05 2.44a0.5 0.5 0 0 1-0.81-0.39v-2.05a2.5 2.5 0 0 1-2.39-2.5v-4.5a2.5 2.5 0 0 1 2.5-2.5zM5.1 6.05a0.95 0.95 0 1 0 0 1.9 0.95 0.95 0 0 0 0-1.9zM8 6.05a0.95 0.95 0 1 0 0 1.9 0.95 0.95 0 0 0 0-1.9zM10.9 6.05a0.95 0.95 0 1 0 0 1.9 0.95 0.95 0 0 0 0-1.9z"
    />
  ),
  send: (
    <>
      <path d="M14.25 1.75 7.5 8.5" />
      <path d="M14.25 1.75 9.9 14.25l-2.4-5.75-5.75-2.4z" />
    </>
  ),
  barChart: (
    <>
      <path d="M1.75 14.25h12.5" />
      <path d="M4 11.5V8M8 11.5V3.5M12 11.5V6" />
    </>
  ),
  pieChart: (
    <>
      <path d="M8 1.75v6.25h6.25A6.25 6.25 0 1 1 8 1.75z" />
      <path d="M10.25 1.9a6.26 6.26 0 0 1 3.85 3.85h-3.85z" />
    </>
  ),
  refresh: (
    <>
      <path d="M13.25 8a5.25 5.25 0 1 1-1.54-3.71" />
      <path d="M13.25 2.5v3.25H10" />
    </>
  ),
  pencil: (
    <>
      <path d="M10.75 2.75 13.25 5.25 5.5 13H3v-2.5z" />
      <path d="M9.25 4.25 11.75 6.75" />
    </>
  ),
  trash: (
    <>
      <path d="M2.75 4.25h10.5M6.25 4.25V2.75h3.5v1.5" />
      <path d="M4 4.25l.6 8.75a1.25 1.25 0 0 0 1.25 1.15h4.3a1.25 1.25 0 0 0 1.25-1.15l.6-8.75" />
    </>
  ),
  /* Vertical three dots, the "more actions" menu on a table row. */
  more: (
    <>
      <circle cx="8" cy="3.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="8" cy="8" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="8" cy="12.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  userPlus: (
    <>
      <circle cx="6.25" cy="5.25" r="2.75" />
      <path d="M1.75 13.75c.5-2.4 2.2-3.75 4.5-3.75s4 1.35 4.5 3.75" />
      <path d="M12.75 5.25v4M10.75 7.25h4" />
    </>
  ),
  share: (
    <>
      <path d="M8 10V1.75M5 4.75l3-3 3 3" />
      <path d="M5.25 7H4a1.25 1.25 0 0 0-1.25 1.25V13A1.25 1.25 0 0 0 4 14.25h8A1.25 1.25 0 0 0 13.25 13V8.25A1.25 1.25 0 0 0 12 7h-1.25" />
    </>
  ),
  link: (
    <>
      <path d="M6.75 9.25a2.75 2.75 0 0 0 3.9 0l2.1-2.1a2.75 2.75 0 0 0-3.9-3.9l-.85.85" />
      <path d="M9.25 6.75a2.75 2.75 0 0 0-3.9 0l-2.1 2.1a2.75 2.75 0 0 0 3.9 3.9l.85-.85" />
    </>
  ),
  copy: (
    <>
      <rect x="5.25" y="5.25" width="9" height="9" rx="1.25" />
      <path d="M10.75 5.25V3a1.25 1.25 0 0 0-1.25-1.25H3A1.25 1.25 0 0 0 1.75 3v6.5A1.25 1.25 0 0 0 3 10.75h2.25" />
    </>
  ),
  pause: (
    <>
      <path d="M5.75 3.25v9.5M10.25 3.25v9.5" />
    </>
  ),
  play: (
    <>
      <path d="M4.75 2.75v10.5a.5.5 0 0 0 .76.43l8.2-5.25a.5.5 0 0 0 0-.86l-8.2-5.25a.5.5 0 0 0-.76.43z" />
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
