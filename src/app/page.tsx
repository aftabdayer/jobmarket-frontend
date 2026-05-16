import Shell from '@/components/Shell'
import StatCard from '@/components/StatCard'
import PageHeader from '@/components/PageHeader'
import OverviewCharts from './OverviewCharts'

export const dynamic = 'force-dynamic'

async function fetchData(url: string) {
  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function HomePage() {
  const API = 'https://jobmarket-backend-production.up.railway.app'
  const [summary, trend] = await Promise.all([
    fetchData(`${API}/api/summary`),
    fetchData(`${API}/api/trends/weekly?weeks=12`),
  ])

  const s = summary || { total_jobs: 0, companies_hiring: 0, cities: 0, unique_skills: 0, avg_salary_lpa: 0, posted_this_week: 0 }
  const t = Array.isArray(trend) ? trend : []

  return (
    <Shell>
      <PageHeader title="📊 Market Overview" sub="Real-time India IT job market — all roles" />

      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Jobs"       value={s.total_jobs?.toLocaleString()} />
        <StatCard label="Companies"        value={s.companies_hiring} color="var(--accent-p)" />
        <StatCard label="Active Cities"    value={s.cities} color="var(--accent-g)" />
        <StatCard label="Unique Skills"    value={s.unique_skills} color="var(--accent-a)" />
        <StatCard label="Avg Salary"       value={`₹${s.avg_salary_lpa}L`} color="var(--accent-g)" />
        <StatCard label="Posted This Week" value={s.posted_this_week} color="var(--accent-r)" />
      </div>

      <OverviewCharts trend={t} />
    </Shell>
  )
}
