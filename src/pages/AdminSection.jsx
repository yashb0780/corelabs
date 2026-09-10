/**
 * The old /admin/* addresses. The five Admin screens (Settings, Tenant,
 * Vendor, Customer, Workspace) are now sections of the one Settings page, so
 * anything that still links here is forwarded to the matching section:
 * /admin/tenant opens /settings/tenant, /admin/settings opens /settings, and
 * anything unrecognised opens the Settings home.
 */
import { Navigate, useParams } from 'react-router-dom'
import { settingsPath } from '../lib/settings'

export default function AdminSection() {
  const { section } = useParams()
  return <Navigate to={settingsPath(section)} replace />
}
