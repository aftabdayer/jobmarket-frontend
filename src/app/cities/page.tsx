'use client'
import { useState, useEffect } from 'react'
import Shell from '@/components/Shell'
import PageHeader from '@/components/PageHeader'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'

const TIP = { background: '#0f1929', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8, color: '#e2eaf5', fontSize: 12 }

export default function CitiesPage() {
  const [cities, setCities] = useState<any[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [citySkills, setCitySkills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cities?limit=15')
      .then(r => r.json())
      .then(d => { setCities(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selected) return
    fetch(`/api/cities/${encodeURIComponent(selected)}/skills`)
      .then(r => r.json())
      .then(d => setCitySkills(d.top_skills || []))
      .catch(() => setCitySkills([]))
  }, [selected])

  return (
    <Shell>
      <PageHeader title="🏙️ City Intelligence" sub="Job demand and salary analysis by city" />
      {loading ? (
        <div style={{ textAlign: 'center', padding: 80 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Jobs by City — click a bar to see top skills
            </div>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={cities} margin={{ bottom: 50 }} onClick={(e: any) => { if (e?.activeLabel) setSelected(e.activeLabel) }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="city" tick={{ fill: '#e2eaf5', fontSize: 11 }} angle={-30} textAnchor="end" />
                <YAxis tick={{ fill: '#7892b0', fontSize: 11 }} />
                <Tooltip contentStyle={TIP} />
                <Bar dataKey="jobs" radius={[4, 4, 0, 0]} name="Jobs" cursor="pointer">
                  {cities.map((_: any, i: number) => (
                    <Cell key={i} fill={`rgba(56,189,248,${1 - i * 0.05})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                Avg Salary by City (LPA)
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={cities.filter((c: any) => c.avg_salary)} layout="vertical" margin={{ left: 0, right: 40 }}>
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#7892b0', fontSize: 11 }} />
                  <YAxis type="category" dataKey="city" width={90} tick={{ fill: '#e2eaf5', fontSize: 12 }} />
                  <Tooltip contentStyle={TIP} formatter={(v: any) => [`₹${v}L`, 'Avg Salary']} />
                  <Bar dataKey="avg_salary" fill="#10b981" radius={[0, 4, 4, 0]} name="Avg LPA" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                {selected ? `Top Skills — ${selected}` : 'Click a city bar to see top skills'}
              </div>
              {citySkills.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {citySkills.slice(0, 10).map((s: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 24, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', textAlign: 'right' }}>#{i + 1}</div>
                      <div style={{ flex: 1, background: 'var(--surface-1)', borderRadius: 4, overflow: 'hidden', height: 24, position: 'relative' }}>
                        <div style={{ width: `${(s.count / citySkills[0].count) * 100}%`, height: '100%', background: 'rgba(56,189,248,0.2)' }} />
                        <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--text)' }}>{s.skill}</span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', width: 30 }}>{s.count}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 40, fontSize: 13 }}>
                  Click a city in the chart above
                </div>
              )}
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>City Summary Table</div>
            <table className="data-table">
              <thead><tr><th>City</th><th>Jobs</th><th>Avg Salary</th><th>% of Market</th></tr></thead>
              <tbody>
                {cities.map((c: any, i: number) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{c.city}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{c.jobs?.toLocaleString()}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-g)' }}>{c.avg_salary ? `₹${c.avg_salary}L` : '—'}</td>
                    <td style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{c.pct ? `${c.pct}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Shell>
  )
}
