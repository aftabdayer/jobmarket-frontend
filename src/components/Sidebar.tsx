'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, BarChart2, MapPin, Building2,
  DollarSign, TrendingUp, Search, Bot,
} from 'lucide-react'

const NAV = [
  { href: '/',          label: 'Overview',   icon: LayoutDashboard },
  { href: '/skills',    label: 'Skills',     icon: BarChart2 },
  { href: '/cities',    label: 'Cities',     icon: MapPin },
  { href: '/companies', label: 'Companies',  icon: Building2 },
  { href: '/salaries',  label: 'Salaries',   icon: DollarSign },
  { href: '/trends',    label: 'Trends',     icon: TrendingUp },
  { href: '/jobs',      label: 'Job Search', icon: Search },
  { href: '/chat',      label: 'AI Analyst', icon: Bot },
]

export default function Sidebar() {
  const path = usePathname()
  const [health, setHealth] = useState<any>(null)

  useEffect(() => {
    fetch('/health').then(r => r.json()).then(setHealth).catch(() => {})
    const id = setInterval(() => {
      fetch('/health').then(r => r.json()).then(setHealth).catch(() => {})
    }, 30000)
    return () => clearInterval(id)
  }, [])

  return (
    <aside style={{
      width: 224, minHeight: '100vh', background: 'var(--surface)',
      borderRight: '1px solid var(--border)', display: 'flex',
      flexDirection: 'column', padding: '0', position: 'fixed',
      top: 0, left: 0, zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #38bdf8, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, flexShrink: 0,
          }}>📊</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>JobMarket AI</div>
            <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.04em' }}>India IT Intelligence</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8, textDecoration: 'none',
              color: active ? 'var(--accent)' : 'var(--muted)',
              background: active ? 'rgba(56,189,248,0.1)' : 'transparent',
              fontSize: 13.5, fontWeight: active ? 600 : 400,
              borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
              transition: 'all 0.15s',
            }}>
              <Icon size={15} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Live status */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
        {health ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>LIVE</span>
              <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>
                {health.jobs_in_db?.toLocaleString()} jobs
              </span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
              {health.skills_in_db?.toLocaleString()} skills · {health.posted_this_week} this week
            </div>
            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
              Auto-refreshes every 24h
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f43f5e', display: 'inline-block' }} />
            <span style={{ fontSize: 11, color: '#f43f5e' }}>Backend offline</span>
          </div>
        )}
      </div>
    </aside>
  )
}
