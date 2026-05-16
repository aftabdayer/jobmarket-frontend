'use client'
import { useState, useEffect } from 'react'
import Shell from '@/components/Shell'
import PageHeader from '@/components/PageHeader'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'

const TIP = { background: '#0f1929', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8, color: '#e2eaf5', fontSize: 12 }
const TABS = ['Top Skills', 'By Salary', 'Skill Pairs']

const ROLES = [
  "All", "Software Engineer", "Data Analyst", "Data Scientist",
  "Machine Learning Engineer", "AI Engineer", "Product Manager",
  "Data Engineer", "Frontend Developer", "Backend Developer",
  "DevOps Engineer", "Business Analyst", "QA Engineer",
  "Product Designer", "Cloud Architect", "Cybersecurity Analyst",
]

export default function SkillsPage() {
  const [tab, setTab] = useState(0)
  const [role, setRole] = useState('All')
  const [skills, setSkills] = useState<any[]>([])
  const [salarySkills, setSalarySkills] = useState<any[]>([])
  const [combos, setCombos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const roleParam = role !== 'All' ? `&role_title=${encodeURIComponent(role)}` : ''
    Promise.all([
      fetch(`/api/skills/top?limit=20${roleParam}`).then(r => r.json()),
      fetch(`/api/skills/salary?limit=15${roleParam}`).then(r => r.json()),
      fetch('/api/skills/combinations').then(r => r.json()),
    ]).then(([s, sal, c]) => {
      setSkills(s)
      setSalarySkills(sal)
      setCombos(c)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [role])

  const selectStyle: React.CSSProperties = {
    padding: '8px 14px', borderRadius: 8, background: 'var(--surface)',
    border: '1px solid var(--border)', color: 'var(--text)',
    fontSize: 13, cursor: 'pointer', outline: 'none',
  }

  return (
    <Shell>
      <PageHeader title="📈 Skills Intelligence" sub="Demand, salary and co-occurrence by role" />

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} style={{
              padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13,
              background: tab === i ? 'rgba(56,189,248,0.12)' : 'var(--surface)',
              color: tab === i ? 'var(--accent)' : 'var(--muted)',
              borderBottom: tab === i ? '2px solid var(--accent)' : '2px solid transparent',
            }}>{t}</button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>Role:</span>
          <select value={role} onChange={e => setRole(e.target.value)} style={selectStyle}>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
        </div>
      ) : (
        <>
          {tab === 0 && (
            <div className="card" style={{ padding: 24 }}>
              <ResponsiveContainer width="100%" height={520}>
                <BarChart data={skills} layout="vertical" margin={{ left: 10, right: 40 }}>
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#7892b0', fontSize: 11 }} />
                  <YAxis type="category" dataKey="skill" width={120} tick={{ fill: '#e2eaf5', fontSize: 12 }} />
                  <Tooltip contentStyle={TIP} formatter={(v: any, n: string) => [v, n === 'job_count' ? 'Jobs' : n]} />
                  <Bar dataKey="job_count" radius={[0, 4, 4, 0]} name="Jobs">
                    {skills.map((_: any, i: number) => <Cell key={i} fill={`rgba(56,189,248,${1 - i * 0.04})`} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {tab === 1 && (
            <div className="card" style={{ padding: 24 }}>
              {salarySkills.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 60 }}>
                  No salary data for this role filter. Try "All".
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={460}>
                  <BarChart data={salarySkills} margin={{ bottom: 50 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="skill" tick={{ fill: '#e2eaf5', fontSize: 11 }} angle={-30} textAnchor="end" />
                    <YAxis tick={{ fill: '#7892b0', fontSize: 11 }} label={{ value: 'LPA', angle: -90, fill: '#7892b0', fontSize: 11 }} />
                    <Tooltip contentStyle={TIP} formatter={(v: any) => [`₹${v}L`]} />
                    <Bar dataKey="min" fill="#1e3050" name="Min" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="avg" fill="#38bdf8" name="Avg" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="max" fill="#a78bfa" name="Max" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          )}

          {tab === 2 && (
            <div className="card" style={{ padding: 24 }}>
              <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16 }}>
                Skills that appear together most in job postings
              </p>
              <table className="data-table">
                <thead><tr><th>Skill 1</th><th>Skill 2</th><th>Co-occurrences</th></tr></thead>
                <tbody>
                  {combos.slice(0, 25).map((c: any, i: number) => (
                    <tr key={i}>
                      <td><span style={{ background: 'rgba(56,189,248,0.1)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-mono)' }}>{c.skill1}</span></td>
                      <td><span style={{ background: 'rgba(167,139,250,0.1)', color: '#a78bfa', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-mono)' }}>{c.skill2}</span></td>
                      <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{c.co_occurrences}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </Shell>
  )
}
