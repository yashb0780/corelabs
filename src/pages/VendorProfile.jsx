/**
 * VENDOR PROFILE.
 *
 * One page, one scroll, two groups. Not a stepper and not a sidebar of
 * sections: it is short enough to read in one go, and every field on it
 * changes which companies Company Search surfaces.
 *
 * This file only orders the two groups and owns the save action. Each group
 * lives in its own file in src/components/vendor/.
 */
import { useNavigate } from 'react-router-dom'
import { PageShell } from '../components/layout/PageShell'
import { VendorFound } from '../components/vendor/VendorFound'
import { VendorSell } from '../components/vendor/VendorSell'
import { Button } from '../components/ui'
import { VENDOR_PROFILE_COPY as COPY } from '../data/vendorProfile'
import { getSection } from '../data/sections'
import {
  scrapeFoundSomething,
  setVendorProfile,
  useVendorProfile,
} from '../lib/profile'

export default function VendorProfile() {
  const navigate = useNavigate()
  const profile = useVendorProfile()
  const section = getSection('vendor')

  return (
    <PageShell
      breadcrumb={[
        section.root,
        { label: section.label, to: `/${section.id}` },
        COPY.title,
      ]}
      title={COPY.title}
      subtitle={COPY.subtitle}
    >
      <div className="lp-stack max-w-3xl">
        <VendorFound
          profile={profile}
          onChange={setVendorProfile}
          scraped={scrapeFoundSomething}
        />

        <VendorSell profile={profile} onChange={setVendorProfile} />

        <div className="flex justify-end pt-1">
          <Button variant="primary" onClick={() => navigate('/leads')}>
            {COPY.save}
          </Button>
        </div>
      </div>
    </PageShell>
  )
}
