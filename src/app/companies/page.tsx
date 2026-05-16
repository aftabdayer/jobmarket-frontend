import Shell from '@/components/Shell'
import PageHeader from '@/components/PageHeader'
import { getCompanies } from '@/lib/api'
import CompaniesCharts from './CompaniesCharts'

export default async function CompaniesPage() {
  const companies = await getCompanies(25)
  return (
    <Shell>
      <PageHeader title="🏢 Company Hiring Intelligence" sub="Which companies are hiring most and what they pay" />
      <CompaniesCharts companies={companies} />
    </Shell>
  )
}
