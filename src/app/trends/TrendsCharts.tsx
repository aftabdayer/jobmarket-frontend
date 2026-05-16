'use client'
import { useState } from 'react'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const TIP = { background: '#0f1929', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8, color: '#e2eaf5', fontSize: 12 }
const COLORS = ['#38bdf8','#a78bfa','#f59e0b','#10b981','#f43f5e']

export default function TrendsCharts({ trend }: { trend: any[] }) {
  const [skills, setSkills] = useState('Python,SQL,Power BI,Tableau,Excel')
  const [compareData, setCompareData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function compare() {
    setLoading(true)
    try {
      const res = await fetch(`/api/trends/compare?skills=${encodeURIComponent(skills)}&weeks=16`)
      const data = await res.json()
      setCompareData(data)
    } finally {
      setLoading(false)
    }
  }

  // Merge compare data into chart-friendly format
  const skillList = skills.split(',').map(s => s.trim())
  const mergedWeeks: Record<string, any> = {}
  if (compareData) {
    skillList.forEach(skill => {
      (compareData[skill] || []).forEach((d: any) => {
        if (!mergedWeeks[d.week]) mergedWeeks[d.week] = { week: d.week }
        mergedWeeks[d.week][skill] = d.mentions
      })
    })
  }
  const merged = Object.values(mergedWeeks).sort((a: any, b: any) => a.week.localeCompare(b.week))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Weekly volume */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Weekly Job Posting Volume</div>
        <ResponsiveContainer width="100%" height={220}>
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
            <Area type="monotone" dataKey="jobs" stroke="#38bdf8" strokeWidth={2} fill="url(#grad)" dot={{ fill: '#38bdf8', r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Skill compare */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Compare Skills Over Time</div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <input
            value={skills}
            onChange={e => setSkills(e.target.value)}
            placeholder="Python,SQL,Power BI"
            style={{
              flex: 1, padding: '9px 14px', borderRadius: 8,
              background: 'var(--surface-1)', border: '1px solid var(--border)',
              color: 'var(--text)', fontSize: 13, outline: 'none',
            }}
          />
          <button onClick={compare} disabled={loading} style={{
            padding: '9px 20px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'var(--accent)', color: '#080e1a', fontWeight: 600, fontSize: 13,
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Loading…' : 'Compare →'}
          </button>
        </div>

        {merged.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={merged}>
              <CartesianGrid />
              <XAxis dataKey="week" tick={{ fill: '#7892b0', fontSize: 11 }} />
              <YAxis tick={{ fill: '#7892b0', fontSize: 11 }} />
              <Tooltip contentStyle={TIP} />
              {skillList.map((skill, i) => (
                <Line key={skill} type="monotone" dataKey={skill} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} connectNulls />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0', fontSize: 13 }}>
            Enter skills above and click Compare → to see trends
          </div>
        )}
      </div>
    </div>
  )
}
