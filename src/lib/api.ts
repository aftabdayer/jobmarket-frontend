const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

async function apiFetch(path: string) {
  const res = await fetch(`${API}${path}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const getSummary       = () => apiFetch('/api/summary')
export const getTopSkills     = (limit = 25) => apiFetch(`/api/skills/top?limit=${limit}`)
export const getSkillVelocity = (top = 20)   => apiFetch(`/api/skills/velocity?top_n=${top}`)
export const getSkillsByCategory = ()        => apiFetch('/api/skills/categories')
export const getSkillsBySalary   = (limit = 15) => apiFetch(`/api/skills/salary?limit=${limit}`)
export const getSkillCombinations = ()       => apiFetch('/api/skills/combinations')
export const getCities        = (limit = 15) => apiFetch(`/api/cities?limit=${limit}`)
export const getCitySkills    = (city: string) => apiFetch(`/api/cities/${encodeURIComponent(city)}/skills`)
export const getCompanies     = (limit = 25) => apiFetch(`/api/companies?limit=${limit}`)
export const getSalaryDist    = ()           => apiFetch('/api/salary/distribution')
export const getSalaryByTitle = ()           => apiFetch('/api/salary/by-title')
export const getSalaryPct     = ()           => apiFetch('/api/salary/percentiles')
export const getWeeklyTrend   = (weeks = 12) => apiFetch(`/api/trends/weekly?weeks=${weeks}`)
export const getHealth        = ()           => apiFetch('/health')

export async function getJobs(params: {
  q?: string; city?: string; company?: string; skill?: string; limit?: number
}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => v !== undefined && qs.set(k, String(v)))
  return apiFetch(`/api/jobs?${qs}`)
}

export async function sendChat(message: string, sessionId = 'user') {
  const res = await fetch(`${API}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id: sessionId }),
  })
  return res.json()
}
