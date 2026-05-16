'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'

const TIP = { background: '#0f1929', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8, color: '#e2eaf5', fontSize: 12 }

export default function CompaniesCharts({ companies }: { companies: any[] }) {
  const top15 = companies.slice(0, 15)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Top Companies by Open Roles</div>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={top15} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" tick={{ fill: '#7892b0', fontSize: 11 }} />
              <YAxis type="category" dataKey="company" width={110} tick={{ fill: '#e2eaf5', fontSize: 11 }} />
              <Tooltip contentStyle={TIP} />
              <Bar dataKey="open_roles" radius={[0,4,4,0]} name="Open Roles">
                {top15.map((_: any, i: number) => <Cell key={i} fill={`rgba(56,189,248,${1 - i * 0.05})`} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Avg Salary by Company</div>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={top15.filter(c => c.avg_salary)} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" tick={{ fill: '#7892b0', fontSize: 11 }} />
              <YAxis type="category" dataKey="company" width={110} tick={{ fill: '#e2eaf5', fontSize: 11 }} />
              <Tooltip contentStyle={TIP} formatter={(v: any) => [`₹${v}L`, 'Avg Salary']} />
              <Bar dataKey="avg_salary" fill="#a78bfa" radius={[0,4,4,0]} name="Avg Salary (LPA)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>All Companies</div>
        <table className="data-table">
          <thead><tr><th>#</th><th>Company</th><th>Open Roles</th><th>Avg Salary</th><th>Latest Posting</th></tr></thead>
          <tbody>
            {companies.map((c: any, i: number) => (
              <tr key={i}>
                <td style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{i + 1}</td>
                <td style={{ fontWeight: 500 }}>{c.company}</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{c.open_roles}</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-g)' }}>{c.avg_salary ? `₹${c.avg_salary}L` : '—'}</td>
                <td style={{ color: 'var(--muted)', fontSize: 12 }}>{c.latest?.slice(0, 10) ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
