/**
 * The left sidebar: "New chat" at the top, three sections of navigation,
 * the five most recent chats, then the prototype pill and the Collapse
 * control at the bottom.
 *
 * While you are in Settings the whole menu is swapped out for the settings
 * list, with a back chevron at the top, rather than showing a second column
 * next to it. There is only ever one nav column on screen.
 *
 * TO CHANGE THE MENU: edit the NAV_SECTIONS array below. The settings list
 * comes from SETTINGS_NAV in src/data/sections.js. The chat labels come from
 * content/chat/home.json, and the chats themselves from src/lib/chats.js.
 */
import { useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import HOME from '../../../content/chat/home.json'
import { Icon } from '../Icon'
import { cx } from '../cx'
import { SETTINGS_NAV, SETTINGS_SIDEBAR_COPY } from '../../data/sections'
import { recentChats, useChats } from '../../lib/chats'
import {
  activeSettingsNavId,
  isSettingsPath,
  rememberReturnPath,
  settingsReturnPath,
} from '../../lib/settings'

const NAV_SECTIONS = [
  {
    label: 'Workspace',
    items: [
      { to: '/leads', label: 'Leads', icon: 'target' },
      { to: '/segments', label: 'Segments', icon: 'layers' },
      { to: '/signals', label: 'Signals', icon: 'activity' },
      { to: '/saved-lists', label: 'Saved lists', icon: 'bookmark' },
      { to: '/campaigns', label: 'Campaigns', icon: 'megaphone' },
      { to: '/reports', label: 'Reports', icon: 'barChart' },
    ],
  },
  {
    label: 'Tools',
    items: [
      { to: '/generate', label: 'Generate', icon: 'sparkle' },
      { to: '/resources', label: 'Resources', icon: 'book' },
    ],
  },
  {
    label: 'Admin',
    items: [
      // One link. Tenant, Vendor, Customer and Workspace are sections inside
      // Settings, and clicking this swaps the sidebar over to that list.
      { to: '/settings', label: 'Settings', icon: 'settings' },
    ],
  },
]

/**
 * One navigation row, used by both the normal menu and the settings list so
 * the two always look the same.
 *
 * `end` makes it active only on its exact address, not the ones below it.
 * `active` marks it active on an address outside its own.
 */
function NavRow({ to, icon, label, collapsed, end, active = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cx(
          'group flex items-center gap-2.5 rounded-md py-1.5 text-sm transition-colors duration-150 ease-lp',
          collapsed ? 'justify-center px-0' : 'px-2',
          isActive || active
            ? 'bg-accent-quiet text-accent font-name'
            : 'text-txt-2 hover:bg-surface-hover hover:text-txt',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            name={icon}
            className={cx(
              'size-3.5 shrink-0',
              isActive || active
                ? 'text-accent'
                : 'text-txt-3 group-hover:text-txt-2',
            )}
          />
          {!collapsed && <span className="truncate">{label}</span>}
        </>
      )}
    </NavLink>
  )
}

/* --- The normal app menu ------------------------------------------------ */

function ProductMark({ collapsed }) {
  return (
    <NavLink
      to="/leads"
      className="flex items-center gap-2 rounded-md text-sm font-label text-txt"
    >
      <span
        aria-hidden="true"
        className="grid size-5 shrink-0 place-items-center rounded border border-line-strong font-mono text-2xs font-num text-accent"
      >
        L
      </span>
      {!collapsed && 'LeadPlus'}
    </NavLink>
  )
}

/** How many chats the Chats group lists. */
const RECENT_CHATS = 5

/**
 * The most recent chats by title. Hidden when the sidebar is collapsed:
 * five identical chat icons would tell you nothing.
 */
function ChatsNav({ collapsed }) {
  const { chats } = useChats()
  const recent = recentChats(chats, RECENT_CHATS)
  if (collapsed || !recent.length) return null

  return (
    <div>
      <p className="lp-label px-2 pb-1.5">{HOME.sidebar.chatsLabel}</p>
      <div className="space-y-0.5">
        {recent.map((c) => (
          <NavRow key={c.id} to={`/chat/${c.id}`} label={c.title} icon="chat" collapsed={collapsed} />
        ))}
      </div>
    </div>
  )
}

function MainNav({ collapsed }) {
  return (
    <nav aria-label="Main" className="flex-1 space-y-5 overflow-y-auto px-2 py-3">
      {/* `end`, so it is lit on the New chat page but not inside a chat. */}
      <NavRow to="/chat" end label={HOME.sidebar.newChat} icon="plus" collapsed={collapsed} />

      {NAV_SECTIONS.map((section) => (
        <div key={section.label}>
          {!collapsed && (
            <p className="lp-label px-2 pb-1.5">{section.label}</p>
          )}
          <div className="space-y-0.5">
            {section.items.map((item) => (
              <NavRow key={item.to} {...item} collapsed={collapsed} />
            ))}
          </div>
        </div>
      ))}

      <ChatsNav collapsed={collapsed} />
    </nav>
  )
}

/* --- The settings list, shown instead of the menu while in Settings ----- */

function SettingsBack({ collapsed }) {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(settingsReturnPath())}
      aria-label={SETTINGS_SIDEBAR_COPY.back}
      title={SETTINGS_SIDEBAR_COPY.back}
      className={cx(
        'group flex items-center gap-2 rounded-md py-1 text-sm font-label text-txt transition-colors duration-150 ease-lp hover:bg-surface-hover',
        collapsed ? 'justify-center px-1' : '-ml-1 pr-2 pl-1',
      )}
    >
      <Icon
        name="chevronLeft"
        className="size-4 shrink-0 text-txt-3 group-hover:text-txt"
      />
      {!collapsed && SETTINGS_SIDEBAR_COPY.title}
    </button>
  )
}

function SettingsNav({ collapsed, pathname }) {
  const activeId = activeSettingsNavId(pathname)

  return (
    <nav
      aria-label={SETTINGS_SIDEBAR_COPY.title}
      className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3"
    >
      {SETTINGS_NAV.map((n) => (
        // `end` so General, at /settings, is not also lit on /settings/tenant.
        // `active` lights the owning section on a card page, e.g. Tenant on
        // /tenant/users.
        <NavRow
          key={n.id}
          to={n.path}
          icon={n.icon}
          label={n.label}
          collapsed={collapsed}
          end
          active={n.id === activeId}
        />
      ))}
    </nav>
  )
}

/* --- The sidebar -------------------------------------------------------- */

export function Sidebar({ collapsed, onToggleCollapse }) {
  const location = useLocation()
  const inSettings = isSettingsPath(location.pathname)

  // Note every screen outside Settings, so the back chevron can return to
  // the last one. The sidebar never unmounts, so this sees every move.
  useEffect(() => {
    if (!inSettings) {
      rememberReturnPath(location.pathname + location.search + location.hash)
    }
  }, [inSettings, location])

  return (
    <div className="flex h-full flex-col border-r border-line bg-canvas">
      <div
        className={cx(
          'flex h-12 items-center border-b border-line',
          collapsed ? 'justify-center px-0' : 'px-3',
        )}
      >
        {inSettings ? (
          <SettingsBack collapsed={collapsed} />
        ) : (
          <ProductMark collapsed={collapsed} />
        )}
      </div>

      {inSettings ? (
        <SettingsNav collapsed={collapsed} pathname={location.pathname} />
      ) : (
        <MainNav collapsed={collapsed} />
      )}

      <div
        className={cx(
          'space-y-2 border-t border-line py-2.5',
          collapsed ? 'px-2' : 'px-3',
        )}
      >
        {!collapsed && (
          <span className="inline-flex items-center rounded-full border border-line bg-surface px-2 py-0.5 text-2xs text-txt-3">
            Prototype · dummy data
          </span>
        )}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cx(
            'flex w-full items-center gap-2 rounded-md py-1.5 text-xs text-txt-3 transition-colors duration-150 ease-lp hover:bg-surface-hover hover:text-txt-2',
            collapsed ? 'justify-center px-0' : 'px-2',
          )}
        >
          <Icon
            name={collapsed ? 'chevronRight' : 'chevronLeft'}
            className="size-3.5 shrink-0"
          />
          {!collapsed && 'Collapse'}
        </button>
      </div>
    </div>
  )
}
