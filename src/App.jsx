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
import Segments from './pages/Segments'
import Signals from './pages/Signals'

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
          <Route path="/admin/:section" element={<AdminSection />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  )
}
