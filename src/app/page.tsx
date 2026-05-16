import Shell from '@/components/Shell'
import StatCard from '@/components/StatCard'
import PageHeader from '@/components/PageHeader'
import { getSummary, getWeeklyTrend } from '@/lib/api'
import OverviewCharts from './OverviewCharts'

export default async function HomePage() {
  const [summary, trend] = await Promise.all([
    getSummary(), getWeeklyTrend(12)
  ])

  return (
    <Shell>
      <PageHeader title="📊 Market Overview" sub="Real-time India IT job market — all roles" />

      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Jobs"       value={summary.total_jobs?.toLocaleString()} />
        <StatCard label="Companies"        value={summary.companies_hiring} color="var(--accent-p)" />
        <StatCard label="Active Cities"    value={summary.cities} color="var(--accent-g)" />
        <StatCard label="Unique Skills"    value={summary.unique_skills} color="var(--accent-a)" />
        <StatCard label="Avg Salary"       value={`₹${summary.avg_salary_lpa}L`} color="var(--accent-g)" />
        <StatCard label="Posted This Week" value={summary.posted_this_week} color="var(--accent-r)" />
      </div>

      <OverviewCharts trend={trend} />
    </Shell>
  )
}
