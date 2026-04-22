import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { usePituti } from '../context/PitutiContext'

// ── Logo SVG ─────────────────────────────────────────────
function PitutiLogo() {
  return (
    <div style={{
      width: 34, height: 34,
      borderRadius: 10,
      overflow: 'hidden',
      flexShrink: 0,
      boxShadow: '0 2px 8px rgba(0,0,0,.18)',
    }}>
      <img
        src="/logo-cat.jpg"
        alt="Pituti logo"
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
      />
    </div>
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
  
  calendar: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
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

let _setToast: ((s: ToastState) => void) | null = null

export function showToast(message: string, type: 'success' | 'err' = 'success') {
  _setToast?.({ show: true, message, type })
  setTimeout(() => _setToast?.({ show: false, message: '', type: 'success' }), 3200)
}

// ── AppLayout ─────────────────────────────────────────────

const ANIM_CSS = `
.pituti-anim-wrap { display:flex; font-style:italic; }
.pituti-anim-wrap span {
  display:inline-block; opacity:0;
  animation: letterAppear 0.75s cubic-bezier(.16,1,.3,1) forwards;
  animation-delay: calc(var(--i,0)*220ms);
}
.sidebar-collapsed .topbar-logo .pituti-anim-wrap {
  opacity:0; transform:translateX(-8px);
  pointer-events:none; width:0; overflow:hidden;
  transition: opacity 200ms, transform 200ms, width 200ms;
}
.sidebar-collapsed .calico-cat { opacity:0!important; transition:opacity 200ms; }
@keyframes letterAppear {
  from { opacity:0; transform:translateX(-8px) translateY(3px); }
  to   { opacity:1; transform:translateX(0) translateY(0); }
}

/* ── Topbar: overflow visible para gato não ser cortado ── */
.topbar { overflow: visible !important; }

/* ── Gata ── */
.calico-cat {
  position: absolute;
  left: 148px;
  top: 50%;
  margin-top: -22px;
  z-index: 10;
  pointer-events: none;
  overflow: visible;
  transform-origin: center bottom;
  animation: catJourney 5.6s cubic-bezier(.08,0,.6,1) 0.4s forwards;
}

@keyframes catJourney {
  0%    { transform: translateX(calc(50vw - 148px)); opacity:0; }
  2%    { opacity:1; }
  8%    { transform: translateX(calc(50vw*.46)) rotate(-0.5deg); }
  16%   { transform: translateX(calc(50vw*.38)) rotate(-0.5deg); }
  24%   { transform: translateX(calc(50vw*.30)) rotate(-0.5deg); }
  32%   { transform: translateX(calc(50vw*.22)) rotate(-0.5deg); }
  40%   { transform: translateX(calc(50vw*.15)) rotate(-0.5deg); }
  48%   { transform: translateX(calc(50vw*.09)) rotate(-0.5deg); }
  56%   { transform: translateX(calc(50vw*.05)) rotate(-0.4deg); }
  63%   { transform: translateX(calc(50vw*.02)) rotate(-0.3deg); }
  70%   { transform: translateX(16px)           rotate(-0.2deg); }
  76%   { transform: translateX(8px)            rotate(-0.1deg); }
  80%   { transform: translateX(4px)            rotate(0deg); }
  85%   { transform: translateX(2px) translateY(2px);  }
  90%   { transform: translateX(2px) translateY(-1px); }
  95%   { transform: translateX(2px) translateY(0px);  }
  100%  { transform: translateX(2px) translateY(0px);  opacity:1; }
}

/* ── Crossfade walk → sit (a 5.05s do load) ── */
.cat-walk {
  animation: walkFade 0.65s ease-in-out 5.05s forwards;
}
.cat-sit {
  opacity: 0;
  animation: sitFade 0.65s ease-in-out 5.05s forwards;
}
@keyframes walkFade { to { opacity:0; } }
@keyframes sitFade  { to { opacity:1; } }

/* ── Patas — steps(8) sprite-sheet ── */
.cat-leg-1,.cat-leg-2,.cat-leg-3,.cat-leg-4 {
  transform-box: fill-box;
  transform-origin: top center;
}
.cat-leg-1 { animation: legCycle 0.56s steps(8,end) 0.4s  9 forwards; }
.cat-leg-4 { animation: legCycle 0.56s steps(8,end) 0.4s  9 forwards; }
.cat-leg-2 { animation: legCycle 0.56s steps(8,end) 0.68s 9 forwards; }
.cat-leg-3 { animation: legCycle 0.56s steps(8,end) 0.68s 9 forwards; }

@keyframes legCycle {
  0%    { transform: rotate(0deg)   translateY(0px);   }
  12.5% { transform: rotate(-18deg) translateY(0px);   }
  25%   { transform: rotate(-28deg) translateY(0px);   }
  37.5% { transform: rotate(-16deg) translateY(-7px);  }
  50%   { transform: rotate(4deg)   translateY(-10px); }
  62.5% { transform: rotate(22deg)  translateY(-7px);  }
  75%   { transform: rotate(26deg)  translateY(-3px);  }
  87.5% { transform: rotate(16deg)  translateY(0px);   }
  100%  { transform: rotate(0deg)   translateY(0px);   }
}

/* ── Cauda andando — pivô na base, balança ± 8° ── */
.cat-walk-tail {
  transform-box: fill-box;
  transform-origin: 0% 100%;
  animation: tailSway 0.9s ease-in-out 0.4s 6 forwards;
}
@keyframes tailSway {
  0%    { transform: rotate(0deg);  }
  25%   { transform: rotate(8deg);  }
  75%   { transform: rotate(-8deg); }
  100%  { transform: rotate(0deg);  }
}

/* ── Cauda sentada — leve balanço satisfeito ── */
.cat-sit-tail {
  transform-box: fill-box;
  transform-origin: 30% 20%;
  animation: sitTailSway 2.2s ease-in-out 5.8s infinite;
}
@keyframes sitTailSway {
  0%,100% { transform: rotate(0deg);  }
  40%     { transform: rotate(4deg);  }
  70%     { transform: rotate(-3deg); }
}
`

function CalicoSVG() {
  return (
    <svg
      className="calico-cat"
      width="80" height="60"
      viewBox="0 0 96 72"
      fill="none"
      style={{ overflow: 'visible' }}
      aria-hidden="true"
    >

      {/* ════════════════════════════════════════
          GRUPO ANDANDO
      ════════════════════════════════════════ */}
      <g className="cat-walk">

        {/* CAUDA andando — laranja, longa, curva para trás */}
        <path className="cat-walk-tail"
          d="M66 36 C76 26 88 12 85 2"
          stroke="#E87228" strokeWidth="3.5" fill="none"
          strokeLinecap="round"/>

        {/* CORPO */}
        <path
          d="M22 26 C24 14 42 10 58 11 C70 12 76 20 76 32
             C76 42 68 46 52 46 C36 46 22 42 20 34 C19 28 20 26 22 26 Z"
          fill="white"/>
        <path
          d="M20 31 C21 18 31 11 45 12 C53 13 57 21 55 33
             C53 42 42 47 31 45 C21 43 18 37 20 31 Z"
          fill="#E87228" opacity="0.90"/>
        <path
          d="M51 11 C61 10 73 16 76 27 C78 35 73 43 63 45
             C54 46 48 39 49 30 C50 19 49 12 51 11 Z"
          fill="#1E1412" opacity="0.90"/>
        <path
          d="M22 26 C24 14 42 10 58 11 C70 12 76 20 76 32
             C76 42 68 46 52 46 C36 46 22 42 20 34 C19 28 20 26 22 26 Z"
          fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.40"/>
        <path d="M24 34 Q31 37 38 35" stroke="white" strokeWidth="1.4"
          fill="none" opacity="0.50" strokeLinecap="round"/>

        {/* PESCOÇO */}
        <path d="M20 34 C17 29 17 22 20 18 C21 16 24 15 26 18 C28 21 27 28 26 33 Z"
          fill="white"/>

        {/* CABEÇA */}
        <circle cx="12" cy="17" r="11.5" fill="white"/>
        <path d="M2 11 C4 3 12 2 16 7 C19 11 18 18 14 20 C9 22 2 19 1 14 C1 12 1 11 2 11 Z"
          fill="#E87228" opacity="0.90"/>
        <path d="M13 9 C17 5 23 8 22 14 C21 18 17 20 14 18 C11 16 11 10 13 9 Z"
          fill="#1E1412" opacity="0.90"/>
        <circle cx="12" cy="17" r="11.5" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.42"/>

        {/* ORELHAS — altas no topo da cabeça */}
        <polygon points="2,9 6,-3 13,9" fill="#E87228"/>
        <polygon points="3.5,8.5 6.5,-0.5 11,8.5" fill="#F4A888" opacity="0.75"/>
        <polygon points="2,9 6,-3 13,9" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.38"/>
        <polygon points="11,9 17,-3 23,9" fill="#1E1412"/>
        <polygon points="12.5,8.5 17,-0.5 21.5,8.5" fill="#5A2030" opacity="0.60"/>
        <polygon points="11,9 17,-3 23,9" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.32"/>

        {/* OLHOS */}
        <circle cx="8.5" cy="17" r="4.5" fill="#1A1210"/>
        <circle cx="8.5" cy="17" r="3.8" fill="#D4A820"/>
        <ellipse cx="8.5" cy="17" rx="1.4" ry="3.5" fill="#0C0808"/>
        <circle cx="9.9" cy="15.4" r="1.3" fill="white" opacity="0.92"/>
        <circle cx="17.5" cy="17" r="4.5" fill="#1A1210"/>
        <circle cx="17.5" cy="17" r="3.8" fill="#D4A820"/>
        <ellipse cx="17.5" cy="17" rx="1.4" ry="3.5" fill="#0C0808"/>
        <circle cx="18.9" cy="15.4" r="1.3" fill="white" opacity="0.92"/>

        {/* NARIZ + BOCA */}
        <path d="M11.2 20 L12 21.5 L12.8 20 Z" fill="#F0A0B8"/>
        <line x1="12" y1="21.5" x2="12" y2="22.5" stroke="#D08898" strokeWidth="0.7" strokeLinecap="round"/>
        <path d="M12 22.5 Q10.2 24 9 23.4" stroke="#B87888" strokeWidth="0.75" fill="none" strokeLinecap="round"/>
        <path d="M12 22.5 Q13.8 24 15 23.4" stroke="#B87888" strokeWidth="0.75" fill="none" strokeLinecap="round"/>

        {/* BIGODES */}
        <line x1="0.5" y1="20.5" x2="10" y2="21.5" stroke="#C8C0B8" strokeWidth="0.95"/>
        <line x1="0.5" y1="22.2" x2="10" y2="22.5" stroke="#C8C0B8" strokeWidth="0.85"/>
        <line x1="0.5" y1="23.9" x2="10" y2="23.5" stroke="#C8C0B8" strokeWidth="0.72"/>
        <line x1="14"  y1="21.5" x2="23.5" y2="20.5" stroke="#C8C0B8" strokeWidth="0.95"/>
        <line x1="14"  y1="22.5" x2="23.5" y2="22.2" stroke="#C8C0B8" strokeWidth="0.85"/>
        <line x1="14"  y1="23.5" x2="23.5" y2="23.9" stroke="#C8C0B8" strokeWidth="0.72"/>

        {/* PATAS */}
        <path d="M21 43 Q20 44 20 53 Q20 55 22 55 Q24 55 24.5 53 Q24.5 44 23.5 43 Z"
          fill="white" stroke="#1A1210" strokeWidth="0.85" className="cat-leg-1"/>
        <path d="M29 44 Q28 45 28 53 Q28 55 30 55 Q32 55 32.5 53 Q32.5 45 31.5 44 Z"
          fill="#EDE5DD" stroke="#1A1210" strokeWidth="0.85" className="cat-leg-2"/>
        <path d="M55 43 Q54 44 54 52 Q54 54 56 54 Q58 54 58.5 52 Q58.5 44 57.5 43 Z"
          fill="white" stroke="#1A1210" strokeWidth="0.85" className="cat-leg-3"/>
        <path d="M63 44 Q62 45 62 52 Q62 54 64 54 Q66 54 66.5 52 Q66.5 45 65.5 44 Z"
          fill="#1E1412" stroke="#1A1210" strokeWidth="0.85" className="cat-leg-4"/>

        {/* TOE BEANS */}
        <ellipse cx="22.2" cy="54.5" rx="2.5" ry="1.1" fill="#F0A0B8" opacity="0.70"/>
        <ellipse cx="30.2" cy="54.5" rx="2.5" ry="1.1" fill="#F0A0B8" opacity="0.58"/>
        <ellipse cx="56.2" cy="53.5" rx="2.3" ry="1.0" fill="#F0A0B8" opacity="0.52"/>
        <ellipse cx="64.2" cy="53.5" rx="2.3" ry="1.0" fill="#7A4858" opacity="0.66"/>
      </g>

      {/* ════════════════════════════════════════
          GRUPO SENTADO — deslocado 8u para baixo
          para evitar corte das orelhas no topo
      ════════════════════════════════════════ */}
      <g className="cat-sit" transform="translate(0, 8)">

        {/* Sombra */}
        <ellipse cx="22" cy="55.5" rx="18" ry="2" fill="#00000010"/>

        {/* CAUDA sentada — arco felino laranja */}
        <path className="cat-sit-tail"
          d="M32 42 C42 54 26 62 14 56 C6 51 8 42 14 38"
          stroke="#E87228" strokeWidth="3.5" fill="none"
          strokeLinecap="round"/>

        {/* CORPO SENTADO — oval upright */}
        <path
          d="M9 49 C9 33 11 21 22 19 C33 17 35 29 35 43 C35 51 29 55 22 55 C15 55 9 53 9 49 Z"
          fill="white"/>
        <path
          d="M9 46 C9 33 11 22 20 20 C28 18 32 26 31 38 C30 48 24 54 16 53 C11 52 9 50 9 46 Z"
          fill="#E87228" opacity="0.88"/>
        <path
          d="M24 19 C32 19 35 28 35 38 C35 48 30 54 24 54 C22 54 22 46 22 38 C22 28 22 19 24 19 Z"
          fill="#1E1412" opacity="0.88"/>
        <path
          d="M9 49 C9 33 11 21 22 19 C33 17 35 29 35 43 C35 51 29 55 22 55 C15 55 9 53 9 49 Z"
          fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.38"/>
        <path d="M12 40 Q18 43 24 41" stroke="white" strokeWidth="1.3"
          fill="none" opacity="0.45" strokeLinecap="round"/>

        {/* PATAS SENTADAS */}
        <ellipse cx="15" cy="53" rx="5.5" ry="3"
          fill="white" stroke="#1A1210" strokeWidth="0.8" opacity="0.80"/>
        <ellipse cx="27" cy="53" rx="5.5" ry="3"
          fill="#F0E8DF" stroke="#1A1210" strokeWidth="0.8" opacity="0.72"/>

        {/* PESCOÇO SENTADO */}
        <path d="M14 20 C12 16 12 11 15 8 C16 7 19 7 20 9 C21 11 20 16 19 20 Z"
          fill="white" opacity="0.90"/>

        {/* CABEÇA SENTADA */}
        <circle cx="17" cy="9"  r="11.5" fill="white"/>
        <path d="M7 3 C9 -4 16 -5 20 0 C23 4 22 11 18 13 C13 15 6 12 5 8 C5 6 5 4 7 3 Z"
          fill="#E87228" opacity="0.88"/>
        <path d="M18 1 C22 -2 28 1 27 7 C26 11 22 13 19 11 C16 9 16 2 18 1 Z"
          fill="#1E1412" opacity="0.88"/>
        <circle cx="17" cy="9" r="11.5"
          fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.42"/>

        {/* ORELHAS SENTADAS — altas */}
        <polygon points="7,4 11,-8 18,4" fill="#E87228"/>
        <polygon points="8.5,3.5 11.5,-5 16,3.5" fill="#F4A888" opacity="0.72"/>
        <polygon points="7,4 11,-8 18,4" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.35"/>
        <polygon points="16,4 22,-8 28,4" fill="#1E1412"/>
        <polygon points="17.5,3.5 22,-5 26.5,3.5" fill="#5A2030" opacity="0.58"/>
        <polygon points="16,4 22,-8 28,4" fill="none" stroke="#1A1210" strokeWidth="1.0" opacity="0.30"/>

        {/* OLHOS SENTADOS */}
        <circle cx="13" cy="9"  r="4.5" fill="#1A1210"/>
        <circle cx="13" cy="9"  r="3.8" fill="#D4A820"/>
        <ellipse cx="13" cy="9"  rx="1.4" ry="3.5" fill="#0C0808"/>
        <circle cx="14.4" cy="7.4" r="1.3" fill="white" opacity="0.92"/>
        <circle cx="22" cy="9"  r="4.5" fill="#1A1210"/>
        <circle cx="22" cy="9"  r="3.8" fill="#D4A820"/>
        <ellipse cx="22" cy="9"  rx="1.4" ry="3.5" fill="#0C0808"/>
        <circle cx="23.4" cy="7.4" r="1.3" fill="white" opacity="0.92"/>

        {/* NARIZ + BOCA sentado */}
        <path d="M16.2 12 L17 13.5 L17.8 12 Z" fill="#F0A0B8"/>
        <line x1="17" y1="13.5" x2="17" y2="14.5" stroke="#D08898" strokeWidth="0.7" strokeLinecap="round"/>
        <path d="M17 14.5 Q15.2 16 14 15.4" stroke="#B87888" strokeWidth="0.75" fill="none" strokeLinecap="round"/>
        <path d="M17 14.5 Q18.8 16 20 15.4" stroke="#B87888" strokeWidth="0.75" fill="none" strokeLinecap="round"/>

        {/* BIGODES sentado */}
        <line x1="5"  y1="12.5" x2="15" y2="13.5" stroke="#C8C0B8" strokeWidth="0.92"/>
        <line x1="5"  y1="14.2" x2="15" y2="14.5" stroke="#C8C0B8" strokeWidth="0.82"/>
        <line x1="5"  y1="15.9" x2="15" y2="15.5" stroke="#C8C0B8" strokeWidth="0.70"/>
        <line x1="19" y1="13.5" x2="29" y2="12.5" stroke="#C8C0B8" strokeWidth="0.92"/>
        <line x1="19" y1="14.5" x2="29" y2="14.2" stroke="#C8C0B8" strokeWidth="0.82"/>
        <line x1="19" y1="15.5" x2="29" y2="15.9" stroke="#C8C0B8" strokeWidth="0.70"/>
      </g>

    </svg>
  )
}

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const { state, toggleTheme, showToast: ctxToast } = usePituti()
  const theme = state.theme
  const [toast, setToast] = useState<ToastState>({ show: state.toastVisible, message: state.toastMessage, type: state.toastType })

  // Registrar o showToast global para compatibilidade com chamadas legadas
   useEffect(() => {
    _setToast = setToast
    return () => { _setToast = null }
  }, [])
    const hideToast = () => setToast(t => ({ ...t, show: false }))

  useEffect(() => {
    const ID = 'pituti-anim-style'
    if (!document.getElementById(ID)) {
      const el = document.createElement('style')
      el.id = ID
      el.textContent = ANIM_CSS
      document.head.appendChild(el)
    }
  }, [])

  return (
    <div className={['app', collapsed ? 'sidebar-collapsed' : ''].join(' ')}>

      {/* ── Topbar ── */}
      <header className="topbar">
        <div className="topbar-logo">
          <PitutiLogo />
          <div className="pituti-anim-wrap">
            {'Pituti'.split('').map((char, i) => (
              <span key={i} style={{ '--i': i } as React.CSSProperties}>{char}</span>
            ))}
          </div>
        </div>
        <CalicoSVG />

        <div className="topbar-search">
          {icons.search}
          <input placeholder="Buscar mascota, registro..." />
          <span style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.4)', background: 'rgba(255,255,255,.1)', padding: '.1rem .35rem', borderRadius: '.25rem' }}>⌘K</span>
        </div>

        <div className="topbar-actions">
          <button className="topbar-icon-btn notif-dot" title="Notificaciones"
            onClick={() => showToast('Sin notificaciones nuevas', 'success')}>
            {icons.bell}
          </button>
          <button className="topbar-icon-btn"
            onClick={toggleTheme}
            title="Cambiar tema">
            {theme === 'light' ? icons.moon : icons.sun}
          </button>
          <div className="topbar-avatar" title="Thamires Lopes"
            onClick={() => navigate('/settings')}>TL</div>
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
        <NavItem to="/calendar" icon={icons.calendar} label="Calendario" collapsed={collapsed} />
        <div className="sidebar-divider" />
        <div className="sidebar-section-label">Cuenta</div>
        <NavItem to="/settings"    icon={icons.settings}    label="Ajustes"       collapsed={collapsed} />

        <div className="sidebar-toggle">
          <button className="nav-item" style={{ width: '100%' }}
            onClick={() => setCollapsed((c: boolean) => !c)} title="Ocultar menú">
            <span style={{ transform: collapsed ? 'rotate(180deg)' : undefined,
              transition: 'transform 200ms', display: 'flex' }}>
              {icons.chevron}
            </span>
            <span className="nav-label">Ocultar</span>
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="main" id="main-content"><Outlet /></main>

      {/* ── Toast ── */}
      <div className={['toast', toast.show ? 'show' : ''].join(' ')}>
        <div className="toast-icon" style={{
          background: toast.type === 'err' ? 'var(--err-hl)' : 'var(--success-hl)',
          color: toast.type === 'err' ? 'var(--err)' : 'var(--success)'
        }}>
          {toast.type === 'err' ? '✕' : '✓'}
        </div>
        <div><div style={{ fontWeight: 500, color: 'var(--text)', fontSize: '.875rem' }}>{toast.message}</div></div>
        <button style={{ marginLeft: '.5rem', width: 32, height: 32,
          borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: 'var(--text-muted)' }}
          onClick={() => hideToast()}>✕</button>
      </div>

    </div>
  )
}
