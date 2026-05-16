export default function PageHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
        {title}
      </h1>
      {sub && <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>{sub}</p>}
    </div>
  )
}
