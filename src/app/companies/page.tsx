'use client'
import { useState, useEffect } from 'react'
import Shell from '@/components/Shell'
import PageHeader from '@/components/PageHeader'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'

const TIP = { background: '#0f1929', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8, color: '#e2eaf5', fontSize: 12 }

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/companies?limit=25')
      .then(r => r.json())
      .then(d => { setCompanies(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <Shell>
      <PageHeader title="🏢 Company Intelligence" sub="Which companies are hiring most and what they pay" />
      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Top Hiring Companies
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={companies.slice(0, 15)} layout="vertical" margin={{ left: 10, right: 60 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tick={{ fill: '#7892b0', fontSize: 11 }} />
                <YAxis type="category" dataKey="company" width={130} tick={{ fill: '#e2eaf5', fontSize: 12 }} />
                <Tooltip contentStyle={TIP} />
                <Bar dataKey="open_roles" radius={[0, 4, 4, 0]} name="Open Roles">
                  {companies.slice(0, 15).map((_: any, i: number) => (
                    <Cell key={i} fill={`rgba(167,139,250,${1 - i * 0.05})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                Companies by Avg Salary (LPA)
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={companies.filter((c: any) => c.avg_salary).slice(0, 12)} layout="vertical" margin={{ left: 10, right: 50 }}>
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#7892b0', fontSize: 11 }} />
                  <YAxis type="category" dataKey="company" width={130} tick={{ fill: '#e2eaf5', fontSize: 12 }} />
                  <Tooltip contentStyle={TIP} formatter={(v: any) => [`₹${v}L`, 'Avg Salary']} />
                  <Bar dataKey="avg_salary" fill="#10b981" radius={[0, 4, 4, 0]} name="Avg LPA" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                Company Directory
              </div>
              <div style={{ overflowY: 'auto', maxHeight: 300 }}>
                <table className="data-table">
                  <thead><tr><th>#</th><th>Company</th><th>Roles</th><th>Avg Salary</th></tr></thead>
                  <tbody>
                    {companies.map((c: any, i: number) => (
                      <tr key={i}>
                        <td style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{i + 1}</td>
                        <td style={{ fontWeight: 500 }}>{c.company}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{c.open_roles}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-g)' }}>{c.avg_salary ? `₹${c.avg_salary}L` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </Shell>
  )
}
