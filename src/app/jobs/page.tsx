'use client'
import { useState } from 'react'
import Shell from '@/components/Shell'
import PageHeader from '@/components/PageHeader'

const CATEGORIES = ['All', 'SDE', 'AI/ML', 'Data', 'Product', 'DevOps', 'Business', 'Security', 'QA']
const EXPERIENCE = ['Any', 'Fresher (0-1)', 'Junior (1-3)', 'Mid (2-5)', 'Senior (5-8)', 'Lead (8+)']
const EXP_MAP: Record<string, string> = {
  'Fresher (0-1)': '0-1', 'Junior (1-3)': '1-3',
  'Mid (2-5)': '2-5', 'Senior (5-8)': '5-8', 'Lead (8+)': '8'
}
const CITIES = ['Any', 'Bangalore', 'Mumbai', 'Hyderabad', 'Pune', 'Delhi NCR',
  'Chennai', 'Kolkata', 'Noida', 'Gurgaon', 'Ahmedabad', 'Jaipur', 'Remote']

export default function JobsPage() {
  const [q, setQ]         = useState('')
  const [city, setCity]   = useState('Any')
  const [company, setComp]= useState('')
  const [skill, setSkill] = useState('')
  const [exp, setExp]     = useState('Any')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function search() {
    setLoading(true)
    setSearched(true)
    const qs = new URLSearchParams({ limit: '100' })
    if (q)                  qs.set('q', q)
    if (city !== 'Any')     qs.set('city', city)
    if (company)            qs.set('company', company)
    if (skill)              qs.set('skill', skill)
    if (exp !== 'Any')      qs.set('experience', EXP_MAP[exp] || '')
    const res = await fetch(`/api/jobs?${qs}`)
    const data = await res.json()
    setResults(data)
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    background: 'var(--surface)', border: '1px solid var(--border)',
    color: 'var(--text)', fontSize: 13, outline: 'none',
  }
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' }
  const labelStyle: React.CSSProperties = {
    fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)',
    textTransform: 'uppercase' as const, letterSpacing: '0.08em',
    display: 'block', marginBottom: 6,
  }

  const SOURCE_COLORS: Record<string, string> = {
    naukri: '#00b4d8', linkedin: '#0077b5', intern: '#f59e0b',
  }

  return (
    <Shell>
      <PageHeader title="🔍 Job Search" sub="Search across SDE, AI/ML, Data, Product, DevOps and all IT roles" />

      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        {/* Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>Keyword / Job Title</label>
            <input value={q} onChange={e => setQ(e.target.value)}
              placeholder="e.g. Product Manager, SDE, AI Engineer"
              style={inputStyle} onKeyDown={e => e.key === 'Enter' && search()} />
          </div>
          <div>
            <label style={labelStyle}>City</label>
            <select value={city} onChange={e => setCity(e.target.value)} style={selectStyle}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Company</label>
            <input value={company} onChange={e => setComp(e.target.value)}
              placeholder="e.g. Google, Flipkart, Razorpay"
              style={inputStyle} onKeyDown={e => e.key === 'Enter' && search()} />
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Must-have Skill</label>
            <input value={skill} onChange={e => setSkill(e.target.value)}
              placeholder="e.g. Python, React, LLMs, Figma"
              style={inputStyle} onKeyDown={e => e.key === 'Enter' && search()} />
          </div>
          <div>
            <label style={labelStyle}>Experience Level</label>
            <select value={exp} onChange={e => setExp(e.target.value)} style={selectStyle}>
              {EXPERIENCE.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button onClick={search} style={{
              width: '100%', padding: '10px 0', borderRadius: 8, border: 'none',
              cursor: 'pointer', background: 'var(--accent)', color: '#080e1a',
              fontWeight: 700, fontSize: 14,
            }}>
              Search Jobs →
            </button>
          </div>
        </div>

        {/* Quick category pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: 'var(--muted)', alignSelf: 'center' }}>Quick:</span>
          {['Product Manager', 'SDE-2', 'AI Engineer', 'Data Scientist', 'DevOps Engineer',
            'UX Designer', 'QA Engineer', 'Backend Developer'].map(role => (
            <button key={role} onClick={() => { setQ(role); }} style={{
              padding: '4px 12px', borderRadius: 99, border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--muted)', fontSize: 12, cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}>
              {role}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>Searching jobs…</div>
        </div>
      )}

      {!loading && searched && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{results.length}</span> jobs found
            </div>
            {results.length > 0 && (
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                Click <span style={{ color: 'var(--accent-g)' }}>Apply →</span> to open the job listing
              </div>
            )}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Company</th>
                  <th>City</th>
                  <th>Salary</th>
                  <th>Experience</th>
                  <th>Type</th>
                  <th>Posted</th>
                  <th>Source</th>
                  <th>Apply</th>
                </tr>
              </thead>
              <tbody>
                {results.map((j: any, i: number) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, maxWidth: 180 }}>{j.title}</td>
                    <td style={{ color: 'var(--text)' }}>{j.company}</td>
                    <td style={{ color: 'var(--muted)', fontSize: 12 }}>
                      {j.city?.includes('Remote') ? (
                        <span style={{ color: 'var(--accent-g)', fontWeight: 500 }}>{j.city}</span>
                      ) : j.city}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-g)', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {j.salary_text || '—'}
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {j.experience || '—'}
                    </td>
                    <td>
                      {j.job_type && (
                        <span style={{
                          background: j.job_type === 'Remote' ? 'rgba(16,185,129,0.1)' : 'rgba(56,189,248,0.08)',
                          color: j.job_type === 'Remote' ? 'var(--accent-g)' : 'var(--accent)',
                          padding: '2px 8px', borderRadius: 4, fontSize: 11, whiteSpace: 'nowrap',
                        }}>{j.job_type}</span>
                      )}
                    </td>
                    <td style={{ color: 'var(--muted)', fontSize: 11, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                      {j.posted_date?.slice(0, 10) || '—'}
                    </td>
                    <td>
                      <span style={{
                        background: `rgba(${j.source === 'linkedin' ? '0,119,181' : '0,180,216'},0.12)`,
                        color: SOURCE_COLORS[j.source] || 'var(--muted)',
                        padding: '2px 8px', borderRadius: 4, fontSize: 11, fontFamily: 'var(--font-mono)',
                      }}>{j.source}</span>
                    </td>
                    <td>
                      <a
                        href={j.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '5px 12px', borderRadius: 6,
                          background: 'rgba(16,185,129,0.12)',
                          border: '1px solid rgba(16,185,129,0.25)',
                          color: 'var(--accent-g)', fontSize: 12, fontWeight: 600,
                          textDecoration: 'none', whiteSpace: 'nowrap',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.25)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.12)'; }}
                      >
                        Apply →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {results.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 48 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 14, marginBottom: 8 }}>No jobs found for those filters.</div>
              <div style={{ fontSize: 12 }}>Try removing some filters or use broader keywords.</div>
            </div>
          )}
        </div>
      )}
    </Shell>
  )
}
