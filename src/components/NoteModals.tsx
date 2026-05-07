// traduzido e sem mock
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from './Modal'
import { showToast } from './AppLayout'
import FormDateField from './FormDateField'
import { PfBtn, PfFooter } from './FooterButtons'
import { useUser } from '../context/UserContext'
import { usePetsContext } from '../context/PetsContext'
import { SPECIES_EMOJI } from '../hooks/usePets'

/* ═══════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════════ */
export interface NoteReply {
  id:            string
  authorId:      string
  authorName:    string
  authorAvatar:  string
  authorColor:   string
  authorColorFg: string
  content:       string
  date:          string
}

export interface NoteEntry {
  id:       string
  petId:    string
  content:  string
  vet:      string
  date:     string
  type:     string
  archived: boolean
  authorId?:     string
  authorName?:   string
  authorAvatar?: string
  authorColor?:  string
  authorColorFg?:string
  replies?: NoteReply[]
}

/* ═══════════════════════════════════════════════════════════════
   CONSTANTES — sem labels hardcoded, usadas só para cores/ícones
══════════════════════════════════════════════════════════════════ */
const TYPEICON: Record<string, string> = {
  control:'🩺', observacion:'👁', emergencia:'🚨',
  vacuna:'💉', cirugia:'🔬', otro:'📋',
}
const TYPEBG: Record<string, string> = {
  control:'var(--blue-hl)', observacion:'var(--primary-hl)', emergencia:'var(--err-hl)',
  vacuna:'var(--success-hl)', cirugia:'var(--warn-hl)', otro:'var(--surface-offset)',
}
const TYPEFG: Record<string, string> = {
  control:'var(--blue)', observacion:'var(--primary)', emergencia:'var(--err)',
  vacuna:'var(--success)', cirugia:'var(--warn)', otro:'var(--text-muted)',
}

// NOTE_TYPES_EDIT sem labels — gerados via t() dentro dos componentes
const NOTE_TYPE_KEYS = ['control','observacion','emergencia','vacuna','cirugia','otro'] as const
type NoteTypeKey = typeof NOTE_TYPE_KEYS[number]

/* ═══════════════════════════════════════════════════════════════
   AVATAR INLINE
══════════════════════════════════════════════════════════════════ */
function Avatar({ name, avatar, color, colorFg, size = 28 }: {
  name: string; avatar: string; color: string; colorFg: string; size?: number
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
   REPLY BUBBLE
══════════════════════════════════════════════════════════════════ */
function ReplyBubble({ reply, isOwn }: { reply: NoteReply; isOwn: boolean }) {
  const { t, i18n } = useTranslation()
  const dateStr = new Date(reply.date + 'T12:00:00').toLocaleDateString(i18n.language, {
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
      <div style={{ display:'flex', alignItems:'center', gap:'.5rem', marginBottom:'.4rem' }}>
        <Avatar
          name={reply.authorName} avatar={reply.authorAvatar}
          color={reply.authorColor} colorFg={reply.authorColorFg} size={24}
        />
        <span style={{ fontWeight:800, fontSize:'.8125rem', color:reply.authorColorFg }}>
          {reply.authorName}
        </span>
        {isOwn && (
          <span className="badge badge-blue" style={{ fontSize:'.6rem', padding:'.1rem .35rem' }}>
            {t('notes.replyYou')}
          </span>
        )}
        <span style={{ marginLeft:'auto', fontSize:'.72rem', color:'var(--text-faint)' }}>
          {dateStr}
        </span>
      </div>
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
  const { t, i18n } = useTranslation()
  const { user } = useUser()
  const { pets } = usePetsContext()

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    if (!note) { setConfirmDelete(false); setReplyText('') }
  }, [note])

  if (!note) return null

  // Derivado de contextos reais — sem PETMETA mock
  const petMatch = pets.find(p => p.id === note.petId)
  const pm = {
    emoji: SPECIES_EMOJI[petMatch?.species ?? ''] ?? '🐾',
    name:  petMatch?.name ?? t('pets.noPets'),
  }

  const fg  = TYPEFG[note.type]   ?? 'var(--text-muted)'
  const bg  = TYPEBG[note.type]   ?? 'var(--surface-offset)'
  const ic  = TYPEICON[note.type] ?? '📋'
  const lbl = t(`notes.typeOptions.${note.type}` as never, { defaultValue: note.type })

  const replies = note.replies ?? []
  const dateStr = new Date(note.date + 'T12:00:00').toLocaleDateString(i18n.language, {
    day:'2-digit', month:'short', year:'numeric',
  })

  // CURRENT_USER derivado do contexto real — sem mock
  const currentUser = {
    id:       user.email,
    name:     user.name || '?',
    avatar:   user.avatar,
    color:    user.color,
    colorFg:  user.colorFg,
  }

  const handleAddReply = () => {
    if (!replyText.trim() || !onAddReply) return
    const reply: NoteReply = {
      id:            `reply-${Date.now()}`,
      authorId:      currentUser.id,
      authorName:    currentUser.name,
      authorAvatar:  currentUser.avatar,
      authorColor:   currentUser.color,
      authorColorFg: currentUser.colorFg,
      content:       replyText.trim(),
      date:          new Date().toISOString().split('T')[0],
    }
    onAddReply(note.id, reply)
    setReplyText('')
    showToast(t('notes.replyAdded'))
  }

  const replyCount = replies.length
  const replyLabel = replyCount === 1
    ? t('notes.replySingular')
    : t('notes.replyPlural', { count: replyCount })

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-sheet" style={{ maxWidth:460 }} onClick={e => e.stopPropagation()}>

        {/* Header */}
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

        {/* Body */}
        <div className="detail-body" style={{ display:'flex', flexDirection:'column', gap:'.875rem' }}>

          <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
            <span className="status-pill ok">{lbl}</span>
            {note.archived && (
              <span className="badge badge-gray">{t('notes.archivedBadge')}</span>
            )}
          </div>

          {note.authorName && (
            <div style={{ display:'flex', alignItems:'center', gap:'.5rem' }}>
              <Avatar
                name={note.authorName}
                avatar={note.authorAvatar ?? note.authorName.slice(0,2).toUpperCase()}
                color={note.authorColor   ?? 'var(--primary-hl)'}
                colorFg={note.authorColorFg ?? 'var(--primary)'}
                size={26}
              />
              <span style={{ fontSize:'.8125rem', color:'var(--text-muted)' }}>
                {t('notes.addedBy')}{' '}
                <strong style={{ color:'var(--text)' }}>{note.authorName}</strong>
              </span>
              {note.vet && (
                <span style={{ fontSize:'.8125rem', color:'var(--text-faint)' }}>
                  · 🩺 {note.vet}
                </span>
              )}
            </div>
          )}

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

          {(replies.length > 0 || onAddReply) && (
            <div>
              {replies.length > 0 && (
                <div style={{
                  display:'flex', alignItems:'center', gap:'.625rem', marginBottom:'.75rem',
                  fontSize:'.72rem', fontWeight:800, textTransform:'uppercase',
                  letterSpacing:'.07em', color:'var(--text-faint)',
                }}>
                  <div style={{ flex:1, height:1, background:'var(--divider)' }} />
                  {replyCount} {replyLabel}
                  <div style={{ flex:1, height:1, background:'var(--divider)' }} />
                </div>
              )}

              {replies.map(r => (
                <ReplyBubble key={r.id} reply={r} isOwn={r.authorId === currentUser.id} />
              ))}

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
                      name={currentUser.name} avatar={currentUser.avatar}
                      color={currentUser.color} colorFg={currentUser.colorFg} size={26}
                    />
                    <textarea
                      style={{
                        flex:1, border:'none', background:'transparent', outline:'none',
                        fontFamily:'inherit', fontSize:'.875rem', resize:'none',
                        minHeight:52, color:'var(--text)', lineHeight:1.6, paddingTop:'.1rem',
                      }}
                      placeholder={t('notes.replyPlaceholder')}
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
                        {t('notes.replyHint')}
                      </span>
                      <button className="btn btn-primary btn-sm" onClick={handleAddReply}>
                        {t('notes.replyBtn')}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="detail-footer">
          {confirmDelete ? (
            <>
              <span style={{ fontSize:'.8125rem', color:'var(--err)', flex:1 }}>
                {t('notes.deleteConfirm')}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => setConfirmDelete(false)}>
                {t('btn.no')}
              </button>
              <button
                className="btn btn-sm"
                style={{ background:'var(--err)', color:'#fff' }}
                onClick={() => { onDelete?.(note.id); onClose() }}
              >
                {t('notes.deleteConfirmYes')}
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
                  {t('btn.delete')}
                </button>
              )}
              <div style={{ marginLeft:'auto', display:'flex', gap:'.5rem' }}>
                {note.archived
                  ? <button className="btn btn-secondary btn-sm" onClick={() => { onUnarchive(note.id); onClose() }}>
                      {t('btn.unarchive')}
                    </button>
                  : <button className="btn btn-secondary btn-sm" onClick={() => { onArchive(note.id); onClose() }}>
                      {t('btn.archive')}
                    </button>
                }
                <button className="btn btn-secondary btn-sm" onClick={() => { onEdit(note); onClose() }}>
                  {t('btn.edit')}
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
  const { t, i18n } = useTranslation()
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
      setVet(note.vet);   setDate(note.date)
      setContErr('');     setSuccess(false)
    }
  }, [note, isOpen])

  if (!note) return null

  // Labels gerados via t() — sem TYPELABEL hardcoded
  const noteTypesEdit = NOTE_TYPE_KEYS.map(key => ({
    val:   key,
    icon:  TYPEICON[key],
    label: t(`notes.typeOptions.${key}` as never),
  }))

  const selType = noteTypesEdit.find(n => n.val === type) ?? noteTypesEdit[0]

  const handleSave = () => {
    if (!content.trim()) { setContErr(t('notes.errContent')); return }
    setSuccess(true)
    setTimeout(() => {
      onSave({ ...note, type, content: content.trim(), vet: vet.trim(), date })
      showToast(t('pet.notes.toastUpdated'))
      setSuccess(false); onClose()
    }, 900)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('notes.editTitle')}
      icon={selType.icon}
      accentBg={TYPEBG[type] ?? 'var(--primary-hl)'}
      accentFg={TYPEFG[type] ?? 'var(--primary)'}
      size="md"
      footer={!success ? (
        <PfFooter>
          <PfBtn variant="save" onClick={handleSave}>{t('btn.saveChanges')}</PfBtn>
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
            {selType.label}
          </div>
          {note.authorName && (
            <div className="modal-hero-sub">
              {t('notes.editBy', { name: note.authorName })}{note.vet ? ` · 🩺 ${note.vet}` : ''}
            </div>
          )}
        </div>
      </div>

      {success ? (
        <div className="modal-success">
          <div className="modal-success-icon">✓</div>
          <div className="modal-success-title">{t('notes.editSuccess')}</div>
        </div>
      ) : (
        <>
          {/* Tipo */}
          <div className="modal-section">{t('notes.type')}</div>
          <div className="note-type-grid" style={{ marginBottom:'1rem' }}>
            {noteTypesEdit.map(n => (
              <button key={n.val} type="button"
                className={['note-type-btn', type === n.val ? 'active' : ''].join(' ')}
                style={type === n.val ? { background:TYPEBG[n.val], borderColor:TYPEFG[n.val], color:TYPEFG[n.val] } : {}}
                onClick={() => setType(n.val)}
              >
                <span style={{ fontSize:'1.1rem' }}>{n.icon}</span>
                <span style={{ fontSize:'.72rem', fontWeight:700 }}>{n.label}</span>
              </button>
            ))}
          </div>

          {/* Conteúdo */}
          <div className="modal-section">{t('notes.content')}</div>
          <div className="form-group">
            <div className={['form-input', contErr ? 'form-input--err' : ''].join(' ')} style={{ padding:0 }}>
              <textarea
                style={{ width:'100%', padding:'.625rem .875rem', border:'none', background:'transparent',
                  outline:'none', fontFamily:'inherit', fontSize:'.875rem', resize:'vertical',
                  minHeight:100, color:'var(--text)', lineHeight:1.6 }}
                value={content}
                onChange={e => { setContent(e.target.value); setContErr('') }}
                placeholder={t('notes.addHint')}
                autoFocus
              />
            </div>
            {contErr && <span className="form-hint-err">{contErr}</span>}
          </div>

          {/* Vet + data */}
          <div className="modal-section">{t('vet.appointments.sectionDetails')}</div>
          <div className="form-row">
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label">
                {t('field.vet')}{' '}
                <span style={{ color:'var(--text-faint)', fontWeight:500 }}>({t('btn.optional')})</span>
              </label>
              <div className="field-icon-wrap">
                <span className="field-icon">🩺</span>
                <input
                  className="form-input"
                  placeholder={t('vet.appointments.vetNamePh')}
                  value={vet}
                  onChange={e => setVet(e.target.value)}
                />
              </div>
            </div>
            <FormDateField label={t('field.date')} value={date} onChange={setDate} max={today} />
          </div>
        </>
      )}
    </Modal>
  )
}