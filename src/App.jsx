/**
 * The app frame: sidebar on the left, the current screen on the right.
 *
 * TO ADD A SCREEN: create a file in src/pages/, then add a <Route> below and
 * a nav item in src/components/layout/Sidebar.jsx.
 */
import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AssistantWidget } from './components/layout/AssistantWidget'
import { Sidebar } from './components/layout/Sidebar'
import AccountDetail from './pages/AccountDetail'
import AdminSection from './pages/AdminSection'
import Campaigns from './pages/Campaigns'
import Generate from './pages/Generate'
import Leads from './pages/Leads'
import NotFound from './pages/NotFound'
import ReportDetail from './pages/ReportDetail'
import Reports from './pages/Reports'
import Resources from './pages/Resources'
import SavedLists from './pages/SavedLists'
import SectionPage from './pages/SectionPage'
import Segments from './pages/Segments'
import Settings from './pages/Settings'
import Signals from './pages/Signals'
import VendorProfile from './pages/VendorProfile'
import { SECTIONS, SETTINGS_NAV } from './data/sections'

export default function App() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-dvh overflow-hidden bg-canvas">
      <aside
        className="shrink-0 transition-[width] duration-150 ease-lp"
        style={{
          width: collapsed
            ? 'var(--spacing-sidebar-collapsed)'
            : 'var(--spacing-sidebar)',
        }}
      >
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
      </aside>

      <div className="min-w-0 flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/leads" replace />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/leads/:companyId" element={<AccountDetail />} />
          <Route path="/segments" element={<Segments />} />
          <Route path="/signals" element={<Signals />} />
          <Route path="/saved-lists" element={<SavedLists />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/:reportId" element={<ReportDetail />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/resources" element={<Resources />} />

          {/* Vendor Profile is a real screen rather than a card placeholder.
              A static path outranks the dynamic /:sectionId/:cardId below it,
              so this wins regardless of order. */}
          <Route path="/vendor/vendor-profile" element={<VendorProfile />} />

          {/* Settings: one page, one address per section (/settings,
              /settings/tenant, ...). Built from SETTINGS_NAV in
              src/data/sections.js. These fixed addresses outrank the
              /settings/:cardId card pages below, and no card shares a
              section's slug. */}
          {SETTINGS_NAV.map((n) => (
            <Route
              key={`settings-${n.id}`}
              path={n.path}
              element={<Settings sectionId={n.id} />}
            />
          ))}

          {/* One page per card, at the address it has always had, e.g.
              /tenant/users or /settings/emails. Adding a card to
              src/data/sections.js is all it takes to add one. */}
          {SECTIONS.map((s) => (
            <Route
              key={`${s.id}-card`}
              path={`/${s.id}/:cardId`}
              element={<SectionPage sectionId={s.id} />}
            />
          ))}

          {/* Before Settings was one page, Tenant, Vendor, Customer and
              Workspace each had an address of their own. Those still work
              and forward to the matching section, so no old link breaks. */}
          {SETTINGS_NAV.filter((n) => n.legacyPath).map((n) => (
            <Route
              key={`legacy-${n.id}`}
              path={n.legacyPath}
              element={<Navigate to={n.path} replace />}
            />
          ))}

          {/* The rest of the old /admin/* addresses forward into Settings
              too. */}
          <Route path="/admin/:section" element={<AdminSection />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* Outside <Routes> on purpose: it appears on every screen, and keeping
          it above the router means navigating does not throw the
          conversation away. */}
      <AssistantWidget />
    </div>
  )
}
