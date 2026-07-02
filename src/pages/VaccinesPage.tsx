// src/pages/VaccinesPage.tsx
import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePetsContext } from '../context/PetsContext'
import { useVaccinesContext } from '../context/VaccinesContext'
import RegisterVaccineModal from '../components/RegisterVaccineModal'
import type { RegisterVaccineData } from '../components/RegisterVaccineModal'
import VaccineDetailModal from '../components/VaccineDetailModal'
import EditVaccineModal from '../components/EditVaccineModal'
import VaccRing from '../components/VaccRing'
import { getVaccStatus } from '../utils/vaccUtils'
import type { VaccineRecord } from '../utils/vaccUtils'
import BackButton from '../components/BackButton'

const SPECIES_EMOJI: Record<string, string> = {
  cat: '🐱', dog: '🐶', bird: '🦜', rabbit: '🐰',
  reptile: '🦎', fish: '🐠', other: '🐾',
}

export default function VaccinesPage() {
  const { t, i18n } = useTranslation()
  const { pets }    = usePetsContext()
  const {
    vaccinesByPet,
    loading: vaccinesLoading,
    addVaccine,
    updateVaccine,
  } = useVaccinesContext()

  const [selectedPetId, setSelectedPetId] = useState<string | undefined>(undefined)
  const [registerOpen,  setRegisterOpen]  = useState(false)
  const [detailVaccine, setDetailVaccine] = useState<
    (VaccineRecord & { cls: 'ok' | 'soon' | 'late' }) | null
  >(null)
  const [editVaccine, setEditVaccine] = useState<VaccineRecord | null>(null)
  const [editOpen,    setEditOpen]    = useState(false)

  // Selecciona o primeiro pet quando a lista carrega
  useEffect(() => {
    if (pets.length && !selectedPetId) setSelectedPetId(pets[0].id)
  }, [pets, selectedPetId])

  // Se o pet seleccionado deixar de existir, volta ao primeiro
  useEffect(() => {
    if (selectedPetId && !pets.find(p => p.id === selectedPetId)) {
      setSelectedPetId(pets[0]?.id)
    }
  }, [pets, selectedPetId])

  const selectedPet = useMemo(
    () => pets.find(p => p.id === selectedPetId) ?? null,
    [pets, selectedPetId]
  )

  const petVaccines = useMemo(
    () => vaccinesByPet[selectedPetId ?? ''] ?? [],
    [vaccinesByPet, selectedPetId]
  )

  const withStatus = useMemo(
    () => petVaccines.map(v => ({
      ...v,
      cls: getVaccStatus(v.nextDate) as 'ok' | 'soon' | 'late',
    })),
    [petVaccines]
  )

  const total   = petVaccines.length
  const okCount = withStatus.filter(v => v.cls === 'ok').length
  const alDia   = withStatus.filter(v => v.cls === 'ok' || v.cls === 'soon').length
  const pending = withStatus.filter(v => v.cls === 'soon' || v.cls === 'late').length
  const cov     = total > 0 ? Math.round(okCount / total * 100) : 100
  const alPct   = total > 0 ? Math.round(alDia  / total * 100) : 100
  const penPct  = total > 0 ? Math.round(pending / total * 100) : 0

  // FIX: chama addVaccine com AddVaccineInput (datas ISO brutas)
  const handleRegister = (v: RegisterVaccineData) => {
    if (!selectedPetId) return
    addVaccine(selectedPetId, {
      name:     v.name,
      date:     v.date,
      nextDate: v.nextDate,
      vet:      v.vet,
      notes:    v.notes,
    })
    setRegisterOpen(false)
  }

  const handleMarkApplied = (
    vacc: VaccineRecord,
    appliedDate: string,
    nextDate: string
  ) => {
    if (!selectedPetId) return
    const cls   = getVaccStatus(nextDate) as 'ok' | 'soon' | 'late'
    const badge = { ok: t('pet.vacc.badgeOk'), soon: t('pet.vacc.badgeSoon'), late: t('pet.vacc.badgeLate') }
    const bgCls = { ok: 'badge-green', soon: 'badge-yellow', late: 'badge-red' }
    updateVaccine(selectedPetId, {
      ...vacc,
      applied: new Date(`${appliedDate}T12:00:00`).toLocaleDateString(i18n.language, {
        day: '2-digit', month: 'short', year: 'numeric',
      }),
      nextDate,
      badge:    badge[cls],
      badgeCls: bgCls[cls],
    })
    setDetailVaccine(null)
  }

  if (!pets.length) {
    return (
      <div>
        <BackButton />
        <div className="page-header">
          <h1 className="page-title">{t('pet.vacc.title')}</h1>
        </div>
        <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🐾</div>
          <h3>{t('pets.noPets')}</h3>
          <p style={{ marginBottom: '1.5rem' }}>{t('pets.noPetsHint')}</p>
          <button className="btn btn-primary" onClick={() => { window.location.href = '/pets' }}>
            {t('pets.addPet')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <BackButton />

      <div className="page-header">
        <div>
          <h1 className="page-title">{t('pet.vacc.title')}</h1>
          <p className="page-subtitle">
            {selectedPet
              ? `${SPECIES_EMOJI[selectedPet.species] ?? '🐾'} ${selectedPet.name}`
              : ''}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setRegisterOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          {t('pet.vacc.registerBtn')}
        </button>
      </div>

      {/* Selector de pet */}
      {pets.length > 1 && (
        <div className="pet-selector" style={{ marginBottom: '1.5rem' }}>
          {pets.map(p => (
            <button
              key={p.id}
              type="button"
              className={`pet-chip${selectedPetId === p.id ? ' active' : ''}`}
              onClick={() => setSelectedPetId(p.id)}
            >
              {SPECIES_EMOJI[p.species] ?? '🐾'} {p.name}
            </button>
          ))}
        </div>
      )}

      {vaccinesLoading ? (
        <div className="empty-state"><p>{t('common.loading')}</p></div>
      ) : (
        <div className="grid-2">
          {/* ── Lista de vacinas ── */}
          <div className="card">
            <div className="card-title">
              {t('pet.vacc.title')}
              <span style={{ marginLeft: 'auto', fontSize: '.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {okCount}/{total}
              </span>
            </div>

            {withStatus.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '.875rem' }}>
                {t('pet.vacc.empty')}
              </div>
            ) : (
              withStatus.map(vacc => (
                <div
                  key={`${vacc.name}-${vacc.applied}`}
                  onClick={() => setDetailVaccine(vacc)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '.875rem',
                    padding: '.75rem 0', borderBottom: '1.5px solid var(--divider)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--r-lg)',
                    flexShrink: 0, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.1rem',
                    background: vacc.cls === 'ok' ? 'var(--success-hl)' : vacc.cls === 'soon' ? 'var(--gold-hl)' : 'var(--err-hl)',
                    color:      vacc.cls === 'ok' ? 'var(--success)'    : vacc.cls === 'soon' ? 'var(--gold)'    : 'var(--err)',
                  }}>
                    💉
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '.875rem' }}>{vacc.name}</div>
                    <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>
                      {t('pet.vacc.applied')} {vacc.applied}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {vacc.nextDate && (
                      <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginBottom: '.2rem' }}>
                        {vacc.cls === 'late' ? t('pet.vacc.expired') : t('pet.vacc.next')}{' '}
                        {new Date(`${vacc.nextDate}T12:00:00`).toLocaleDateString(i18n.language, {
                          day: '2-digit', month: 'short',
                        })}
                      </div>
                    )}
                    <span className={`badge ${vacc.badgeCls}`} style={{ fontSize: '.6rem' }}>
                      {vacc.badge}
                    </span>
                  </div>
                </div>
              ))
            )}

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => setRegisterOpen(true)}
            >
              + {t('pet.vacc.registerBtn')}
            </button>
          </div>

          {/* ── Cobertura vacinal ── */}
          <div className="card">
            <div className="card-title">{t('pet.vacc.coverage')}</div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0 1.5rem' }}>
              <VaccRing coverage={cov} size={96} strokeWidth={8} />
            </div>
            {[
              { label: t('pet.vacc.coverageTotal'),   pct: cov,   color: ''                              },
              { label: t('pet.vacc.coverageOk'),      pct: alPct, color: 'success'                       },
              { label: t('pet.vacc.coveragePending'), pct: penPct, color: penPct > 0 ? 'warn' : 'success' },
            ].map(b => (
              <div key={b.label} style={{ marginBottom: '.875rem' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '.8125rem', marginBottom: '.375rem',
                }}>
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
      )}

      {/* ── Modais ── */}
      {registerOpen && selectedPet && (
        <RegisterVaccineModal
          isOpen={registerOpen}
          onClose={() => setRegisterOpen(false)}
          petName={selectedPet.name}
          petSpecies={selectedPet.species}
          onRegister={handleRegister}
        />
      )}

      {detailVaccine && selectedPet && (
        <VaccineDetailModal
          vaccine={{
            ...detailVaccine,
            petName:  selectedPet.name,
            petEmoji: SPECIES_EMOJI[selectedPet.species] ?? '🐾',
          }}
          onClose={() => setDetailVaccine(null)}
          onEdit={v => { setDetailVaccine(null); setEditVaccine(v); setEditOpen(true) }}
          onMarkApplied={(v, appliedDate, nextDate) => handleMarkApplied(v, appliedDate, nextDate)}
        />
      )}

      {editOpen && editVaccine && selectedPet && (
        <EditVaccineModal
          isOpen={editOpen}
          onClose={() => { setEditOpen(false); setEditVaccine(null) }}
          vaccine={editVaccine}
          onSave={updated => {
            updateVaccine(selectedPetId!, updated)
            setEditOpen(false)
            setEditVaccine(null)
          }}
        />
      )}
    </div>
  )
}
