import { useState } from 'react'
import { MOCK_PETS, VACCINES_BY_PET, getVaccStatus } from '../hooks/usePets'
import type { VaccineRecord } from '../hooks/usePets'
import { RegisterVaccineModal } from './PetDetailPage'
import { showToast } from '../components/AppLayout'
import VaccRing from '../components/VaccRing'

export default function VaccinesPage() {
  const [selectedPetId, setSelectedPetId] = useState(MOCK_PETS[0].id)
  const [registerOpen,  setRegisterOpen]  = useState(false)
  const [extraVacc,     setExtraVacc]     = useState<Record<string, VaccineRecord[]>>({})

  const pet        = MOCK_PETS.find(p => p.id === selectedPetId) ?? MOCK_PETS[0]
  const base       = VACCINES_BY_PET[selectedPetId] ?? []
  const extra      = extraVacc[selectedPetId] ?? []
  const vaccines   = [...base, ...extra]
  const withStatus = vaccines.map(v => ({ ...v, cls: getVaccStatus(v.nextDate) as 'ok' | 'soon' | 'late' }))

  const okCount      = withStatus.filter(v => v.cls === 'ok').length
  const alDiaCount   = withStatus.filter(v => v.cls === 'ok' || v.cls === 'soon').length
  const pendingCount = withStatus.filter(v => v.cls === 'soon' || v.cls === 'late').length
  const total        = vaccines.length

  const coverage   = total > 0 ? Math.round((okCount      / total) * 100) : 100
  const alDiaPct   = total > 0 ? Math.round((alDiaCount   / total) * 100) : 100
  const pendingPct = total > 0 ? Math.round((pendingCount / total) * 100) : 0

  const handleRegister = ({ name, date, nextDate }: { name: string; date: string; nextDate: string; vet: string; notes: string }) => {
    const lbl = new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    const cls = getVaccStatus(nextDate)
    setExtraVacc(prev => ({
      ...prev,
      [selectedPetId]: [...(prev[selectedPetId] ?? []), {
        name, applied: lbl, nextDate,
        badge:    cls === 'ok' ? 'AL DÍA' : cls === 'soon' ? 'POR VENCER' : 'VENCIDA',
        badgeCls: cls === 'ok' ? 'badge-green' : cls === 'soon' ? 'badge-yellow' : 'badge-red',
      }],
    }))
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Vacunas</div>
          <div className="page-subtitle">Control de vacunación de tus mascotas</div>
        </div>
        <button className="btn btn-primary" onClick={() => setRegisterOpen(true)}>
          💉 Registrar vacuna
        </button>
      </div>

      {/* Selector de mascota */}
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {MOCK_PETS.map(p => (
          <button
            key={p.id}
            className={['btn', selectedPetId === p.id ? 'btn-primary' : 'btn-secondary'].join(' ')}
            onClick={() => setSelectedPetId(p.id)}
          >
            {p.species === 'cat' ? '🐱' : p.species === 'dog' ? '🐶' : '🦜'} {p.name}
          </button>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            Vacunas de {pet.name}
            <button className="btn btn-primary btn-sm" onClick={() => setRegisterOpen(true)}>💉 Registrar</button>
          </div>
          {withStatus.map(v => (
            <div key={v.name + v.nextDate} className="vaccine-row">
              <div className="vaccine-icon" style={{
                background: v.cls === 'ok' ? 'var(--success-hl)' : v.cls === 'soon' ? 'var(--gold-hl)' : 'var(--err-hl)',
                color:      v.cls === 'ok' ? 'var(--success)'    : v.cls === 'soon' ? 'var(--gold)'    : 'var(--err)',
              }}>💉</div>
              <div style={{ flex: 1 }}>
                <div className="vaccine-name">{v.name}</div>
                <div className="vaccine-date">Aplicada {v.applied}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className={`vaccine-next ${v.cls}`}>
                  {v.cls === 'late'
                    ? `Vencida · ${new Date(v.nextDate).toLocaleDateString('es-ES')}`
                    : `Próxima ${new Date(v.nextDate).toLocaleDateString('es-ES')}`}
                </div>
                <span className={`badge ${v.badgeCls}`} style={{ fontSize: '.6rem' }}>{v.badge}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-title">Cobertura de {pet.name}</div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0 1.5rem' }}>
            <VaccRing coverage={coverage} size={96} strokeWidth={8} />
          </div>
          {[
            { label: 'Cobertura vacunal',   pct: coverage,   color: ''        },
            { label: 'Vacunas al día',      pct: alDiaPct,   color: 'success' },
            { label: 'Pendientes/vencidas', pct: pendingPct, color: pendingPct > 0 ? 'warn' : 'success' },
          ].map(b => (
            <div key={b.label} style={{ marginBottom: '.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8125rem', marginBottom: '.375rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{b.label}</span>
                <span style={{ fontWeight: 700 }}>{b.pct}%</span>
              </div>
              <div className="progress-wrap">
                <div className={`progress-bar ${b.color}`} style={{ width: `${b.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <RegisterVaccineModal
        petName={pet.name}
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        vaccines={vaccines}
        onRegister={handleRegister}
      />
    </div>
  )
}
