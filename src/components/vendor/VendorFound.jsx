/**
 * VENDOR PROFILE, group one: what we found about you.
 *
 * Everything here is pre-filled from the website scrape and editable. If the
 * scrape returned nothing, every field renders empty and the helper text
 * says so. Nothing is ever guessed: a plausible founding year or employee
 * band looks confirmed to the user and quietly produces wrong data.
 *
 * One file per group. To change this group, this is the only file to open.
 */
import {
  EMPLOYEE_BANDS,
  VENDOR_FIELDS as F,
  VENDOR_PROFILE_COPY as COPY,
} from '../../data/vendorProfile'
import {
  Field,
  RepeatableList,
  Select,
  TextArea,
  TextInput,
} from '../form'
import { SectionCard } from '../ui'

export function VendorFound({ profile, onChange, scraped }) {
  const set = (key) => (value) => onChange({ ...profile, [key]: value })

  return (
    <SectionCard icon="building" label={COPY.foundLabel}>
      <p className="text-sm text-txt-2">
        {scraped ? COPY.foundHelp : COPY.foundHelpEmpty}
      </p>

      <div className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={F.companyName.label} htmlFor="vp-name">
            <TextInput
              id="vp-name"
              value={profile.companyName}
              onChange={set('companyName')}
            />
          </Field>

          <Field label={F.website.label} htmlFor="vp-website">
            <TextInput
              id="vp-website"
              value={profile.website}
              onChange={set('website')}
              placeholder={F.website.placeholder}
            />
          </Field>

          <Field label={F.headquarters.label} htmlFor="vp-hq">
            <TextInput
              id="vp-hq"
              value={profile.headquarters}
              onChange={set('headquarters')}
              placeholder={F.headquarters.placeholder}
            />
          </Field>

          <Field label={F.foundingYear.label} htmlFor="vp-founded">
            <TextInput
              id="vp-founded"
              value={profile.foundingYear}
              onChange={set('foundingYear')}
              placeholder={F.foundingYear.placeholder}
            />
          </Field>

          <Field label={F.employeeSize.label} htmlFor="vp-employees">
            <Select
              id="vp-employees"
              value={profile.employeeSize}
              onChange={set('employeeSize')}
              options={EMPLOYEE_BANDS}
            />
          </Field>
        </div>

        <Field
          label={F.deliveryLocations.label}
          hint={F.deliveryLocations.hint}
        >
          <RepeatableList
            values={profile.deliveryLocations}
            onChange={set('deliveryLocations')}
            placeholder={F.deliveryLocations.placeholder}
            addLabel={F.deliveryLocations.add}
          />
        </Field>

        <Field label={F.whatYouDo.label} hint={F.whatYouDo.hint} htmlFor="vp-what">
          <TextArea
            id="vp-what"
            value={profile.whatYouDo}
            onChange={set('whatYouDo')}
          />
        </Field>

        <Field label={F.keyOfferings.label} hint={F.keyOfferings.hint}>
          <RepeatableList
            values={profile.keyOfferings}
            onChange={set('keyOfferings')}
            placeholder={F.keyOfferings.placeholder}
            addLabel={F.keyOfferings.add}
          />
        </Field>
      </div>
    </SectionCard>
  )
}
