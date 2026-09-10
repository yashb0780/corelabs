/**
 * Draws a report with the chart its type calls for. The card and the
 * detail page both use this, at different heights.
 */
import { BarChart } from './BarChart'
import { FunnelChart } from './FunnelChart'
import { LineChart } from './LineChart'
import { PieChart } from './PieChart'

const CHARTS = {
  funnel: FunnelChart,
  line: LineChart,
  bar: BarChart,
  pie: PieChart,
}

export function ReportChart({ report, height }) {
  const Chart = CHARTS[report.type]
  return Chart ? <Chart report={report} height={height} /> : null
}
