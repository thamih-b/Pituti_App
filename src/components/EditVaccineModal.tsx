// TRADUZIDO

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import type { VaccineRecord } from '../utils/vaccUtils'
import { showToast } from './AppLayout'
import { PfBtn, PfFooter } from '../components/FooterButtons'

interface Props {
  isOpen:  boolean
  onClose: () => void
  vaccine: VaccineRecord | null
  onSave:  (updated: VaccineRecord) => void
}

export default function EditVaccineModal({ isOpen, onClose, vaccine, onSave }: Props) {
  const { t } = useTranslation()
  const [name,     setName]     = useState('')
  const [applied,  setApplied]  = useState('')
  const [nextDate, setNextDate] = useState('')
  const [nameErr,  setNameErr]  = useState('')
  const [nextErr,  setNextErr]  = useState('')
  const [success,  setSuccess]  = useState(false)

  useEffect(() => {
    if (vaccine && isOpen) {
      setName(vaccine.name)
      setApplied(vaccine.applied)
      setNextDate(vaccine.nextDate)
      setNameErr(''); setNextErr(''); setSuccess(false)
    }
  }, [vaccine, isOpen])

  if (!vaccine) return null

  const handleSave = () => {
    if (!name.trim()) { setNameErr(t('vet.contacts.errName')); return }
    if (!nextDate)    { setNextErr(t('vaccines.edit.errNext')); return }
    setSuccess(true)
    setTimeout(() => {
      onSave({ ...vaccine, name: name.trim(), applied, nextDate })
      showToast(`💉 ${name.trim()} ${t('vaccines.edit.toastUpdated')}`)
      setSuccess(false); onClose()
    }, 900)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      icon=""
      accentBg="var(--blue-hl)"
      accentFg="var(--blue)"
      footer={!success
        ? <PfFooter>
            <PfBtn variant="save" onClick={handleSave}>{t('vaccines.edit.saveBtn')}</PfBtn>
          </PfFooter>
        : <></>
      }
    >
      <div className="modal-hero" style={{ background: 'linear-gradient(135deg,var(--blue-hl),var(--surface))' }}>
        <div className="modal-hero-icon" style={{ background: 'var(--blue)', fontSize: '1.5rem' }}>💉</div>
        <div style={{ flex: 1 }}>
          <div className="modal-hero-title">{t('vaccines.edit.title')}</div>
          <div className="modal-hero-sub">{vaccine.name}</div>
        </div>
        <button className="pm-close" onClick={onClose} aria-label={t('modal.close')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">{t('vaccines.edit.successTitle')}</div>
        </div>
      ) : (
        <>
          <div className="modal-section">{t('field.name')}</div>
          <div className="form-group">
            <div className="field-icon-wrap">
              <span className="field-icon">💉</span>
              <input
                className={['form-input', nameErr ? 'form-input--err' : ''].join(' ')}
                value={name}
                onChange={e => { setName(e.target.value); setNameErr('') }}
                placeholder={t('vaccines.edit.namePh')}
                autoFocus
              />
            </div>
            {nameErr && <span className="form-hint-err">{nameErr}</span>}
          </div>

          <div className="modal-section">{t('vaccines.edit.sectionDates')}</div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('vaccines.edit.labelApplied')}</label>
              <input
                type="text"
                className="form-input"
                value={applied}
                onChange={e => setApplied(e.target.value)}
                placeholder={t('vaccines.edit.appliedPh')}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">{t('vaccines.edit.labelNext')}</label>
              <input
                type="date"
                className={['form-input', nextErr ? 'form-input--err' : ''].join(' ')}
                value={nextDate}
                onChange={e => { setNextDate(e.target.value); setNextErr('') }}
              />
              {nextErr && <span className="form-hint-err">{nextErr}</span>}
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}