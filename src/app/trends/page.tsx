import Shell from '@/components/Shell'
import PageHeader from '@/components/PageHeader'
import { getWeeklyTrend } from '@/lib/api'
import TrendsCharts from './TrendsCharts'

export default async function TrendsPage() {
  const trend = await getWeeklyTrend(16)
  return (
    <Shell>
      <PageHeader title="📉 Market Trends" sub="Weekly posting volume and skill momentum" />
      <TrendsCharts trend={trend} />
    </Shell>
  )
}
