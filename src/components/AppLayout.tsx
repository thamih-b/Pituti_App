import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'

// ── Logo SVG ─────────────────────────────────────────────
function PitutiLogo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-label="PITUTI logo">
      <defs>
        <radialGradient id="logo-grad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#9BB8E8" />
          <stop offset="100%" stopColor="#5B6C9E" />
        </radialGradient>
      </defs>
      <rect width="34" height="34" rx="10" fill="url(#logo-grad)" />
      <ellipse cx="11.5" cy="10" rx="3.5" ry="4" fill="white" opacity=".9" />
      <ellipse cx="22.5" cy="10" rx="3.5" ry="4" fill="white" opacity=".9" />
      <ellipse cx="6.5" cy="17" rx="3" ry="3.5" fill="white" opacity=".75" />
      <ellipse cx="27.5" cy="17" rx="3" ry="3.5" fill="white" opacity=".75" />
      <path d="M17 14.5c-4 0-7 2.5-7 6.5 0 3.5 3 5.5 7 5.5s7-2 7-5.5c0-4-3-6.5-7-6.5z" fill="white" />
      <circle cx="14.5" cy="19.5" r=".9" fill="#8899D0" />
      <circle cx="19.5" cy="19.5" r=".9" fill="#8899D0" />
      <path d="M15.2 22c.5.6 1.1.9 1.8.9s1.3-.3 1.8-.9" stroke="#8899D0" strokeWidth="1" strokeLinecap="round" fill="none" />
    </svg>
  )
}

// ── Nav icons ─────────────────────────────────────────────
const icons = {
  dashboard: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="2.5" /><rect x="14" y="3" width="7" height="7" rx="2.5" />
      <rect x="14" y="14" width="7" height="7" rx="2.5" /><rect x="3" y="14" width="7" height="7" rx="2.5" />
    </svg>
  ),
  pets: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <ellipse cx="9" cy="7" rx="2.2" ry="2.8" /><ellipse cx="15" cy="7" rx="2.2" ry="2.8" />
      <ellipse cx="5" cy="13" rx="1.8" ry="2.3" /><ellipse cx="19" cy="13" rx="1.8" ry="2.3" />
      <path d="M12 11c-3.5 0-6 2.2-6 5.5 0 2.8 2.5 4.5 6 4.5s6-1.7 6-4.5c0-3.3-2.5-5.5-6-5.5z" />
    </svg>
  ),
  health: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  cares: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  vaccines: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2 6 14" /><path d="m2 22 4-4" /><path d="m7 17 10-10" />
      <path d="M8 9.5 14.5 16" /><path d="m16.5 6-9 9" /><circle cx="19" cy="5" r="2.5" />
    </svg>
  ),
  medications: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.5 20.5-7-7a5 5 0 1 1 7.07-7.07l7 7a5 5 0 0 1-7.07 7.07z" />
      <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
    </svg>
  ),
  symptoms: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  ),
  notes: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  settings: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  chevron: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" id="collapse-icon">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  ),
  bell: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  sun: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  moon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  search: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  ),
}

// ── NavItem ───────────────────────────────────────────────
interface NavItemProps {
  to: string
  icon: React.ReactNode
  label: string
  badge?: string
  collapsed: boolean
}

function NavItem({ to, icon, label, badge, collapsed }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => ['nav-item', isActive ? 'active' : ''].join(' ')}
      title={collapsed ? label : undefined}
    >
      {icon}
      <span className="nav-label">{label}</span>
      {badge && <span className="nav-badge">{badge}</span>}
    </NavLink>
  )
}

// ── Toast ─────────────────────────────────────────────────
interface ToastState { show: boolean; message: string; type?: 'success' | 'err' }

// Global toast trigger — components can import and call this
let _setToast: ((s: ToastState) => void) | null = null
export function showToast(message: string, type: 'success' | 'err' = 'success') {
  _setToast?.({ show: true, message, type })
  setTimeout(() => _setToast?.({ show: false, message: '', type: 'success' }), 3200)
}

// ── AppLayout ─────────────────────────────────────────────
export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [toast, setToast] = useState<ToastState>({ show: false, message: '' })
  const navigate = useNavigate()

  // Register global toast setter
  useEffect(() => { _setToast = setToast; return () => { _setToast = null } }, [])

  // Apply theme
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme) }, [theme])

  return (
    <div className={['app', collapsed ? 'sidebar-collapsed' : ''].join(' ')}>

      {/* ── Topbar ── */}
      <header className="topbar">
        <div className="topbar-logo">
          <PitutiLogo />
          <span>Pituti</span>
        </div>

        <div className="topbar-search">
          {icons.search}
          <input placeholder="Buscar mascota, registro..." />
          <span style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.4)', background: 'rgba(255,255,255,.1)', padding: '.1rem .35rem', borderRadius: '.25rem' }}>⌘K</span>
        </div>

        <div className="topbar-actions">
          <button className="topbar-icon-btn notif-dot" title="Notificaciones" onClick={() => showToast('Sin notificaciones nuevas', 'success')}>
            {icons.bell}
          </button>
          <button className="topbar-icon-btn" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} title="Cambiar tema">
            {theme === 'light' ? icons.moon : icons.sun}
          </button>
          <div className="topbar-avatar" title="Thamires Lopes" onClick={() => navigate('/settings')}>TL</div>
        </div>
      </header>

      {/* ── Sidebar ── */}
      <nav className="sidebar">
        <div className="sidebar-section-label">Principal</div>
        <NavItem to="/dashboard"   icon={icons.dashboard}   label="Dashboard"     collapsed={collapsed} />
        <NavItem to="/pets"        icon={icons.pets}        label="Mis Mascotas"  badge="3" collapsed={collapsed} />
        <NavItem to="/cares"       icon={icons.cares}       label="Cuidados"      collapsed={collapsed} />

        <div className="sidebar-divider" />
        <div className="sidebar-section-label">Salud</div>
        <NavItem to="/vaccines"    icon={icons.vaccines}    label="Vacunas"       collapsed={collapsed} />
        <NavItem to="/medications" icon={icons.medications} label="Medicamentos"  collapsed={collapsed} />
        <NavItem to="/symptoms"    icon={icons.symptoms}    label="Síntomas"      collapsed={collapsed} />
        <NavItem to="/notes"       icon={icons.notes}       label="Notas"         collapsed={collapsed} />

        <div className="sidebar-divider" />
        <div className="sidebar-section-label">Cuenta</div>
        <NavItem to="/settings"    icon={icons.settings}    label="Ajustes"       collapsed={collapsed} />

        {/* Collapse toggle */}
        <div className="sidebar-toggle">
          <button
            className="nav-item"
            style={{ width: '100%' }}
            onClick={() => setCollapsed(c => !c)}
            title="Colapsar menú"
          >
            <span style={{ transform: collapsed ? 'rotate(180deg)' : undefined, transition: 'transform 200ms', display: 'flex' }}>
              {icons.chevron}
            </span>
            <span className="nav-label">Colapsar</span>
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="main" id="main-content">
        <Outlet />
      </main>

      {/* ── Toast ── */}
      <div className={['toast', toast.show ? 'show' : ''].join(' ')}>
        <div className="toast-icon" style={{ background: toast.type === 'err' ? 'var(--err-hl)' : 'var(--success-hl)', color: toast.type === 'err' ? 'var(--err)' : 'var(--success)' }}>
          {toast.type === 'err' ? '✕' : '✓'}
        </div>
        <div>
          <div style={{ fontWeight: 500, color: 'var(--text)', fontSize: '.875rem' }}>{toast.message}</div>
        </div>
        <button
          style={{ marginLeft: '.5rem', width: 32, height: 32, borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
          onClick={() => setToast(t => ({ ...t, show: false }))}
        >✕</button>
      </div>

    </div>
  )
}
