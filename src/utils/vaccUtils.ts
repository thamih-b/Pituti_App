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

// FIX (cobertura vacinal errada para vacinas futuras): uma vacina que NUNCA
// foi aplicada (applied === '') e cuja data agendada ainda não chegou não é
// "em dia" (o pet não está protegido — a vacina ainda não foi dada) nem
// "pendente/vencida" (a data ainda não passou, não há atraso nenhum). É um
// terceiro estado — AGENDADA — e não deve entrar na percentagem de
// cobertura de forma nenhuma, para não a distorcer artificialmente.
//
// Só passa a contar como "vencida" se a data agendada já tiver passado sem
// alguma vez ter sido marcada como aplicada.
//
// Continua a ser a ÚNICA fonte de verdade da cobertura vacinal — usada
// tanto no separador de Vacinas do pet como no ring da lista de pets.
export function computeVaccCoverage(vaccines: VaccineRecord[]): {
  coverage: number    // % "em dia" sobre o total CONTADO (exclui agendadas futuras)
  okPct: number       // igual a coverage
  pendingPct: number  // sempre complementar a okPct (soma 100% do total contado)
  okCount: number
  soonCount: number
  lateCount: number
  scheduledCount: number // agendadas para o futuro, ainda não vencidas — não entram na %
  total: number        // total efetivamente contado na percentagem
} {
  if (vaccines.length === 0) {
    return { coverage: 100, okPct: 100, pendingPct: 0, okCount: 0, soonCount: 0, lateCount: 0, scheduledCount: 0, total: 0 }
  }

  let okCount = 0, soonCount = 0, lateCount = 0, scheduledCount = 0

  for (const v of vaccines) {
    const neverApplied = !v.applied
    const status = getVaccStatus(v.nextDate)

    if (neverApplied) {
      if (status === 'late') {
        // agendada, mas a data já passou sem ter sido aplicada → vencida
        lateCount++
      } else {
        // agendada para o futuro, ainda não venceu → não conta na %
        scheduledCount++
      }
      continue
    }

    if (status === 'ok') okCount++
    else if (status === 'soon') soonCount++
    else lateCount++
  }

  const total = okCount + soonCount + lateCount // exclui agendadas futuras
  const okPct = total > 0 ? Math.round((okCount / total) * 100) : 100
  const pendingPct = total > 0 ? 100 - okPct : 0

  return { coverage: okPct, okPct, pendingPct, okCount, soonCount, lateCount, scheduledCount, total }
}