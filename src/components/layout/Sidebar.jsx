/**
 * The left sidebar: three sections of navigation, plus the prototype pill
 * and the Collapse control at the bottom.
 *
 * TO CHANGE THE MENU: edit the NAV_SECTIONS array below.
 */
import { NavLink } from 'react-router-dom'
import { Icon } from '../Icon'
import { cx } from '../cx'

const NAV_SECTIONS = [
  {
    label: 'Workspace',
    items: [
      { to: '/leads', label: 'Leads', icon: 'target' },
      { to: '/segments', label: 'Segments', icon: 'layers' },
      { to: '/signals', label: 'Signals', icon: 'activity' },
      { to: '/saved-lists', label: 'Saved lists', icon: 'bookmark' },
      { to: '/campaigns', label: 'Campaigns', icon: 'megaphone' },
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
      { to: '/admin/vendor', label: 'Vendor', icon: 'building' },
      { to: '/admin/customer', label: 'Customer', icon: 'users' },
      { to: '/admin/tenant', label: 'Tenant', icon: 'box' },
      { to: '/admin/workspace', label: 'Workspace', icon: 'grid' },
      { to: '/admin/settings', label: 'Settings', icon: 'settings' },
    ],
  },
]

function NavRow({ to, icon, label, collapsed }) {
  return (
    <NavLink
      to={to}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        cx(
          'group flex items-center gap-2.5 rounded-md py-1.5 text-sm transition-colors duration-150 ease-lp',
          collapsed ? 'justify-center px-0' : 'px-2',
          isActive
            ? 'bg-accent-quiet text-txt font-medium'
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
              isActive ? 'text-accent' : 'text-txt-3 group-hover:text-txt-2',
            )}
          />
          {!collapsed && <span className="truncate">{label}</span>}
        </>
      )}
    </NavLink>
  )
}

export function Sidebar({ collapsed, onToggleCollapse }) {
  return (
    <div className="flex h-full flex-col border-r border-line bg-canvas">
      {/* Product mark */}
      <div
        className={cx(
          'flex h-12 items-center border-b border-line',
          collapsed ? 'justify-center px-0' : 'px-3',
        )}
      >
        <NavLink
          to="/leads"
          className="flex items-center gap-2 rounded-md text-sm font-semibold text-txt"
        >
          <span
            aria-hidden="true"
            className="grid size-5 shrink-0 place-items-center rounded border border-line-strong font-mono text-2xs text-accent"
          >
            L
          </span>
          {!collapsed && 'LeadPlus'}
        </NavLink>
      </div>

      <nav
        aria-label="Main"
        className={cx(
          'flex-1 space-y-5 overflow-y-auto py-3',
          collapsed ? 'px-2' : 'px-2',
        )}
      >
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
      </nav>

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
