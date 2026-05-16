'use client'
import { useState, useEffect } from 'react'
import Shell from '@/components/Shell'
import PageHeader from '@/components/PageHeader'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'

const TIP = { background: '#0f1929', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8, color: '#e2eaf5', fontSize: 12 }

const ROLES = [
  "All", "Software Engineer", "Data Analyst", "Data Scientist",
  "Machine Learning Engineer", "AI Engineer", "Product Manager",
  "Data Engineer", "Frontend Developer", "Backend Developer",
  "DevOps Engineer", "Business Analyst", "QA Engineer",
  "Product Designer", "Cloud Architect", "Cybersecurity Analyst",
]

export default function SalariesPage() {
  const [role, setRole] = useState('All')
  const [pct, setPct] = useState<any>(null)
  const [dist, setDist] = useState<any[]>([])
  const [byTitle, setByTitle] = useState<any[]>([])
  const [bySkill, setBySkill] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const roleParam = role !== 'All' ? `?role_title=${encodeURIComponent(role)}` : ''
    const roleParamAmp = role !== 'All' ? `&role_title=${encodeURIComponent(role)}` : ''
    Promise.all([
      fetch('/api/salary/percentiles').then(r => r.json()),
      fetch('/api/salary/distribution').then(r => r.json()),
      fetch(`/api/salary/by-title${roleParam}`).then(r => r.json()),
      fetch(`/api/skills/salary?limit=15${roleParamAmp}`).then(r => r.json()),
    ]).then(([p, d, t, s]) => {
      setPct(p); setDist(d); setByTitle(t); setBySkill(s)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [role])

  const kpiStyle = { padding: '20px 24px', textAlign: 'center' as const }
  const selectStyle: React.CSSProperties = {
    padding: '8px 14px', borderRadius: 8, background: 'var(--surface)',
    border: '1px solid var(--border)', color: 'var(--text)', fontSize: 13, cursor: 'pointer', outline: 'none',
  }

  return (
    <Shell>
      <PageHeader title="💰 Salary Intelligence" sub="Ranges, percentiles and skill premiums" />

      {/* Role filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>Filter by role:</span>
        <select value={role} onChange={e => setRole(e.target.value)} style={selectStyle}>
          {ROLES.map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <>
          {/* Percentile cards */}
          <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'P25 Entry', key: 'p25', color: 'var(--muted)' },
              { label: 'P50 Median', key: 'p50', color: 'var(--accent)' },
              { label: 'P75 Senior', key: 'p75', color: 'var(--accent-g)' },
              { label: 'P90 Top Tier', key: 'p90', color: 'var(--accent-a)' },
            ].map(({ label, key, color }) => (
              <div key={key} className="card" style={kpiStyle}>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color, fontFamily: 'var(--font-mono)', marginTop: 8 }}>
                  ₹{pct?.[key] ?? '—'}L
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            {/* Distribution */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Salary Distribution</div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dist}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="bracket" tick={{ fill: '#e2eaf5', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#7892b0', fontSize: 11 }} />
                  <Tooltip contentStyle={TIP} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Jobs">
                    {dist.map((_: any, i: number) => (
                      <Cell key={i} fill={['#1e3050','#1e4060','#38bdf8','#a78bfa','#10b981'][i] || '#38bdf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Highest paying skills */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                Highest Paying Skills {role !== 'All' ? `— ${role}` : ''}
              </div>
              {bySkill.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 40, fontSize: 13 }}>No data for this filter</div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={bySkill} layout="vertical" margin={{ left: 10, right: 30 }}>
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#7892b0', fontSize: 11 }} />
                    <YAxis type="category" dataKey="skill" width={100} tick={{ fill: '#e2eaf5', fontSize: 12 }} />
                    <Tooltip contentStyle={TIP} formatter={(v: any) => [`₹${v}L`, 'Avg Salary']} />
                    <Bar dataKey="avg" fill="#10b981" radius={[0, 4, 4, 0]} name="Avg LPA" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Salary by title */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Salary Range by Job Title {role !== 'All' ? `— ${role}` : ''}
            </div>
            {byTitle.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 40, fontSize: 13 }}>No data for this filter</div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={byTitle} margin={{ bottom: 60 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="title" tick={{ fill: '#e2eaf5', fontSize: 10 }} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fill: '#7892b0', fontSize: 11 }} label={{ value: 'LPA', angle: -90, fill: '#7892b0', fontSize: 11 }} />
                  <Tooltip contentStyle={TIP} formatter={(v: any) => [`₹${v}L`]} />
                  <Bar dataKey="min" fill="#1e3050" name="Min" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avg" fill="#38bdf8" name="Avg" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="max" fill="#a78bfa" name="Max" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </Shell>
  )
}
