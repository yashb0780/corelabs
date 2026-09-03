/**
 * VENDOR PROFILE, group two: who you sell to.
 *
 * These are asked, not scraped, because a website does not reliably say any
 * of them. They are also the fields that do the most work: technologies,
 * size bands and industries are what "Refine by ICP" applies on Company
 * Search.
 *
 * One file per group. To change this group, this is the only file to open.
 */
import {
  EMPLOYEE_BANDS,
  REVENUE_BANDS,
  TECHNOLOGY_SUGGESTIONS,
  VENDOR_FIELDS as F,
  VENDOR_PROFILE_COPY as COPY,
} from '../../data/vendorProfile'
import {
  Field,
  RepeatableList,
  RepeatableRows,
  Select,
  TagInput,
} from '../form'
import { SectionCard } from '../ui'

export function VendorSell({ profile, onChange }) {
  const set = (key) => (value) => onChange({ ...profile, [key]: value })

  return (
    <SectionCard icon="target" label={COPY.sellLabel}>
      <p className="text-sm text-txt-2">{COPY.sellHelp}</p>

      <div className="mt-4 space-y-4">
        <Field label={F.technologies.label} hint={F.technologies.hint}>
          <TagInput
            values={profile.technologies}
            onChange={set('technologies')}
            placeholder={F.technologies.placeholder}
            suggestions={TECHNOLOGY_SUGGESTIONS}
          />
        </Field>

        <Field label={F.certifications.label} hint={F.certifications.hint}>
          <RepeatableRows
            rows={profile.certifications}
            onChange={set('certifications')}
            addLabel={F.certifications.add}
            cols={[
              {
                key: 'provider',
                placeholder: F.certifications.providerPlaceholder,
              },
              { key: 'level', placeholder: F.certifications.levelPlaceholder },
            ]}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={F.sellsToRevenue.label} htmlFor="vp-rev">
            <Select
              id="vp-rev"
              value={profile.sellsToRevenue}
              onChange={set('sellsToRevenue')}
              options={REVENUE_BANDS}
            />
          </Field>

          <Field label={F.sellsToEmployees.label} htmlFor="vp-emp">
            <Select
              id="vp-emp"
              value={profile.sellsToEmployees}
              onChange={set('sellsToEmployees')}
              options={EMPLOYEE_BANDS}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={F.industriesInclude.label}>
            <TagInput
              values={profile.industriesInclude}
              onChange={set('industriesInclude')}
              placeholder={F.industriesInclude.placeholder}
            />
          </Field>

          <Field label={F.industriesExclude.label}>
            <TagInput
              values={profile.industriesExclude}
              onChange={set('industriesExclude')}
              placeholder={F.industriesExclude.placeholder}
            />
          </Field>
        </div>

        <Field label={F.recentCustomers.label} hint={F.recentCustomers.hint}>
          <RepeatableList
            values={profile.recentCustomers}
            onChange={set('recentCustomers')}
            placeholder={F.recentCustomers.placeholder}
            addLabel={F.recentCustomers.add}
            max={F.recentCustomers.max}
          />
        </Field>
      </div>
    </SectionCard>
  )
}
