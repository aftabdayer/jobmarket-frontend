'use client'
import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell,
} from 'recharts'

const TIP = { background: '#0f1929', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8, color: '#e2eaf5', fontSize: 12 }
const TABS = ['Top Skills', 'By Salary', 'Velocity', 'Skill Pairs']

export default function SkillsCharts({ skills, velocity, salary, combos }: any) {
  const [tab, setTab] = useState(0)

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            background: tab === i ? 'rgba(56,189,248,0.12)' : 'var(--surface)',
            color: tab === i ? 'var(--accent)' : 'var(--muted)',
            borderBottom: tab === i ? '2px solid var(--accent)' : '2px solid transparent',
          }}>{t}</button>
        ))}
      </div>

      {/* Top Skills */}
      {tab === 0 && (
        <div className="card" style={{ padding: 24 }}>
          <ResponsiveContainer width="100%" height={480}>
            <BarChart data={skills} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" tick={{ fill: '#7892b0', fontSize: 11 }} />
              <YAxis type="category" dataKey="skill" width={100} tick={{ fill: '#e2eaf5', fontSize: 12 }} />
              <Tooltip contentStyle={TIP} formatter={(v: any) => [v, 'Jobs']} />
              <Bar dataKey="job_count" radius={[0, 4, 4, 0]}>
                {skills.map((_: any, i: number) => <Cell key={i} fill={`rgba(56,189,248,${1 - i * 0.03})`} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* By Salary */}
      {tab === 1 && (
        <div className="card" style={{ padding: 24 }}>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={salary} margin={{ left: 10, right: 20, bottom: 40 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="skill" tick={{ fill: '#e2eaf5', fontSize: 11 }} angle={-30} textAnchor="end" />
              <YAxis tick={{ fill: '#7892b0', fontSize: 11 }} label={{ value: 'LPA', angle: -90, fill: '#7892b0', fontSize: 11 }} />
              <Tooltip contentStyle={TIP} />
              <Bar dataKey="min" fill="#1e3050" name="Min" radius={[4,4,0,0]} />
              <Bar dataKey="avg" fill="#38bdf8" name="Avg" radius={[4,4,0,0]} />
              <Bar dataKey="max" fill="#a78bfa" name="Max" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Velocity */}
      {tab === 2 && (
        <div className="card" style={{ padding: 24 }}>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>Rising vs falling skill demand — last 4 weeks vs previous 4 weeks</p>
          <ResponsiveContainer width="100%" height={480}>
            <BarChart data={[...velocity].sort((a,b) => a.velocity_pct - b.velocity_pct)} layout="vertical" margin={{ left: 10, right: 60 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type="number" tick={{ fill: '#7892b0', fontSize: 11 }} />
              <YAxis type="category" dataKey="skill" width={110} tick={{ fill: '#e2eaf5', fontSize: 12 }} />
              <Tooltip contentStyle={TIP} formatter={(v: any) => [`${v > 0 ? '+' : ''}${v}%`, 'Velocity']} />
              <Bar dataKey="velocity_pct" radius={[0,4,4,0]}>
                {velocity.map((v: any, i: number) => (
                  <Cell key={i} fill={v.velocity_pct > 10 ? '#10b981' : v.velocity_pct < -10 ? '#f43f5e' : '#7892b0'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Skill Pairs */}
      {tab === 3 && (
        <div className="card" style={{ padding: 24 }}>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>Skills that appear together most in job postings</p>
          <table className="data-table">
            <thead>
              <tr><th>Skill 1</th><th>Skill 2</th><th>Co-occurrences</th></tr>
            </thead>
            <tbody>
              {combos.slice(0,20).map((c: any, i: number) => (
                <tr key={i}>
                  <td><span style={{ background: 'rgba(56,189,248,0.1)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-mono)' }}>{c.skill1}</span></td>
                  <td><span style={{ background: 'rgba(167,139,250,0.1)', color: 'var(--accent-p)', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-mono)' }}>{c.skill2}</span></td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{c.co_occurrences}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
