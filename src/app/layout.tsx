import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JobMarket AI — India Data Analytics Intelligence',
  description: 'Real-time India job market analytics for data analyst roles',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
