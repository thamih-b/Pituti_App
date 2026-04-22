import { useState, useEffect } from 'react'
import Modal from './Modal'
import type { VaccineRecord } from '../hooks/usePets'
import { showToast } from './AppLayout'
import { PfBtn, PfFooter } from '../components/FooterButtons'

interface Props {
  isOpen:  boolean
  onClose: () => void
  vaccine: VaccineRecord | null
  onSave:  (updated: VaccineRecord) => void
}

export default function EditVaccineModal({ isOpen, onClose, vaccine, onSave }: Props) {
  const [name,      setName]      = useState('')
  const [applied,   setApplied]   = useState('')
  const [nextDate,  setNextDate]  = useState('')
  const [nameErr,   setNameErr]   = useState('')
  const [nextErr,   setNextErr]   = useState('')
  const [success,   setSuccess]   = useState(false)

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
    if (!name.trim()) { setNameErr('El nombre es obligatorio'); return }
    if (!nextDate)    { setNextErr('La próxima dosis es obligatoria'); return }
    setSuccess(true)
    setTimeout(() => {
      onSave({ ...vaccine, name: name.trim(), applied, nextDate })
      showToast(`💉 ${name.trim()} actualizada`)
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
        ? 
        <PfFooter>
  <PfBtn variant="save" onClick={handleSave}>Guardar cambios</PfBtn>
</PfFooter>
        
        
        : <></>
      }
    >
      <div className="modal-hero" style={{ background: 'linear-gradient(135deg,var(--blue-hl),var(--surface))' }}>
        <div className="modal-hero-icon" style={{ background: 'var(--blue)', fontSize: '1.5rem' }}>💉</div>
        <div>
          <div className="modal-hero-title">Editar vacuna</div>
          <div className="modal-hero-sub">{vaccine.name}</div>
        </div>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">Vacuna actualizada</div>
        </div>
      ) : (
        <>
          <div className="modal-section">Nombre</div>
          <div className="form-group">
            <div className="field-icon-wrap">
              <span className="field-icon">💉</span>
              <input className={['form-input', nameErr ? 'form-input--err' : ''].join(' ')}
                value={name} onChange={e => { setName(e.target.value); setNameErr('') }}
                placeholder="Nombre de la vacuna" autoFocus/>
            </div>
            {nameErr && <span className="form-hint-err">{nameErr}</span>}
          </div>

          <div className="modal-section">Fechas</div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Última aplicación</label>
              <input type="text" className="form-input" value={applied}
                onChange={e => setApplied(e.target.value)}
                placeholder="Ej: 15 abr 2026"/>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Próxima dosis *</label>
              <input type="date" className={['form-input', nextErr ? 'form-input--err' : ''].join(' ')}
                value={nextDate} onChange={e => { setNextDate(e.target.value); setNextErr('') }}/>
              {nextErr && <span className="form-hint-err">{nextErr}</span>}
            </div>
          </div>
        </>
      )}
    </Modal>
  )
}
