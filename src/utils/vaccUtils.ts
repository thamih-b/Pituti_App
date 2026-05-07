// Tipos e utilitários de vacinas — partilhados entre contextos e componentes

export interface VaccineRecord {
  name:     string
  applied:  string
  nextDate: string
  badge:    string
  badgeCls: string
}

export function getVaccStatus(nextDate: string): 'ok' | 'soon' | 'late' {
  if (!nextDate) return 'ok'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const next  = new Date(nextDate + 'T00:00:00')
  const diffDays = Math.round((next.getTime() - today.getTime()) / 86_400_000)
  if (diffDays < 0)  return 'late'
  if (diffDays <= 30) return 'soon'
  return 'ok'
}