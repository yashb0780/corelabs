/**
 * The app frame: sidebar on the left, the current screen on the right.
 *
 * TO ADD A SCREEN: create a file in src/pages/, then add a <Route> below and
 * a nav item in src/components/layout/Sidebar.jsx.
 */
import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import AccountDetail from './pages/AccountDetail'
import AdminSection from './pages/AdminSection'
import Campaigns from './pages/Campaigns'
import Generate from './pages/Generate'
import Leads from './pages/Leads'
import NotFound from './pages/NotFound'
import Resources from './pages/Resources'
import SavedLists from './pages/SavedLists'
import SectionLanding from './pages/SectionLanding'
import SectionPage from './pages/SectionPage'
import Segments from './pages/Segments'
import Signals from './pages/Signals'
import { SECTIONS } from './data/sections'

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
          <Route path="/generate" element={<Generate />} />
          <Route path="/resources" element={<Resources />} />

          {/* Settings, Tenant, Vendor and Customer. Each gets a card landing
              page plus one page per card, built from src/data/sections.js so
              adding a card to that file is all it takes to add a route. */}
          {SECTIONS.flatMap((s) => [
            <Route
              key={s.id}
              path={`/${s.id}`}
              element={<SectionLanding sectionId={s.id} />}
            />,
            <Route
              key={`${s.id}-card`}
              path={`/${s.id}/:cardId`}
              element={<SectionPage sectionId={s.id} />}
            />,
          ])}

          {/* The old /admin/* URLs still resolve, so nothing that linked to
              them breaks. The sidebar no longer points here except for
              Workspace, which has no card landing page of its own. */}
          <Route path="/admin/:section" element={<AdminSection />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  )
}
