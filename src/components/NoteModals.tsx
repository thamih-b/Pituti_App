import { useState, useEffect } from 'react'
import Modal from './Modal'
import FormDateField from './FormDateField'
import { showToast } from './AppLayout'
import { PfBtn, PfFooter } from './FooterButtons'

export interface NoteEntry {
  id:       string
  petId:    string
  content:  string
  vet:      string
  date:     string
  type:     string
  archived: boolean
}

const TYPE_ICON:  Record<string,string> = { control:'🩺', observacion:'👁', emergencia:'🚨', vacuna:'💉', cirugia:'🔬', otro:'📋' }
const TYPE_COLOR: Record<string,string> = { control:'var(--blue)', observacion:'var(--primary)', emergencia:'var(--err)', vacuna:'var(--success)', cirugia:'var(--warn)', otro:'var(--text-muted)' }
const TYPE_BG:    Record<string,string> = { control:'var(--blue-hl)', observacion:'var(--primary-hl)', emergencia:'var(--err-hl)', vacuna:'var(--success-hl)', cirugia:'var(--warn-hl)', otro:'var(--surface-offset)' }
const TYPE_LABEL: Record<string,string> = { control:'Control', observacion:'Observación', emergencia:'Emergencia', vacuna:'Post-vacuna', cirugia:'Cirugía', otro:'Nota' }
const PET_META: Record<string,{emoji:string;name:string}> = {
  'pet-1':{ emoji:'🐱', name:'Luna' }, 'pet-2':{ emoji:'🐶', name:'Toby' }, 'pet-3':{ emoji:'🦜', name:'Kiwi' },
}

// ── Detail Overlay ─────────────────────────────────────────────────
interface DetailProps {
  note:       NoteEntry | null
  onClose:    () => void
  onEdit:     (n: NoteEntry) => void
  onArchive:  (id: string) => void
  onUnarchive:(id: string) => void
  onDelete:   (id: string) => void
}

export function NoteDetailModal({ note, onClose, onEdit, onArchive, onUnarchive, onDelete }: DetailProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => { if (!note) setConfirmDelete(false) }, [note])

  if (!note) return null

  const pm  = PET_META[note.petId] ?? { emoji:'🐾', name:'Mascota' }
  const fg  = TYPE_COLOR[note.type] ?? 'var(--text-muted)'
  const bg  = TYPE_BG[note.type]   ?? 'var(--surface-offset)'
  const ic  = TYPE_ICON[note.type] ?? '📋'
  const lbl = TYPE_LABEL[note.type] ?? 'Nota'

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-sheet" style={{ maxWidth:440 }} onClick={e => e.stopPropagation()}>

        <div className="detail-header">
          <div className="detail-icon" style={{ background:bg, color:fg, fontSize:'1.375rem' }}>{ic}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:800, fontSize:'1rem', color:'var(--text)' }}>{lbl}</div>
            <div style={{ fontSize:'.8125rem', color:'var(--text-muted)', marginTop:'.2rem' }}>
              {pm.emoji} {pm.name} {note.vet ? `· ${note.vet}` : ''}
            </div>
          </div>
          <button className="detail-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="detail-body">
          <div style={{ display:'flex',gap:'.5rem',marginBottom:'1rem',flexWrap:'wrap' }}>
            <span className={`status-pill ${note.archived?'archived':'ok'}`}>
              {note.archived ? '📁 Archivada' : '● Activa'}
            </span>
            <span style={{ fontSize:'.75rem',color:'var(--text-faint)',fontWeight:600 }}>
              {new Date(note.date+'T12:00:00').toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'})}
            </span>
          </div>

          {note.vet && (
            <div className="detail-info-chip" style={{ marginBottom:'1rem' }}>
              <div className="detail-info-label">Veterinario</div>
              <div className="detail-info-value">🩺 {note.vet}</div>
            </div>
          )}

          <div style={{ background:'var(--surface-offset)',border:'1.5px solid var(--border)',borderRadius:'var(--r-lg)',padding:'.875rem 1rem',marginBottom:confirmDelete?'1rem':0 }}>
            <div style={{ fontSize:'.65rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.07em',color:'var(--text-faint)',marginBottom:'.5rem' }}>Contenido</div>
            <div style={{ fontSize:'.875rem',color:'var(--text)',lineHeight:1.6 }}>{note.content}</div>
          </div>

          {/* Delete confirmation */}
          {confirmDelete && (
            <div className="note-delete-confirm">
              <div style={{ fontWeight:800,fontSize:'.875rem',color:'var(--err)',marginBottom:'.5rem' }}>
                ¿Eliminar esta nota?
              </div>
              <div style={{ fontSize:'.8125rem',color:'var(--text-muted)',lineHeight:1.5,marginBottom:'.875rem' }}>
                La nota "<em>{note.content.slice(0,50)}{note.content.length>50?'…':''}</em>" será eliminada permanentemente y no podrá recuperarse.
              </div>
              <div style={{ display:'flex',gap:'.5rem',justifyContent:'flex-end' }}>
                <PfBtn variant="cancel" size="sm" onClick={() => setConfirmDelete(false)}>Cancelar</PfBtn>
                <PfBtn variant="delete" size="sm" onClick={() => { onDelete(note.id); onClose() }}>Eliminar definitivamente</PfBtn>
              </div>
            </div>
          )}
        </div>

        <div className="detail-footer" style={{ justifyContent:'space-between' }}>
          <PfBtn variant="delete" size="sm" onClick={() => setConfirmDelete(true)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            Eliminar
          </PfBtn>
          <div style={{ display:'flex',gap:'.375rem' }}>
            <PfBtn variant="edit" size="sm" onClick={() => { onEdit(note); onClose() }}>Editar</PfBtn>
            {note.archived
              ? <PfBtn variant="primary" size="sm" onClick={() => { onUnarchive(note.id); onClose() }}>↩ Desarchivar</PfBtn>
              : <PfBtn variant="archive" size="sm" onClick={() => { onArchive(note.id); onClose() }}>📁 Archivar</PfBtn>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Edit Note Modal ────────────────────────────────────────────────
const NOTE_TYPES = [
  { val:'control',     icon:'🩺', label:'Control',    bg:'var(--blue-hl)',     fg:'var(--blue)'    },
  { val:'observacion', icon:'👁',  label:'Observación',bg:'var(--primary-hl)', fg:'var(--primary)' },
  { val:'emergencia',  icon:'🚨', label:'Emergencia', bg:'var(--err-hl)',      fg:'var(--err)'     },
  { val:'vacuna',      icon:'💉', label:'Post-vacuna',bg:'var(--success-hl)', fg:'var(--success)' },
  { val:'cirugia',     icon:'🔬', label:'Cirugía',    bg:'var(--warn-hl)',     fg:'var(--warn)'    },
  { val:'otro',        icon:'📋', label:'Otro',       bg:'var(--surface-offset)','fg':'var(--text-muted)' },
]

interface EditProps {
  isOpen:  boolean
  onClose: () => void
  note:    NoteEntry | null
  onSave:  (updated: NoteEntry) => void
}

export function EditNoteModal({ isOpen, onClose, note, onSave }: EditProps) {
  const today = new Date().toISOString().split('T')[0]
  const [content, setContent] = useState('')
  const [vet,     setVet]     = useState('')
  const [date,    setDate]    = useState(today)
  const [type,    setType]    = useState('control')
  const [contErr, setContErr] = useState('')

  useEffect(() => {
    if (note && isOpen) {
      setContent(note.content); setVet(note.vet); setDate(note.date); setType(note.type); setContErr('')
    }
  }, [note, isOpen])

  if (!note) return null

  const selType = NOTE_TYPES.find(n => n.val === type)!

  const handleSave = () => {
    if (!content.trim()) { setContErr('El contenido no puede estar vacío'); return }
    onSave({ ...note, content:content.trim(), vet, date, type })
    showToast('📋 Nota actualizada')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar nota"
      subtitle={`${PET_META[note.petId]?.emoji} ${PET_META[note.petId]?.name}`}
      icon={selType.icon}
      accentBg={selType.bg}
      accentFg={selType.fg}
      size="md"
      footer={
        <PfFooter>
          <PfBtn variant="cancel" onClick={onClose}>Cancelar</PfBtn>
          <PfBtn variant="save" onClick={handleSave}>Guardar cambios</PfBtn>
        </PfFooter>
      }
    >
      <div className="modal-section">Tipo</div>
      <div className="note-type-grid" style={{ marginBottom:'1rem' }}>
        {NOTE_TYPES.map(n => (
          <button key={n.val} type="button"
            className={['note-type-btn', type===n.val?'active':''].join(' ')}
            style={type===n.val?{background:n.bg,borderColor:n.fg,color:n.fg}:{}}
            onClick={() => setType(n.val)}>
            <span style={{ fontSize:'1.1rem' }}>{n.icon}</span>
            <span style={{ fontSize:'.72rem', fontWeight:700 }}>{n.label}</span>
          </button>
        ))}
      </div>

      <div className="modal-section">Contenido</div>
      <div className="form-group">
        <div className={['form-input', contErr?'form-input--err':''].join(' ')} style={{ padding:0 }}>
          <textarea style={{ width:'100%',padding:'.625rem .875rem',border:'none',background:'transparent',outline:'none',fontFamily:'inherit',fontSize:'.875rem',resize:'vertical',minHeight:100,color:'var(--text)',lineHeight:1.6 }}
            value={content} onChange={e=>{setContent(e.target.value);setContErr('')}} autoFocus/>
        </div>
        {contErr && <span className="form-hint-err">{contErr}</span>}
      </div>

      <div className="modal-section">Detalles</div>
      <div className="form-row">
        <div className="form-group" style={{ marginBottom:0 }}>
          <label className="form-label">Veterinario <span style={{ color:'var(--text-faint)',fontWeight:500 }}>(opcional)</span></label>
          <div className="field-icon-wrap"><span className="field-icon">🩺</span><input className="form-input" value={vet} onChange={e=>setVet(e.target.value)} placeholder="Dra. García"/></div>
        </div>
        <FormDateField label="Fecha" value={date} onChange={setDate} max={today}/>
      </div>
    </Modal>
  )
}
