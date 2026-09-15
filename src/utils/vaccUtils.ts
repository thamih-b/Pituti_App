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

// FIX (cobertura vacinal — regra exata):
//   • EM DIA        = já foi aplicada alguma vez E a próxima dose não está
//                      vencida (inclui as que vencem em breve — só não
//                      inclui as já vencidas).
//   • VENCIDA        = a data (de aplicação seguinte, ou a própria data
//                      agendada nunca aplicada) já passou. Só estas contam
//                      como "pendente/vencida" — nunca as que só "vencem
//                      em breve".
//   • AGENDADA        = nunca foi aplicada e a data agendada ainda não
//                      chegou. Não entra em NENHUMA percentagem até se
//                      tornar vencida ou ser marcada como aplicada.
//
// Cobertura = em dia ÷ (em dia + vencidas) — as agendadas ficam de fora
// por completo do cálculo.
export function computeVaccCoverage(vaccines: VaccineRecord[]): {
  coverage: number       // % "em dia" sobre (em dia + vencidas)
  okPct: number          // igual a coverage
  pendingPct: number     // sempre complementar a okPct
  okCount: number        // em dia
  lateCount: number      // vencidas
  scheduledCount: number // agendadas para o futuro — fora da percentagem
  total: number          // em dia + vencidas (exclui agendadas)
} {
  if (vaccines.length === 0) {
    return { coverage: 100, okPct: 100, pendingPct: 0, okCount: 0, lateCount: 0, scheduledCount: 0, total: 0 }
  }

  let okCount = 0, lateCount = 0, scheduledCount = 0

  for (const v of vaccines) {
    const wasApplied = !!v.applied
    const status = getVaccStatus(v.nextDate)

    if (status === 'late') {
      // vencida — quer tenha sido aplicada antes (dose seguinte atrasada),
      // quer nunca tenha chegado a ser aplicada (data agendada já passada)
      lateCount++
    } else if (wasApplied) {
      // em dia: já foi aplicada e não está vencida (inclui "vence em breve")
      okCount++
    } else {
      // agendada para o futuro, nunca aplicada, ainda não venceu
      scheduledCount++
    }
  }

  const total = okCount + lateCount // exclui agendadas
  const okPct = total > 0 ? Math.round((okCount / total) * 100) : 100
  const pendingPct = total > 0 ? 100 - okPct : 0

  return { coverage: okPct, okPct, pendingPct, okCount, lateCount, scheduledCount, total }
}
