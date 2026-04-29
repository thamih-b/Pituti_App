import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Notification {
  id:      string
  type:    'vaccine' | 'medication' | 'symptom' | 'care' | 'system'
  title:   string
  body:    string
  time:    string
  read:    boolean
  to?:     string
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id:'n1', type:'vaccine',    title:'Vacuna vencida — Luna',       body:'Rabia canina venció el 10 mar. Registra la nueva fecha.',       time:'Hoy 09:14',   read:false, to:'/vaccines'    },
  { id:'n2', type:'symptom',    title:'Síntoma activo — Toby',       body:'Tos sin fiebre lleva 7 días sin resolución.',                   time:'Hoy 08:00',   read:false, to:'/symptoms'    },
  { id:'n3', type:'medication', title:'Próxima dosis — Toby',        body:'Pipeta antipulgas: dosis en 5 días (30 abr).',                  time:'Ayer 18:30',  read:false, to:'/medications' },
  { id:'n4', type:'care',       title:'Cuidados pendientes',         body:'Toby tiene 2 cuidados urgentes sin completar hoy.',             time:'Ayer 12:00',  read:true,  to:'/cares'       },
  { id:'n5', type:'vaccine',    title:'Recordatorio — Toby',         body:'Antirrábica programada para el 5 jun. Confirma la cita.',       time:'Hace 2 días', read:true,  to:'/vaccines'    },
  { id:'n6', type:'system',     title:'Invitación aceptada',         body:'Ana Martínez se unió como cuidadora de Luna.',                  time:'Hace 3 días', read:true                     },
]

const TYPE_ICON: Record<string, string> = {
  vaccine:    '💉',
  medication: '💊',
  symptom:    '🌡️',
  care:       '🐾',
  system:     '✉️',
}
const TYPE_COLOR: Record<string, string> = {
  vaccine:    'var(--blue)',
  medication: 'var(--warn)',
  symptom:    'var(--err)',
  care:       'var(--success)',
  system:     'var(--primary)',
}
const TYPE_BG: Record<string, string> = {
  vaccine:    'var(--blue-hl)',
  medication: 'var(--warn-hl)',
  symptom:    'var(--err-hl)',
  care:       'var(--success-hl)',
  system:     'var(--primary-hl)',
}

export default function NotificationsPanel() {
  const [open,       setOpen]       = useState(false)
  const [notifs,     setNotifs]     = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const panelRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const unread = notifs.filter(n => !n.read).length

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })))
  const markRead    = (id: string) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x))
  const dismiss     = (id: string) => setNotifs(n => n.filter(x => x.id !== id))

  const handleClick = (notif: Notification) => {
    markRead(notif.id)
    if (notif.to) { navigate(notif.to); setOpen(false) }
  }

  return (
    <div ref={panelRef} style={{ position: 'relative', display: 'flex' }}>
      {/* Bell button */}
      <button
        className="topbar-icon-btn"
        title="Notificaciones"
        aria-label={`Notificaciones${unread > 0 ? ` · ${unread} sin leer` : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        style={{ position: 'relative' }}
      >
        {/* Bell SVG */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {/* Unread badge */}
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 2, right: 2,
            width: 16, height: 16, borderRadius: '50%',
            background: 'var(--err)', color: '#fff',
            fontSize: '.6rem', fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--nav-bg)',
            lineHeight: 1,
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          zIndex: 500,
          width: 340,
          background: 'var(--surface)',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--r-xl)',
          boxShadow: '0 8px 32px rgba(44,52,98,.18), 0 24px 60px rgba(44,52,98,.14)',
          animation: 'pm-rise 180ms cubic-bezier(.16,1,.3,1) both',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '.875rem 1rem .75rem',
            borderBottom: '1.5px solid var(--divider)',
            background: 'var(--surface-2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '.9375rem', color: 'var(--text)' }}>Notificaciones</span>
              {unread > 0 && (
                <span style={{ background: 'var(--err)', color: '#fff', fontSize: '.65rem', fontWeight: 800, borderRadius: 'var(--r-full)', padding: '.15rem .45rem' }}>
                  {unread} nuevas
                </span>
              )}
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} style={{ fontSize: '.75rem', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' }}>
                Marcar todo leído
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {notifs.length === 0 ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-faint)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>🔔</div>
                <div style={{ fontSize: '.875rem', fontWeight: 600 }}>Sin notificaciones nuevas</div>
              </div>
            ) : notifs.map(n => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                style={{
                  display: 'flex', gap: '.75rem', padding: '.75rem 1rem',
                  borderBottom: '1px solid var(--divider)',
                  background: n.read ? 'transparent' : 'var(--primary-hl)',
                  cursor: n.to ? 'pointer' : 'default',
                  transition: 'background var(--trans)',
                  position: 'relative',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-offset)')}
                onMouseLeave={e => (e.currentTarget.style.background = n.read ? 'transparent' : 'var(--primary-hl)')}
              >
                {/* Unread dot */}
                {!n.read && (
                  <div style={{ position: 'absolute', left: '.375rem', top: '50%', marginTop: -4, width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }}/>
                )}

                {/* Icon */}
                <div style={{ width: 36, height: 36, borderRadius: 'var(--r-md)', background: TYPE_BG[n.type], color: TYPE_COLOR[n.type], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>
                  {TYPE_ICON[n.type]}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: n.read ? 600 : 800, fontSize: '.8125rem', color: 'var(--text)', marginBottom: '.15rem' }}>{n.title}</div>
                  <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{n.body}</div>
                  <div style={{ fontSize: '.65rem', color: 'var(--text-faint)', marginTop: '.25rem', fontWeight: 600 }}>{n.time}</div>
                </div>

                {/* Dismiss */}
                <button
                  onClick={e => { e.stopPropagation(); dismiss(n.id) }}
                  style={{ width: 24, height: 24, borderRadius: 'var(--r-sm)', background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '.7rem', alignSelf: 'flex-start', marginTop: '.1rem' }}
                  title="Descartar"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          {notifs.length > 0 && (
            <div style={{ padding: '.625rem 1rem', borderTop: '1.5px solid var(--divider)', background: 'var(--surface-2)', textAlign: 'center' }}>
              <button onClick={() => setOpen(false)} style={{ fontSize: '.75rem', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' }}>
                Cerrar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}