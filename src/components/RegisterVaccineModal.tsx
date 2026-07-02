// src/components/RegisterVaccineModal.tsx
// Modal de registo de vacina partilhado entre VaccinesPage e PetDetailPage.
// Catálogo por espécie + toggle para nome personalizado.

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PfBtn, PfFooter } from './FooterButtons'

// ── Catálogo por espécie ──────────────────────────────────────────────────────

const VACCINES_BY_SPECIES: Record<string, string[]> = {
  dog: [
    'Raiva', 'Parvovirose', 'Cinomose', 'Hepatite Infecciosa',
    'Parainfluenza', 'Leptospirose', 'Tosse do Canil (Bordetella)',
    'Leishmaniose', 'Giardíase',
  ],
  cat: [
    'Raiva', 'Panleucopenia', 'Herpesvírus Felino', 'Calicivírus',
    'Leucemia Felina (FeLV)', 'Clamidiose',
    'Peritonite Infecciosa Felina (PIF)',
  ],
  bird:    ['Doença de Newcastle', 'Varíola Aviária', 'Polyomavírus', 'Psitacose'],
  rabbit:  ['Mixomatose', 'Doença Hemorrágica Viral (VHD)', 'VHD-2'],
  reptile: [],
  fish:    [],
  other:   [],
}

// ── Tipos exportados ──────────────────────────────────────────────────────────

export interface RegisterVaccineData {
  name:     string
  date:     string   // ISO YYYY-MM-DD
  nextDate: string   // ISO YYYY-MM-DD ('' se não definida)
  vet:      string
  notes:    string
}

interface Props {
  isOpen:     boolean
  onClose:    () => void
  petName:    string
  petSpecies: string
  onRegister: (data: RegisterVaccineData) => void
}

// ── Componente ────────────────────────────────────────────────────────────────

export default function RegisterVaccineModal({
  isOpen,
  onClose,
  petName,
  petSpecies,
  onRegister,
}: Props) {
  const { t } = useTranslation()
  const today  = new Date().toISOString().split('T')[0]
  const catalog = VACCINES_BY_SPECIES[petSpecies] ?? []

  const [selectedName, setSelectedName] = useState('')
  const [customName,   setCustomName]   = useState('')
  const [isCustom,     setIsCustom]     = useState(false)
  const [date,         setDate]         = useState(today)
  const [nextDate,     setNextDate]     = useState('')
  const [vet,          setVet]          = useState('')
  const [notes,        setNotes]        = useState('')
  const [errName,      setErrName]      = useState('')
  const [errDate,      setErrDate]      = useState('')
  const [success,      setSuccess]      = useState(false)

  // Reset ao abrir
  useEffect(() => {
    if (!isOpen) return
    setSelectedName(''); setCustomName(''); setIsCustom(catalog.length === 0)
    setDate(today); setNextDate(''); setVet(''); setNotes('')
    setErrName(''); setErrDate(''); setSuccess(false)
  }, [isOpen, today, catalog.length])

  if (!isOpen) return null

  const finalName = isCustom ? customName.trim() : selectedName

  const handleSubmit = () => {
    let valid = true
    if (!finalName) { setErrName(t('pet.vacc.errSelect')); valid = false }
    if (!date)      { setErrDate(t('pet.vacc.errDate'));   valid = false }
    if (!valid) return

    setSuccess(true)
    setTimeout(() => {
      onRegister({ name: finalName, date, nextDate, vet, notes })
      setSuccess(false)
      onClose()
    }, 900)
  }

  return (
    <div
      className="detail-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="detail-sheet"
        style={{ maxWidth: 480 }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="detail-header">
          <div
            className="detail-icon"
            style={{ background: 'var(--success-hl)', color: 'var(--success)', fontSize: '1.375rem' }}
          >
            💉
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>
              {t('pet.vacc.modalTitle')}
            </div>
            <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.15rem' }}>
              {t('pet.vacc.modalSubtitle', { name: petName })}
            </div>
          </div>
          <button className="detail-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Sucesso ── */}
        {success ? (
          <div className="modal-success">
            <div className="modal-success-icon" style={{ background: 'var(--success)' }}>✓</div>
            <div className="modal-success-title">{t('pet.vacc.successTitle')}</div>
            <div className="modal-success-sub">
              {t('pet.vacc.successSub', { name: petName })}
            </div>
          </div>
        ) : (
          <div
            className="detail-body"
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {/* ── Vacina ── */}
            <div className="modal-section">{t('pet.vacc.sectionVaccine')}</div>

            {/* Toggle catálogo / nome personalizado */}
            {catalog.length > 0 && (
              <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                {[
                  { val: false, label: '📋 ' + t('pet.vacc.selectLabel', { defaultValue: 'Catálogo' }) },
                  { val: true,  label: '✏️ ' + t('pet.vacc.customLabel',  { defaultValue: 'Escrever nome' }) },
                ].map(opt => (
                  <button
                    key={String(opt.val)}
                    type="button"
                    style={{
                      padding: '.3rem .875rem', borderRadius: 'var(--r-full)',
                      fontSize: '.8125rem', fontWeight: 700,
                      cursor: 'pointer', fontFamily: 'inherit',
                      border: `1.5px solid ${isCustom === opt.val ? 'var(--primary)' : 'var(--border)'}`,
                      background: isCustom === opt.val ? 'var(--primary-hl)' : 'var(--surface)',
                      color:      isCustom === opt.val ? 'var(--primary)' : 'var(--text-muted)',
                      transition: 'all var(--trans)',
                    }}
                    onClick={() => { setIsCustom(opt.val); setErrName('') }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Catálogo de vacinas */}
            {!isCustom && catalog.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '.375rem' }}>
                {catalog.map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => { setSelectedName(v); setErrName('') }}
                    style={{
                      padding: '.5rem .75rem', borderRadius: 'var(--r-lg)',
                      fontSize: '.8125rem', fontWeight: selectedName === v ? 800 : 600,
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                      transition: 'all var(--trans)',
                      border:     `1.5px solid ${selectedName === v ? 'var(--success)' : 'var(--border)'}`,
                      background:  selectedName === v ? 'var(--success-hl)' : 'var(--surface)',
                      color:       selectedName === v ? 'var(--success)' : 'var(--text)',
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            ) : (
              /* Nome personalizado (ou espécie sem catálogo) */
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  {t('pet.vacc.customName', { defaultValue: 'Nome da vacina' })} *
                </label>
                <input
                  className={`form-input${errName ? ' input-error' : ''}`}
                  value={customName}
                  onChange={e => { setCustomName(e.target.value); setErrName('') }}
                  placeholder={t('pet.vacc.customNamePh', { defaultValue: 'Ex: Raiva, Panleucopenia…' })}
                  autoFocus
                />
                {errName && <span className="form-hint-err">{errName}</span>}
              </div>
            )}

            {/* Erro de seleção (catálogo) */}
            {errName && !isCustom && (
              <span className="form-hint-err">{errName}</span>
            )}

            {/* ── Datas ── */}
            <div className="modal-section">{t('pet.vacc.sectionDates')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{t('pet.vacc.dateApplied')} *</label>
                <input
                  type="date"
                  className={`form-input${errDate ? ' input-error' : ''}`}
                  value={date}
                  max={today}
                  onChange={e => { setDate(e.target.value); setErrDate('') }}
                />
                {errDate && <span className="form-hint-err">{errDate}</span>}
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  {t('pet.vacc.dateNext')}{' '}
                  <span style={{ color: 'var(--text-faint)', fontWeight: 500 }}>
                    ({t('btn.optional')})
                  </span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={nextDate}
                  min={date || today}
                  onChange={e => setNextDate(e.target.value)}
                />
              </div>
            </div>

            {/* ── Extra ── */}
            <div className="modal-section">{t('pet.vacc.sectionExtra')}</div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                {t('field.vet')}{' '}
                <span style={{ color: 'var(--text-faint)', fontWeight: 500 }}>
                  ({t('btn.optional')})
                </span>
              </label>
              <div className="field-icon-wrap">
                <span className="field-icon">🩺</span>
                <input
                  className="form-input"
                  placeholder={t('pet.vacc.vetPh')}
                  value={vet}
                  onChange={e => setVet(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">
                {t('field.notes')}{' '}
                <span style={{ color: 'var(--text-faint)', fontWeight: 500 }}>
                  ({t('btn.optional')})
                </span>
              </label>
              <textarea
                className="form-input"
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                style={{ resize: 'vertical', minHeight: 56, fontFamily: 'inherit' }}
              />
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        {!success && (
          <PfFooter>
            <PfBtn variant="cancel" onClick={onClose}>
              {t('btn.cancel')}
            </PfBtn>
            <PfBtn variant="register" onClick={handleSubmit}>
              {t('pet.vacc.registerBtn')}
            </PfBtn>
          </PfFooter>
        )}
      </div>
    </div>
  )
}
