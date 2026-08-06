/**
 * Wraps every screen: sets the breadcrumb in the top bar, then renders the
 * page title, subtitle and content in the near-white content area.
 *
 * Usage inside a page:
 *   <PageShell
 *     breadcrumb={['Workspace', 'Leads']}
 *     title="Company Search"
 *     subtitle="SAP ECC migration signals · 9 companies matching your ICP"
 *   >
 *     ...page content...
 *   </PageShell>
 */
import { TopBar } from './TopBar'

export function PageShell({ breadcrumb, title, subtitle, actions, children }) {
  return (
    <div className="flex h-full min-w-0 flex-col">
      <TopBar breadcrumb={breadcrumb} />

      <main className="flex-1 overflow-y-auto bg-surface">
        <div className="mx-auto max-w-[1400px] px-6 py-5">
          {(title || actions) && (
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                {title && (
                  <h1 className="text-2xl text-txt">{title}</h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-txt-2">{subtitle}</p>
                )}
              </div>
              {actions && (
                <div className="flex shrink-0 items-center gap-2">{actions}</div>
              )}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  )
}
