'use client'
import { useState, useRef, useEffect } from 'react'
import Shell from '@/components/Shell'
import PageHeader from '@/components/PageHeader'

const SUGGESTIONS = [
  { q: 'What skills should I learn to get hired in 2026?', icon: '🎯' },
  { q: 'Compare salary for SDE vs Data Scientist in Bangalore', icon: '💰' },
  { q: 'Which companies are hiring AI/ML engineers the most?', icon: '🏢' },
  { q: 'What salary can a fresher expect as a data analyst?', icon: '📊' },
  { q: 'Is Generative AI and LLMs in demand in India?', icon: '🤖' },
  { q: 'Best cities for Product Manager roles with highest pay?', icon: '🏙️' },
]

type Msg = { role: 'user' | 'assistant'; content: string; ts: string }

export default function ChatPage() {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => `s_${Date.now()}`)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, loading])

  async function send(text: string) {
    if (!text.trim() || loading) return
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMsgs(m => [...m, { role: 'user', content: text, ts: now }])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: sessionId }),
      })
      const data = await res.json()
      setMsgs(m => [...m, {
        role: 'assistant',
        content: data.reply || 'No response received.',
        ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }])
    } catch {
      setMsgs(m => [...m, { role: 'assistant', content: '❌ Connection error — make sure the backend is running on port 8000.', ts: '' }])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  return (
    <Shell>
      <PageHeader
        title="🤖 AI Job Market Analyst"
        sub="Powered by Groq + Llama 3.3 70B — answers grounded in your live job database"
      />

      {/* Empty state suggestions */}
      {msgs.length === 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
            Ask anything about India's IT job market:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {SUGGESTIONS.map((s, i) => (
              <button key={i} onClick={() => send(s.q)} style={{
                padding: '14px 16px', borderRadius: 10, textAlign: 'left',
                background: 'var(--surface)', border: '1px solid var(--border)',
                color: 'var(--text)', fontSize: 13, cursor: 'pointer',
                transition: 'all 0.15s', display: 'flex', gap: 10, alignItems: 'flex-start',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(56,189,248,0.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</span>
                <span style={{ lineHeight: 1.4 }}>{s.q}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20, minHeight: msgs.length > 0 ? 300 : 0 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 10 }}>
            {m.role === 'assistant' && (
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #38bdf8, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
              }}>🤖</div>
            )}
            <div style={{ maxWidth: '78%' }}>
              {m.role === 'assistant' && (
                <div style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-mono)', marginBottom: 5 }}>
                  AI Analyst · {m.ts}
                </div>
              )}
              <div style={{
                padding: '12px 16px',
                borderRadius: m.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                background: m.role === 'user' ? 'rgba(56,189,248,0.12)' : 'var(--surface)',
                border: m.role === 'user' ? '1px solid rgba(56,189,248,0.2)' : '1px solid var(--border)',
                color: 'var(--text)', fontSize: 14, lineHeight: 1.7,
                whiteSpace: 'pre-wrap',
              }}>
                {m.content}
              </div>
              {m.role === 'user' && (
                <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right', marginTop: 4 }}>{m.ts}</div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #38bdf8, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}>🤖</div>
            <div style={{
              padding: '14px 18px', borderRadius: '4px 16px 16px 16px',
              background: 'var(--surface)', border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: 'var(--accent)', opacity: 0.7,
                    animation: `pulse 1.2s ease-in-out ${i * 0.15}s infinite`,
                  }} />
                ))}
                <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 6 }}>Analysing market data…</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        position: 'sticky', bottom: 0,
        paddingTop: 16, background: 'linear-gradient(transparent, var(--bg) 35%)',
      }}>
        <div style={{
          display: 'flex', gap: 10,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '4px 4px 4px 16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          transition: 'border-color 0.15s',
        }}
        onFocus={() => {}}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
            placeholder="Ask about salaries, skills, companies, career advice…"
            style={{
              flex: 1, background: 'transparent', border: 'none',
              color: 'var(--text)', fontSize: 14, outline: 'none', padding: '8px 0',
            }}
          />
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {msgs.length > 0 && (
              <button onClick={() => setMsgs([])} style={{
                padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)',
                background: 'transparent', color: 'var(--muted)', cursor: 'pointer', fontSize: 12,
              }}>Clear</button>
            )}
            <button onClick={() => send(input)} disabled={loading || !input.trim()} style={{
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: loading || !input.trim() ? 'var(--s2)' : 'var(--accent)',
              color: loading || !input.trim() ? 'var(--muted)' : '#080e1a',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              fontWeight: 700, fontSize: 13, transition: 'all 0.15s',
            }}>
              {loading ? '…' : 'Send →'}
            </button>
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: 8 }}>
          Answers based on {' '}
          <span style={{ color: 'var(--accent)' }}>live job database</span>
          {' '} · Get Groq key free at{' '}
          <a href="https://console.groq.com" target="_blank" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            console.groq.com
          </a>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </Shell>
  )
}
