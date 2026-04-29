import { useState, useEffect } from 'react'
import Modal from './Modal'
import { showToast } from './AppLayout'
import FormDateField from './FormDateField'
import { PfBtn, PfFooter } from './FooterButtons'


/* ═══════════════════════════════════════════════════════════════
   CURRENT USER MOCK — substitua pelo contexto de auth real
══════════════════════════════════════════════════════════════════ */
export const CURRENT_USER = {
  id:       'user-1',
  name:     'Tú',
  avatar:   'TL',
  color:    'var(--primary-hl)',
  colorFg:  'var(--primary)',
}


/* ═══════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════════ */
export interface NoteReply {
  id:           string
  authorId:     string
  authorName:   string
  authorAvatar: string
  authorColor:  string   /* background */
  authorColorFg:string   /* texto */
  content:      string
  date:         string   /* ISO YYYY-MM-DD */
}

export interface NoteEntry {
  id:       string
  petId:    string
  content:  string
  vet:      string
  date:     string
  type:     string
  archived: boolean
  /* Author */
  authorId?:     string
  authorName?:   string
  authorAvatar?: string
  authorColor?:  string
  authorColorFg?:string
  /* Thread */
  replies?: NoteReply[]
}


/* ═══════════════════════════════════════════════════════════════
   CONSTANTES
══════════════════════════════════════════════════════════════════ */
const TYPEICON:  Record<string,string> = {
  control:'🩺', observacion:'👁', emergencia:'🚨', vacuna:'💉', cirugia:'🔬', otro:'📋',
}
const TYPEBG:    Record<string,string> = {
  control:'var(--blue-hl)', observacion:'var(--primary-hl)', emergencia:'var(--err-hl)',
  vacuna:'var(--success-hl)', cirugia:'var(--warn-hl)', otro:'var(--surface-offset)',
}
const TYPEFG:    Record<string,string> = {
  control:'var(--blue)', observacion:'var(--primary)', emergencia:'var(--err)',
  vacuna:'var(--success)', cirugia:'var(--warn)', otro:'var(--text-muted)',
}
const TYPELABEL: Record<string,string> = {
  control:'Control', observacion:'Observación', emergencia:'Emergencia',
  vacuna:'Post-vacuna', cirugia:'Cirugía', otro:'Nota',
}
const PETMETA: Record<string,{ emoji:string; name:string }> = {
  'pet-1':{ emoji:'🐱', name:'Luna' },
  'pet-2':{ emoji:'🐶', name:'Toby' },
  'pet-3':{ emoji:'🦜', name:'Kiwi' },
}
const NOTE_TYPES_EDIT = [
  { val:'control',     icon:'🩺', label:'Control'     },
  { val:'observacion', icon:'👁', label:'Observación' },
  { val:'emergencia',  icon:'🚨', label:'Emergencia'  },
  { val:'vacuna',      icon:'💉', label:'Post-vacuna' },
  { val:'cirugia',     icon:'🔬', label:'Cirugía'     },
  { val:'otro',        icon:'📋', label:'Otro'        },
]


/* ═══════════════════════════════════════════════════════════════
   AVATAR INLINE
══════════════════════════════════════════════════════════════════ */
function Avatar({ name, avatar, color, colorFg, size = 28 }: {
  name:string; avatar:string; color:string; colorFg:string; size?:number
}) {
  return (
    <div title={name} style={{
      width:size, height:size, borderRadius:'50%',
      background:color, color:colorFg,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:size * 0.36, fontWeight:800, flexShrink:0, letterSpacing:'-0.02em',
    }}>
      {avatar}
    </div>
  )
}


/* ═══════════════════════════════════════════════════════════════
   REPLY BUBBLE — "nota dentro da nota"
══════════════════════════════════════════════════════════════════ */
function ReplyBubble({ reply, isOwn }: { reply:NoteReply; isOwn:boolean }) {
  const dateStr = new Date(reply.date + 'T12:00:00').toLocaleDateString('es-ES', {
    day:'2-digit', month:'short',
  })
  return (
    <div style={{
      border:'1.5px solid var(--border)',
      borderLeft:`3px solid ${reply.authorColor}`,
      borderRadius:'var(--r-lg)',
      background: isOwn ? 'color-mix(in oklch,var(--primary-hl) 30%,var(--surface))' : 'var(--surface)',
      padding:'.625rem .875rem',
      marginBottom:'.5rem',
    }}>
      {/* mini header */}
      <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.4rem' }}>
        <Avatar
          name={reply.authorName} avatar={reply.authorAvatar}
          color={reply.authorColor} colorFg={reply.authorColorFg} size={24}
        />
        <span style={{ fontWeight:800, fontSize:'.8125rem', color:reply.authorColorFg }}>
          {reply.authorName}
        </span>
        {isOwn && (
          <span className="badge badge-blue" style={{ fontSize:'.6rem', padding:'.1rem .35rem' }}>Tú</span>
        )}
        <span style={{ marginLeft:'auto', fontSize:'.72rem', color:'var(--text-faint)' }}>
          {dateStr}
        </span>
      </div>
      {/* content */}
      <p style={{ fontSize:'.875rem', color:'var(--text)', lineHeight:1.6, margin:0 }}>
        {reply.content}
      </p>
    </div>
  )
}


/* ═══════════════════════════════════════════════════════════════
   NOTE DETAIL MODAL
══════════════════════════════════════════════════════════════════ */
interface DetailProps {
  note:        NoteEntry | null
  onClose:     () => void
  onEdit:      (n: NoteEntry) => void
  onArchive:   (id: string) => void
  onUnarchive: (id: string) => void
  onDelete?:   (id: string) => void
  onAddReply?: (noteId: string, reply: NoteReply) => void
}

export function NoteDetailModal({
  note, onClose, onEdit, onArchive, onUnarchive, onDelete, onAddReply, 
}: DetailProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [replyText,     setReplyText]     = useState('')
  

  useEffect(() => {
    if (!note) { setConfirmDelete(false); setReplyText('') }
  }, [note])

  if (!note) return null

  const pm   = PETMETA[note.petId] ?? { emoji:'🐾', name:'Mascota' }
  const fg   = TYPEFG[note.type]   ?? 'var(--text-muted)'
  const bg   = TYPEBG[note.type]   ?? 'var(--surface-offset)'
  const ic   = TYPEICON[note.type] ?? '📋'
  const lbl  = TYPELABEL[note.type]?? 'Nota'
  const replies = note.replies ?? []
  const dateStr = new Date(note.date + 'T12:00:00').toLocaleDateString('es-ES', {
    day:'2-digit', month:'short', year:'numeric',
  })

  const handleAddReply = () => {
    if (!replyText.trim() || !onAddReply) return
    const reply: NoteReply = {
      id:           `reply-${Date.now()}`,
      authorId:     CURRENT_USER.id,
      authorName:   CURRENT_USER.name,
      authorAvatar: CURRENT_USER.avatar,
      authorColor:  CURRENT_USER.color,
      authorColorFg:CURRENT_USER.colorFg,
      content:      replyText.trim(),
      date:         new Date().toISOString().split('T')[0],
    }
    onAddReply(note.id, reply)
    setReplyText('')
    showToast('📝 Nota añadida')
  }

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-sheet" style={{ maxWidth:460 }} onClick={e => e.stopPropagation()}>

        {/* ── Header ──────────────────────────────────── */}
        <div className="detail-header">
          <div className="detail-icon" style={{ background:bg, color:fg, fontSize:'1.375rem' }}>
            {ic}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:800, fontSize:'1rem', color:'var(--text)', lineHeight:1.2 }}>
              {lbl}
            </div>
            <div style={{ fontSize:'.8125rem', color:'var(--text-muted)', marginTop:'.15rem' }}>
              {pm.emoji} {pm.name} · {dateStr}
            </div>
          </div>
          <button className="detail-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── Body ────────────────────────────────────── */}
        <div className="detail-body" style={{ display:'flex', flexDirection:'column', gap:'.875rem' }}>

          {/* Status + arquivo */}
          <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
            <span className="status-pill ok">{lbl}</span>
            {note.archived && <span className="badge badge-gray">📁 Archivada</span>}
          </div>

          {/* Autor da nota */}
          {note.authorName && (
            <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
              <Avatar
                name={note.authorName}
                avatar={note.authorAvatar ?? note.authorName.slice(0,2).toUpperCase()}
                color={note.authorColor  ?? 'var(--primary-hl)'}
                colorFg={note.authorColorFg ?? 'var(--primary)'}
                size={26}
              />
              <span style={{ fontSize:'.8125rem', color:'var(--text-muted)' }}>
                Añadida por{' '}
                <strong style={{ color:'var(--text)' }}>{note.authorName}</strong>
              </span>
              {note.vet && (
                <span style={{ fontSize:'.8125rem', color:'var(--text-faint)' }}>
                  · 🩺 {note.vet}
                </span>
              )}
            </div>
          )}

          {/* Conteúdo principal da nota */}
          <div style={{
            background:'var(--surface-offset)',
            border:'1.5px solid var(--border)',
            borderLeft:`3px solid ${fg}`,
            borderRadius:'var(--r-lg)',
            padding:'.875rem 1rem',
          }}>
            <p style={{ fontSize:'.875rem', color:'var(--text)', lineHeight:1.6, margin:0 }}>
              {note.content}
            </p>
          </div>

          {/* ── Thread de respostas ("notas dentro da nota") ── */}
          {(replies.length > 0 || onAddReply) && (
            <div>
              {/* Separador + contador */}
              {replies.length > 0 && (
                <div style={{
                  display:'flex', alignItems:'center', gap:'.625rem',
                  marginBottom:'.75rem',
                  fontSize:'.72rem', fontWeight:800, textTransform:'uppercase',
                  letterSpacing:'.07em', color:'var(--text-faint)',
                }}>
                  <div style={{ flex:1, height:1, background:'var(--divider)' }} />
                  {replies.length} {replies.length === 1 ? 'respuesta' : 'respuestas'}
                  <div style={{ flex:1, height:1, background:'var(--divider)' }} />
                </div>
              )}

              {/* Cada resposta = nota dentro da nota */}
              {replies.map(r => (
                <ReplyBubble key={r.id} reply={r} isOwn={r.authorId === CURRENT_USER.id} />
              ))}

              {/* Input para adicionar nova resposta */}
              {onAddReply && (
                <div style={{
                  marginTop: replies.length > 0 ? '.375rem' : 0,
                  border:'1.5px solid var(--border)',
                  borderRadius:'var(--r-lg)',
                  background:'var(--surface)',
                  overflow:'hidden',
                }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:'.625rem', padding:'.625rem .875rem' }}>
                    <Avatar
                      name={CURRENT_USER.name} avatar={CURRENT_USER.avatar}
                      color={CURRENT_USER.color} colorFg={CURRENT_USER.colorFg} size={26}
                    />
                    <textarea
                      style={{
                        flex:1, border:'none', background:'transparent', outline:'none',
                        fontFamily:'inherit', fontSize:'.875rem', resize:'none',
                        minHeight:52, color:'var(--text)', lineHeight:1.6, paddingTop:'.1rem',
                      }}
                      placeholder="Añadir una nota…"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAddReply() }}
                    />
                  </div>
                  {replyText.trim() && (
                    <div style={{
                      padding:'.375rem .875rem .625rem',
                      display:'flex', justifyContent:'space-between', alignItems:'center',
                      borderTop:'1px solid var(--divider)',
                    }}>
                      <span style={{ fontSize:'.72rem', color:'var(--text-faint)' }}>
                        Ctrl + Enter para enviar
                      </span>
                      <button className="btn btn-primary btn-sm" onClick={handleAddReply}>
                        📝 Añadir nota
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ──────────────────────────────────── */}
        <div className="detail-footer">
          {confirmDelete ? (
            <>
              <span style={{ fontSize:'.8125rem', color:'var(--err)', flex:1 }}>
                ¿Eliminar esta nota permanentemente?
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => setConfirmDelete(false)}>
                No
              </button>
              <button
                className="btn btn-sm"
                style={{ background:'var(--err)', color:'#fff' }}
                onClick={() => { onDelete?.(note.id); onClose() }}
              >
                Sí, eliminar
              </button>
            </>
          ) : (
            <>
              {onDelete && (
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ color:'var(--err)' }}
                  onClick={() => setConfirmDelete(true)}
                >
                  🗑 Eliminar
                </button>
              )}
              <div style={{ marginLeft:'auto', display:'flex', gap:'.5rem' }}>
                {note.archived
                  ? <button className="btn btn-secondary btn-sm" onClick={() => { onUnarchive(note.id); onClose() }}>✓ Restaurar</button>
                  : <button className="btn btn-secondary btn-sm" onClick={() => { onArchive(note.id); onClose() }}>📁 Archivar</button>
                }
                <button className="btn btn-secondary btn-sm" onClick={() => { onEdit(note); onClose() }}>
                  ✏ Editar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}


/* ═══════════════════════════════════════════════════════════════
   EDIT NOTE MODAL
══════════════════════════════════════════════════════════════════ */
interface EditProps {
  isOpen:  boolean
  onClose: () => void
  note:    NoteEntry | null
  onSave:  (updated: NoteEntry) => void
}

export function EditNoteModal({ isOpen, onClose, note, onSave }: EditProps) {
  const today = new Date().toISOString().split('T')[0]
  const [type,    setType]    = useState('control')
  const [content, setContent] = useState('')
  const [vet,     setVet]     = useState('')
  const [date,    setDate]    = useState(today)
  const [contErr, setContErr] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (note && isOpen) {
      setType(note.type); setContent(note.content)
      setVet(note.vet); setDate(note.date)
      setContErr(''); setSuccess(false)
    }
  }, [note, isOpen])

  if (!note) return null

  const selType = NOTE_TYPES_EDIT.find(n => n.val === type)!

  const handleSave = () => {
    if (!content.trim()) { setContErr('El contenido no puede estar vacío'); return }
    setSuccess(true)
    setTimeout(() => {
      onSave({ ...note, type, content: content.trim(), vet: vet.trim(), date })
      showToast('📋 Nota actualizada')
      setSuccess(false); onClose()
    }, 900)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar nota"
      icon={selType.icon}
      accentBg={TYPEBG[type] ?? 'var(--primary-hl)'}
      accentFg={TYPEFG[type] ?? 'var(--primary)'}
      size="md"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="save" onClick={handleSave}>Guardar cambios</PfBtn>
        </PfFooter>
      ) : <></>}
    >
      {/* Hero */}
      <div className="modal-hero" style={{ background:`linear-gradient(135deg,${TYPEBG[type] ?? 'var(--primary-hl)'},var(--surface))` }}>
        <div className="modal-hero-icon" style={{ background: TYPEFG[type] ?? 'var(--primary)', color:'#fff', fontSize:'1.5rem' }}>
          {selType.icon}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="modal-hero-title" style={{ fontSize:'1rem' }}>
            {TYPELABEL[type] ?? 'Nota'}
          </div>
          {note.authorName && (
            <div className="modal-hero-sub">
              por {note.authorName}{note.vet ? ` · 🩺 ${note.vet}` : ''}
            </div>
          )}
        </div>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">¡Nota actualizada!</div>
        </div>
      ) : (
        <>
          {/* Tipo */}
          <div className="modal-section">Tipo de nota</div>
          <div className="note-type-grid" style={{ marginBottom:'1rem' }}>
            {NOTE_TYPES_EDIT.map(n => (
              <button key={n.val} type="button"
                className={['note-type-btn', type === n.val ? 'active' : ''].join(' ')}
                style={type === n.val ? { background:TYPEBG[n.val], borderColor:TYPEFG[n.val], color:TYPEFG[n.val] } : {}}
                onClick={() => setType(n.val)}>
                <span style={{ fontSize:'1.1rem' }}>{n.icon}</span>
                <span style={{ fontSize:'.72rem', fontWeight:700 }}>{n.label}</span>
              </button>
            ))}
          </div>

          {/* Contenido */}
          <div className="modal-section">Contenido</div>
          <div className="form-group">
            <div className={['form-input', contErr ? 'form-input--err' : ''].join(' ')} style={{ padding:0 }}>
              <textarea
                style={{ width:'100%', padding:'.625rem .875rem', border:'none', background:'transparent',
                  outline:'none', fontFamily:'inherit', fontSize:'.875rem', resize:'vertical',
                  minHeight:100, color:'var(--text)', lineHeight:1.6 }}
                value={content}
                onChange={e => { setContent(e.target.value); setContErr('') }}
                placeholder="Contenido de la nota…"
                autoFocus
              />
            </div>
            {contErr && <span className="form-hint-err">{contErr}</span>}
          </div>

          {/* Vet + fecha */}
          <div className="modal-section">Detalles</div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">Veterinario <span style={{ color:'var(--text-faint)', fontWeight:500 }}>(opcional)</span></label>
              <div className="field-icon-wrap">
                <span className="field-icon">🩺</span>
                <input className="form-input" placeholder="Dra. García · VetSalud"
                  value={vet} onChange={e => setVet(e.target.value)} />
              </div>
            </div>
            <FormDateField label="Fecha" value={date} onChange={setDate} max={today} />
          </div>
        </>
      )}
    </Modal>
  )
}
