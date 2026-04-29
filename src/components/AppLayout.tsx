import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { usePituti } from '../context/PitutiContext'
import CalicoAnimation from './CalicoAnimation'
import NotificationsPanel from './NotificationPanel'
// catAnim.css must be imported in main.tsx: import './styles/catAnim.css'

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function PitutiLogo() {
  return (
    <div style={{ width: 34, height: 34, borderRadius: 10, overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,.18)' }}>
      <img src="logo-cat.jpg" alt="Pituti" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
    </div>
  )
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const icons = {
  dashboard: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="2.5"/><rect x="14" y="3" width="7" height="7" rx="2.5"/>
      <rect x="14" y="14" width="7" height="7" rx="2.5"/><rect x="3" y="14" width="7" height="7" rx="2.5"/>
    </svg>
  ),
  pets: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <ellipse cx="9" cy="7" rx="2.2" ry="2.8"/><ellipse cx="15" cy="7" rx="2.2" ry="2.8"/>
      <ellipse cx="5" cy="13" rx="1.8" ry="2.3"/><ellipse cx="19" cy="13" rx="1.8" ry="2.3"/>
      <path d="M12 11c-3.5 0-6 2.2-6 5.5 0 2.8 2.5 4.5 6 4.5s6-1.7 6-4.5c0-3.3-2.5-5.5-6-5.5z"/>
    </svg>
  ),
  cares: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  vaccines: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2 6 14"/><path d="m2 22 4-4"/><path d="m7 17 10-10"/>
      <path d="M8 9.5 14.5 16"/><path d="m16.5 6-9 9"/><circle cx="19" cy="5" r="2.5"/>
    </svg>
  ),
  medications: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.5 20.5-7-7a5 5 0 1 1 7.07-7.07l7 7a5 5 0 0 1-7.07 7.07z"/>
      <line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/>
    </svg>
  ),
  symptoms: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
    </svg>
  ),
  notes: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  calendar: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  settings: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  chevron: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6"/>
    </svg>
  ),
  sun: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  ),
  moon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  search: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  menu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  closeX: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  ),
  vet: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
    </svg>
  ),
}

// ─── NAV COMPONENTS ───────────────────────────────────────────────────────────
interface NavItemProps {
  to:        string
  icon:      React.ReactNode
  label:     string
  badge?:    string
  collapsed: boolean
  onClick?:  () => void
}

function NavItem({ to, icon, label, badge, collapsed, onClick }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => ['nav-item', isActive ? 'active' : ''].join(' ')}
      title={collapsed ? label : undefined}
      onClick={onClick}
    >
      {icon}
      <span className="nav-label">{label}</span>
      {badge && <span className="nav-badge">{badge}</span>}
    </NavLink>
  )
}

function MobileNavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => ['mobile-nav-item', isActive ? 'active' : ''].join(' ')}
    >
      <span className="mobile-nav-icon">{icon}</span>
      <span className="mobile-nav-label">{label}</span>
    </NavLink>
  )
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
interface ToastState {
  show:    boolean
  message: string
  type?:   'success' | 'err'
}

let _setToast: ((s: ToastState) => void) | null = null

export function showToast(message: string, type: 'success' | 'err' = 'success') {
  _setToast?.({ show: true, message, type })
  setTimeout(() => _setToast?.({ show: false, message, type: 'success' }), 3200)
}

// ─── APP LAYOUT ───────────────────────────────────────────────────────────────
export default function AppLayout() {
  const [collapsed,  setCollapsed]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const { state, toggleTheme } = usePituti()
  const theme = state.theme

  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' })

  useEffect(() => {
    _setToast = setToast
    return () => { _setToast = null }
  }, [setToast])

  const closeMobile = () => setMobileOpen(false)

  return (
    <div className={['app', collapsed ? 'sidebar-collapsed' : ''].join(' ')}>

      {/* ── TOPBAR ── */}
      <header className="topbar">
        <button className="mobile-menu-btn" aria-label="Abrir menú" onClick={() => setMobileOpen(o => !o)}>
          {mobileOpen ? icons.closeX : icons.menu}
        </button>

        <div className="topbar-logo" onClick={() => navigate('dashboard')} style={{ cursor: 'pointer' }}>
          <PitutiLogo />
          <div className="pituti-anim-wrap">
            {'Pituti'.split('').map((char, i) => (
              <span key={i} style={{ '--i': i } as React.CSSProperties}>{char}</span>
            ))}
          </div>
          <CalicoAnimation />
        </div>

        <div className="topbar-search">
          {icons.search}
          <input placeholder="Buscar mascota, registro..." aria-label="Buscar" />
          <span style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.4)', background: 'rgba(255,255,255,.1)', padding: '.1rem .35rem', borderRadius: '.25rem' }}>K</span>
        </div>

        <div className="topbar-actions">
          <NotificationsPanel />
          <button className="topbar-icon-btn" onClick={toggleTheme} title="Cambiar tema">
            {theme === 'light' ? icons.moon : icons.sun}
          </button>
        </div>

        <div className="topbar-avatar" title="Thamires Lopes" onClick={() => navigate('settings')} role="button" tabIndex={0}>TL</div>
      </header>

      {mobileOpen && (
        <div className="mobile-sidebar-backdrop" onClick={closeMobile} aria-hidden="true" />
      )}

      {/* ── SIDEBAR ── */}
      <nav className={['sidebar', mobileOpen ? 'mobile-open' : ''].join(' ')} aria-label="Navegación principal">

        <div className="sidebar-mobile-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <PitutiLogo />
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.125rem', color: 'var(--nav-text-active)' }}>Pituti</span>
          </div>
          <button className="sidebar-mobile-close" onClick={closeMobile} aria-label="Cerrar menú">{icons.closeX}</button>
        </div>

        <div className="sidebar-section-label">Principal</div>
        <NavItem to="dashboard" icon={icons.dashboard} label="Dashboard"    collapsed={collapsed} />
        <NavItem to="pets"      icon={icons.pets}      label="Mis Mascotas" collapsed={collapsed} badge="3" />
        <NavItem to="cares"     icon={icons.cares}     label="Cuidados"     collapsed={collapsed} />
        <NavItem to="calendar"  icon={icons.calendar}  label="Calendario"   collapsed={collapsed} />

        <div className="sidebar-divider" />

        <div className="sidebar-section-label">Salud</div>
        <NavItem to="vaccines"    icon={icons.vaccines}    label="Vacunas"      collapsed={collapsed} />
        <NavItem to="medications" icon={icons.medications} label="Medicamentos" collapsed={collapsed} />
        <NavItem to="symptoms"    icon={icons.symptoms}    label="Síntomas"     collapsed={collapsed} />
        <NavItem to="notes"       icon={icons.notes}       label="Notas"        collapsed={collapsed} />
        <NavItem to="vet"         icon={icons.vet}         label="Veterinaria"  collapsed={collapsed} />

        <div className="sidebar-divider" />

        <div className="sidebar-section-label">Cuenta</div>
        <NavItem to="settings" icon={icons.settings} label="Ajustes" collapsed={collapsed} />

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

      {/* ── Mobile Bottom Nav ── */}
      <nav className="mobile-bottom-nav" aria-label="Navegación móvil">
        <MobileNavItem to="dashboard" icon={icons.dashboard} label="Inicio"      />
        <MobileNavItem to="pets"      icon={icons.pets}      label="Mascotas"    />
        <MobileNavItem to="cares"     icon={icons.cares}     label="Cuidados"    />
        <MobileNavItem to="vet"       icon={icons.vet}       label="Veterinaria" />
        <MobileNavItem to="calendar"  icon={icons.calendar}  label="Calendario"  />
        <MobileNavItem to="settings"  icon={icons.settings}  label="Ajustes"     />
      </nav>

      {/* ── MAIN ── */}
      <main className="main" id="main-content">
        <Outlet />
      </main>

      {/* ── TOAST ── */}
      <div className={['toast', toast.show ? 'show' : ''].join(' ')} role="alert" aria-live="polite">
        <div
          className="toast-icon"
          style={{
            background: toast.type === 'err' ? 'var(--err-hl)'  : 'var(--success-hl)',
            color:      toast.type === 'err' ? 'var(--err)'     : 'var(--success)',
          }}
        >
          {toast.type === 'err' ? '✕' : '✓'}
        </div>
        <div style={{ fontWeight: 500, color: 'var(--text)', fontSize: '.875rem' }}>
          {toast.message}
        </div>
        <button
          style={{
            marginLeft: '.5rem', width: 32, height: 32, borderRadius: 'var(--r-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', border: 'none', background: 'none', cursor: 'pointer',
          }}
          onClick={() => setToast(t => ({ ...t, show: false }))}
        >
          {icons.closeX}
        </button>
      </div>

    </div>
  )
}