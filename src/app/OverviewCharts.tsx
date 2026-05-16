'use client'
import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid, Cell,
} from 'recharts'

const TIP = {
  background: '#0f1929', border: '1px solid rgba(56,189,248,0.2)',
  borderRadius: 8, color: '#e2eaf5', fontSize: 12,
}

const ROLE_GROUPS = [
  "All", "Software Engineer", "Data Analyst", "Data Scientist",
  "Machine Learning Engineer", "AI Engineer", "Product Manager",
  "Data Engineer", "Frontend Developer", "Backend Developer",
  "DevOps Engineer", "Business Analyst", "QA Engineer",
  "Product Designer", "Cloud Architect", "Cybersecurity Analyst",
]

export default function OverviewCharts({ trend }: { trend: any[] }) {
  const [selectedRole, setSelectedRole] = useState('All')
  const [skills, setSkills] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [loadingSkills, setLoadingSkills] = useState(true)

  useEffect(() => {
    setLoadingSkills(true)
    const q = selectedRole === 'All' ? '' : `?role_title=${encodeURIComponent(selectedRole)}`
    Promise.all([
      fetch(`/api/skills/top?limit=15${selectedRole !== 'All' ? '&role_title=' + encodeURIComponent(selectedRole) : ''}`).then(r => r.json()),
      fetch('/api/cities?limit=10').then(r => r.json()),
    ]).then(([s, c]) => {
      setSkills(s)
      setCities(c)
      setLoadingSkills(false)
    })
  }, [selectedRole])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Role filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: 'var(--muted)', whiteSpace: 'nowrap' }}>Filter by role:</span>
        <select
          value={selectedRole}
          onChange={e => setSelectedRole(e.target.value)}
          style={{
            padding: '8px 14px', borderRadius: 8, background: 'var(--surface)',
            border: '1px solid var(--border)', color: 'var(--text)',
            fontSize: 13, cursor: 'pointer', outline: 'none', minWidth: 220,
          }}
        >
          {ROLE_GROUPS.map(r => <option key={r}>{r}</option>)}
        </select>
        {selectedRole !== 'All' && (
          <span style={{
            padding: '4px 12px', borderRadius: 99, background: 'rgba(56,189,248,0.1)',
            color: 'var(--accent)', fontSize: 12, fontFamily: 'var(--font-mono)',
          }}>
            Showing: {selectedRole}
          </span>
        )}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Skills chart */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
            Top Skills {selectedRole !== 'All' ? `— ${selectedRole}` : '— All Roles'}
          </div>
          {loadingSkills ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
              <div className="spinner" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={skills} layout="vertical" margin={{ left: 0, right: 30 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tick={{ fill: '#7892b0', fontSize: 11 }} />
                <YAxis type="category" dataKey="skill" width={110} tick={{ fill: '#e2eaf5', fontSize: 12 }} />
                <Tooltip contentStyle={TIP} formatter={(v: any) => [v, 'Jobs']} />
                <Bar dataKey="job_count" radius={[0, 4, 4, 0]}>
                  {skills.map((_: any, i: number) => (
                    <Cell key={i} fill={`rgba(56,189,248,${1 - i * 0.05})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* City chart */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
            Jobs by City
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={cities} margin={{ bottom: 50 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="city" tick={{ fill: '#e2eaf5', fontSize: 10 }} angle={-35} textAnchor="end" />
              <YAxis tick={{ fill: '#7892b0', fontSize: 11 }} />
              <Tooltip contentStyle={TIP} />
              <Bar dataKey="jobs" fill="#a78bfa" radius={[4, 4, 0, 0]} name="Jobs" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly trend */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
          Weekly Job Posting Volume
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={trend}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid />
            <XAxis dataKey="week" tick={{ fill: '#7892b0', fontSize: 11 }} />
            <YAxis tick={{ fill: '#7892b0', fontSize: 11 }} />
            <Tooltip contentStyle={TIP} />
            <Area type="monotone" dataKey="jobs" stroke="#38bdf8" strokeWidth={2}
              fill="url(#grad)" dot={{ fill: '#38bdf8', r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
