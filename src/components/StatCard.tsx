export default function StatCard({
  label, value, sub, color = 'var(--accent)'
}: {
  label: string; value: string | number; sub?: string; color?: string
}) {
  return (
    <div className="card" style={{ padding: '20px 24px' }}>
      <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
        {label}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 700, color, fontFamily: 'var(--font-mono)', lineHeight: 1.2, marginTop: 8 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}
