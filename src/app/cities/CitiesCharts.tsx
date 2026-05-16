'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ScatterChart, Scatter, ZAxis } from 'recharts'

const TIP = { background: '#0f1929', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8, color: '#e2eaf5', fontSize: 12 }

export default function CitiesCharts({ cities }: { cities: any[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Jobs by city */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Jobs by City</div>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={cities} margin={{ bottom: 40 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="city" tick={{ fill: '#e2eaf5', fontSize: 11 }} angle={-30} textAnchor="end" />
              <YAxis tick={{ fill: '#7892b0', fontSize: 11 }} />
              <Tooltip contentStyle={TIP} />
              <Bar dataKey="jobs" fill="#38bdf8" radius={[4,4,0,0]} name="Jobs" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Avg salary by city */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Avg Salary by City (LPA)</div>
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={cities.filter(c => c.avg_salary)} margin={{ bottom: 40 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="city" tick={{ fill: '#e2eaf5', fontSize: 11 }} angle={-30} textAnchor="end" />
              <YAxis tick={{ fill: '#7892b0', fontSize: 11 }} />
              <Tooltip contentStyle={TIP} formatter={(v: any) => [`₹${v}L`, 'Avg Salary']} />
              <Bar dataKey="avg_salary" fill="#a78bfa" radius={[4,4,0,0]} name="Avg Salary (LPA)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* City table */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>City Details</div>
        <table className="data-table">
          <thead>
            <tr><th>City</th><th>Jobs</th><th>% of Market</th><th>Avg Salary</th></tr>
          </thead>
          <tbody>
            {cities.map((c: any, i: number) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{c.city}</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{c.jobs}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ height: 4, width: `${Math.min(c.pct * 3, 100)}px`, background: 'var(--accent)', borderRadius: 2, opacity: 0.7 }} />
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{c.pct}%</span>
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-g)' }}>
                  {c.avg_salary ? `₹${c.avg_salary}L` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
