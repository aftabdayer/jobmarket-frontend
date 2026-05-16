'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'

const TIP = { background: '#0f1929', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8, color: '#e2eaf5', fontSize: 12 }
const BRACKETS_COLORS = ['#1e3050','#1e4060','#38bdf8','#a78bfa','#10b981']

export default function SalaryCharts({ dist, byTitle, bySkill }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Distribution */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Salary Distribution</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dist}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="bracket" tick={{ fill: '#e2eaf5', fontSize: 11 }} />
              <YAxis tick={{ fill: '#7892b0', fontSize: 11 }} />
              <Tooltip contentStyle={TIP} />
              <Bar dataKey="count" radius={[4,4,0,0]} name="Jobs">
                {dist.map((_: any, i: number) => <Cell key={i} fill={BRACKETS_COLORS[i] || '#38bdf8'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By skill */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Highest Paying Skills</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={bySkill} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" tick={{ fill: '#7892b0', fontSize: 11 }} />
              <YAxis type="category" dataKey="skill" width={90} tick={{ fill: '#e2eaf5', fontSize: 12 }} />
              <Tooltip contentStyle={TIP} formatter={(v: any) => [`₹${v}L`, 'Avg Salary']} />
              <Bar dataKey="avg" fill="#10b981" radius={[0,4,4,0]} name="Avg Salary (LPA)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* By title */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Salary Range by Job Title</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={byTitle} margin={{ bottom: 40 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="title" tick={{ fill: '#e2eaf5', fontSize: 11 }} angle={-20} textAnchor="end" />
            <YAxis tick={{ fill: '#7892b0', fontSize: 11 }} label={{ value: 'LPA', angle: -90, fill: '#7892b0', fontSize: 11 }} />
            <Tooltip contentStyle={TIP} formatter={(v: any) => [`₹${v}L`]} />
            <Bar dataKey="min" fill="#1e3050" name="Min" radius={[4,4,0,0]} />
            <Bar dataKey="avg" fill="#38bdf8" name="Avg" radius={[4,4,0,0]} />
            <Bar dataKey="max" fill="#a78bfa" name="Max" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
