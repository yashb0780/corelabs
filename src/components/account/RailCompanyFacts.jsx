/**
 * ACCOUNT PAGE, right rail card 1: COMPANY FACTS.
 * One file per section. To change this section, this is the only file to open.
 */
import { formatEmployees } from '../../data/companies'
import { EMPTY_STATES } from '../../data/emptyStates'
import { SectionCard } from '../ui'

function Fact({ label, value }) {
  return (
    <div className="grid grid-cols-2 gap-2 py-1">
      <dt className="lp-label pt-0.5">{label}</dt>
      <dd className="text-sm font-name text-txt">
        {value ?? <span className="text-txt-3">{EMPTY_STATES.facts}</span>}
      </dd>
    </div>
  )
}

export function RailCompanyFacts({ company }) {
  return (
    <SectionCard icon="building" label="Company facts">
      <dl className="divide-y divide-line">
        <Fact label="Industry" value={company.industry} />
        <Fact label="Employees" value={formatEmployees(company.employees)} />
        <Fact label="HQ" value={company.hq} />
        <Fact label="Founded" value={company.founded} />
        <Fact label="Est. revenue" value={company.revenue} />
        <Fact
          label="Contacts"
          value={company.contacts.length > 0 ? company.contacts.length : null}
        />
      </dl>
    </SectionCard>
  )
}
