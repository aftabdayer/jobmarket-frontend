import Shell from '@/components/Shell'
import PageHeader from '@/components/PageHeader'
import { getCities } from '@/lib/api'
import CitiesCharts from './CitiesCharts'

export default async function CitiesPage() {
  const cities = await getCities(15)
  return (
    <Shell>
      <PageHeader title="🏙️ City Intelligence" sub="Job demand and salary analysis by city" />
      <CitiesCharts cities={cities} />
    </Shell>
  )
}
