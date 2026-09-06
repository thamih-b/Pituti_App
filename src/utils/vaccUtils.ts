// Tipos e utilitários de vacinas — partilhados entre contextos e componentes
// vaccUtils.ts
export interface VaccineRecord {
  id: string
  name: string
  applied: string
  nextDate: string
  badge: string
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

// FIX (cobertura vacinal desequilibrada / ring não corresponde): antes,
// "em dia" contava ok+soon e "pendente" contava soon+late — a vacina
// "a vencer" entrava nos dois grupos ao mesmo tempo, por isso as duas
// percentagens não batiam certo (podiam somar mais de 100%). Também, o
// mini-ring da lista de pets usava sempre um valor fixo de 100%, nunca
// calculado a partir das vacinas reais.
//
// Esta função é agora a ÚNICA fonte de verdade da cobertura vacinal —
// usada tanto no separador de Vacinas do pet como no ring da lista de
// pets — para os dois nunca poderem voltar a divergir.
export function computeVaccCoverage(vaccines: VaccineRecord[]): {
  coverage: number   // % "em dia" (ok) — usado no ring
  okPct: number      // igual a coverage, mantido por clareza semântica
  pendingPct: number // % soon + late — sempre complementar a okPct (soma 100%)
  okCount: number
  soonCount: number
  lateCount: number
  total: number
} {
  const total = vaccines.length
  if (total === 0) {
    return { coverage: 100, okPct: 100, pendingPct: 0, okCount: 0, soonCount: 0, lateCount: 0, total: 0 }
  }
  let okCount = 0, soonCount = 0, lateCount = 0
  for (const v of vaccines) {
    const cls = getVaccStatus(v.nextDate)
    if (cls === 'ok') okCount++
    else if (cls === 'soon') soonCount++
    else lateCount++
  }
  const okPct = Math.round((okCount / total) * 100)
  const pendingPct = 100 - okPct // FIX: sempre complementar, nunca sobrepõe
  return { coverage: okPct, okPct, pendingPct, okCount, soonCount, lateCount, total }
}
