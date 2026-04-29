import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Helpers ───────────────────────────────────────────────────────
function PitutiMark() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect width="52" height="52" rx="14" fill="url(#logo-grad)"/>
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="52" y2="52">
          <stop offset="0%"   stopColor="#c4b5e0"/>
          <stop offset="100%" stopColor="#8B9FD4"/>
        </linearGradient>
      </defs>
      {/* Cat head silhouette */}
      <circle cx="26" cy="30" r="14" fill="rgba(42,52,98,.85)"/>
      {/* Left ear */}
      <polygon points="14,21 18,10 24,20" fill="rgba(42,52,98,.85)"/>
      <polygon points="15.5,20.5 18.5,12 22.5,19.5" fill="rgba(196,181,224,.5)"/>
      {/* Right ear */}
      <polygon points="28,20 34,10 38,21" fill="rgba(42,52,98,.85)"/>
      <polygon points="29.5,19.5 33.5,12 36.5,20.5" fill="rgba(196,181,224,.5)"/>
      {/* Eyes */}
      <circle cx="21" cy="29" r="3" fill="#D4A820"/>
      <ellipse cx="21" cy="29" rx="1.2" ry="3" fill="#0C0808"/>
      <circle cx="22.2" cy="27.5" r="1" fill="rgba(255,255,255,.9)"/>
      <circle cx="31" cy="29" r="3" fill="#D4A820"/>
      <ellipse cx="31" cy="29" rx="1.2" ry="3" fill="#0C0808"/>
      <circle cx="32.2" cy="27.5" r="1" fill="rgba(255,255,255,.9)"/>
      {/* Nose */}
      <path d="M25 33 L26 34.5 L27 33 Z" fill="#F0A0B8"/>
      {/* Whiskers */}
      <line x1="14" y1="32" x2="22" y2="32.5" stroke="rgba(255,255,255,.5)" strokeWidth="0.8"/>
      <line x1="14" y1="34" x2="22" y2="33.5" stroke="rgba(255,255,255,.5)" strokeWidth="0.7"/>
      <line x1="30" y1="32.5" x2="38" y2="32"  stroke="rgba(255,255,255,.5)" strokeWidth="0.8"/>
      <line x1="30" y1="33.5" x2="38" y2="34"  stroke="rgba(255,255,255,.5)" strokeWidth="0.7"/>
    </svg>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.2 1.28-2.18 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/>
    </svg>
  )
}

// ── Input component ───────────────────────────────────────────────
interface FormFieldProps {
  type:        string
  label:       string
  value:       string
  onChange:    (v: string) => void
  placeholder: string
  icon:        React.ReactNode
  error?:      string
  hint?:       string
  extra?:      React.ReactNode
  disabled?:   boolean
}
function FormField({ type, label, value, onChange, placeholder, icon, error, hint, extra, disabled }: FormFieldProps) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: '.875rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'.375rem' }}>
        <label style={{ fontSize:'.8125rem', fontWeight:700, color:'var(--text-muted)' }}>{label}</label>
        {extra}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '.5rem',
        background: 'var(--surface)', border: `1.5px solid ${error ? 'var(--err)' : focused ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: 'var(--r-lg)', padding: '.625rem .875rem',
        boxShadow: focused ? '0 0 0 3px var(--primary-hl)' : error ? '0 0 0 3px var(--err-hl)' : 'none',
        transition: 'all var(--trans)',
      }}>
        <span style={{ color: error ? 'var(--err)' : focused ? 'var(--primary)' : 'var(--text-faint)', flexShrink:0 }}>{icon}</span>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={()  => setFocused(false)}
          style={{ flex:1, background:'none', border:'none', outline:'none', fontFamily:'inherit', fontSize:'.9rem', color:'var(--text)' }}
        />
      </div>
      {error && <div style={{ fontSize:'.75rem', color:'var(--err)', marginTop:'.3rem', fontWeight:600 }}>{error}</div>}
      {hint && !error && <div style={{ fontSize:'.75rem', color:'var(--text-faint)', marginTop:'.3rem' }}>{hint}</div>}
    </div>
  )
}

// ── Divider ───────────────────────────────────────────────────────
function OrDivider() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'.75rem', margin:'1.125rem 0' }}>
      <div style={{ flex:1, height:1, background:'var(--divider)' }}/>
      <span style={{ fontSize:'.75rem', fontWeight:700, color:'var(--text-faint)' }}>o continuar con</span>
      <div style={{ flex:1, height:1, background:'var(--divider)' }}/>
    </div>
  )
}

// ── Social Button ─────────────────────────────────────────────────
function SocialBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'.5rem',
        padding:'.6rem 1rem', border:`1.5px solid ${hovered?'var(--primary)':'var(--border)'}`,
        borderRadius:'var(--r-lg)', background:hovered?'var(--primary-hl)':'var(--surface)',
        cursor:'pointer', fontFamily:'inherit', fontWeight:700, fontSize:'.8125rem',
        color:'var(--text)', transition:'all var(--trans)', minHeight:44,
      }}
    >
      {icon}{label}
    </button>
  )
}

// ── Main LoginPage ────────────────────────────────────────────────
type Mode = 'login' | 'register' | 'forgot'

export default function LoginPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')

  // Form state
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [errors,   setErrors]   = useState<Record<string,string>>({})
  const [rememberMe, setRememberMe] = useState(true)

  const clearErrors = () => setErrors({})
  const reset       = () => { setEmail(''); setPassword(''); setConfirm(''); setName(''); clearErrors() }

  // Validation
  const validateLogin = () => {
    const e: Record<string,string> = {}
    if (!email.trim())        e.email    = 'El email es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email no válido'
    if (!password)            e.password = 'La contraseña es obligatoria'
    return e
  }
  const validateRegister = () => {
    const e: Record<string,string> = {}
    if (!name.trim())         e.name     = 'El nombre es obligatorio'
    if (!email.trim())        e.email    = 'El email es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email no válido'
    if (!password)            e.password = 'La contraseña es obligatoria'
    else if (password.length < 8) e.password = 'Mínimo 8 caracteres'
    if (password !== confirm) e.confirm  = 'Las contraseñas no coinciden'
    return e
  }
  const validateForgot = () => {
    const e: Record<string,string> = {}
    if (!email.trim())        e.email = 'El email es obligatorio'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email no válido'
    return e
  }

  const handleSubmit = () => {
    const errs = mode === 'login' ? validateLogin() : mode === 'register' ? validateRegister() : validateForgot()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (mode === 'forgot') { setSuccess(true); return }
      navigate('/dashboard')
    }, 1200)
  }

  const switchMode = (m: Mode) => { setMode(m); reset(); setSuccess(false) }

  const emailIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
  const nameIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
  const lockIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      background: 'var(--bg)',
    }}>

      {/* ── Left panel — branding (desktop only) ── */}
      <div className="login-brand-panel">
        <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', height:'100%' }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:'.75rem', marginBottom:'auto' }}>
            <PitutiMark/>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'1.75rem', fontStyle:'italic', color:'white', letterSpacing:'-.01em' }}>Pituti</span>
          </div>

          {/* Hero text */}
          <div style={{ marginBottom:'auto' }}>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2rem,4vw,2.75rem)', color:'white', fontWeight:400, lineHeight:1.15, marginBottom:'1rem' }}>
              Cuida a tus<br/>mascotas con<br/>amor ❤️
            </h1>
            <p style={{ fontSize:'1rem', color:'rgba(255,255,255,.72)', lineHeight:1.6, maxWidth:340 }}>
              PITUTI te ayuda a llevar el control de vacunas, medicamentos, cuidados diarios y síntomas de todos tus peludos.
            </p>
          </div>

          {/* Feature pills */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:'.5rem', marginTop:'2rem' }}>
            {['💉 Vacunas','💊 Medicamentos','🐾 Cuidados','📋 Notas vet.','📅 Calendario','👥 Comparte'].map(f=>(
              <span key={f} style={{ background:'rgba(255,255,255,.15)', color:'rgba(255,255,255,.9)', borderRadius:'var(--r-full)', padding:'.3rem .875rem', fontSize:'.8125rem', fontWeight:700, border:'1px solid rgba(255,255,255,.2)' }}>
                {f}
              </span>
            ))}
          </div>

          {/* Social proof */}
          <div style={{ marginTop:'2rem', paddingTop:'1.5rem', borderTop:'1px solid rgba(255,255,255,.15)', display:'flex', alignItems:'center', gap:'1rem' }}>
            <div style={{ display:'flex' }}>
              {['🐱','🐶','🦜','🐰','🦎'].map((e,i)=>(
                <div key={i} style={{ width:30, height:30, borderRadius:'50%', border:'2px solid rgba(255,255,255,.5)', background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.875rem', marginLeft:i>0?-8:0 }}>{e}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize:'.875rem', fontWeight:700, color:'white' }}>+2.400 mascotas</div>
              <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.6)' }}>cuidadas con amor</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div style={{
        flex:1,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        padding:'2rem 1.25rem',
        minHeight:'100dvh',
      }}>
        <div style={{ width:'100%', maxWidth:420 }}>

          {/* Mobile logo */}
          <div className="login-mobile-logo">
            <PitutiMark/>
            <span style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontStyle:'italic', color:'var(--text)' }}>Pituti</span>
          </div>

          {/* Card */}
          <div style={{ background:'var(--surface)', border:'1.5px solid var(--border)', borderRadius:'var(--r-xl)', padding:'2rem 1.75rem', boxShadow:'var(--sh-lg)' }}>

            {/* Tabs */}
            {mode !== 'forgot' && (
              <div style={{ display:'flex', background:'var(--surface-offset)', borderRadius:'var(--r-lg)', padding:'.25rem', marginBottom:'1.5rem' }}>
                {(['login','register'] as Mode[]).map(m=>(
                  <button key={m} onClick={()=>switchMode(m)}
                    style={{ flex:1, padding:'.5rem', borderRadius:'var(--r-md)', border:'none', cursor:'pointer', fontFamily:'inherit', fontWeight:700, fontSize:'.875rem', transition:'all 160ms',
                      background: mode===m ? 'var(--surface)' : 'transparent',
                      color: mode===m ? 'var(--text)' : 'var(--text-muted)',
                      boxShadow: mode===m ? 'var(--sh-sm)' : 'none',
                    }}>
                    {m === 'login' ? '🔑 Entrar' : '✨ Registrarse'}
                  </button>
                ))}
              </div>
            )}

            {/* ── Forgot password ── */}
            {mode === 'forgot' && (
              <div style={{ marginBottom:'1.25rem' }}>
                <button onClick={()=>switchMode('login')} style={{ display:'flex', alignItems:'center', gap:'.375rem', background:'none', border:'none', color:'var(--primary)', fontWeight:700, fontSize:'.875rem', cursor:'pointer', fontFamily:'inherit', marginBottom:'.875rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                  Volver al inicio de sesión
                </button>
                <div style={{ fontWeight:800, fontSize:'1.25rem', color:'var(--text)', marginBottom:'.375rem' }}>¿Olvidaste tu contraseña?</div>
                <div style={{ fontSize:'.875rem', color:'var(--text-muted)', lineHeight:1.5 }}>
                  Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                </div>
              </div>
            )}

            {/* ── Success state (forgot) ── */}
            {success && mode === 'forgot' ? (
              <div style={{ textAlign:'center', padding:'1rem 0' }}>
                <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--success-hl)', border:'2px solid var(--success)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.75rem', margin:'0 auto 1rem' }}>✉️</div>
                <div style={{ fontWeight:800, fontSize:'1.125rem', color:'var(--text)', marginBottom:'.5rem' }}>¡Email enviado!</div>
                <div style={{ fontSize:'.875rem', color:'var(--text-muted)', lineHeight:1.5, marginBottom:'1.25rem' }}>
                  Revisa tu bandeja de entrada en <strong style={{ color:'var(--text)' }}>{email}</strong>.<br/>El enlace expira en 30 minutos.
                </div>
                <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', minHeight:48 }} onClick={()=>switchMode('login')}>
                  Volver al inicio de sesión
                </button>
              </div>
            ) : (
              <>
                {/* ── Login title ── */}
                {mode === 'login' && (
                  <div style={{ marginBottom:'1.125rem' }}>
                    <div style={{ fontWeight:800, fontSize:'1.25rem', color:'var(--text)', marginBottom:'.25rem' }}>¡Bienvenida de vuelta!</div>
                    <div style={{ fontSize:'.875rem', color:'var(--text-muted)' }}>Accede para cuidar a tus mascotas 🐾</div>
                  </div>
                )}
                {mode === 'register' && (
                  <div style={{ marginBottom:'1.125rem' }}>
                    <div style={{ fontWeight:800, fontSize:'1.25rem', color:'var(--text)', marginBottom:'.25rem' }}>Crea tu cuenta</div>
                    <div style={{ fontSize:'.875rem', color:'var(--text-muted)' }}>Empieza a cuidar a tus mascotas gratis</div>
                  </div>
                )}

                {/* ── Form fields ── */}
                {mode === 'register' && (
                  <FormField type="text" label="Nombre completo" value={name} onChange={v=>{setName(v);clearErrors()}}
                    placeholder="Thamires Lopes" icon={nameIcon} error={errors.name}/>
                )}
                <FormField type="email" label="Correo electrónico" value={email} onChange={v=>{setEmail(v);clearErrors()}}
                  placeholder="nombre@email.com" icon={emailIcon} error={errors.email}/>
                <FormField type={showPwd?'text':'password'} label="Contraseña" value={password} onChange={v=>{setPassword(v);clearErrors()}}
                  placeholder={mode==='register'?'Mínimo 8 caracteres':'Tu contraseña'}
                  icon={lockIcon}
                  error={errors.password}
                  hint={mode==='register'?'Usa letras, números y símbolos para mayor seguridad':undefined}
                  extra={
                    <button onClick={()=>setShowPwd(p=>!p)} style={{ background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', display:'flex', alignItems:'center', gap:'.25rem', fontSize:'.75rem', fontWeight:700, fontFamily:'inherit' }}>
                      <EyeIcon open={showPwd}/>{showPwd?'Ocultar':'Ver'}
                    </button>
                  }
                />
                {mode === 'register' && (
                  <FormField type={showPwd?'text':'password'} label="Confirmar contraseña" value={confirm} onChange={v=>{setConfirm(v);clearErrors()}}
                    placeholder="Repite tu contraseña" icon={lockIcon} error={errors.confirm}/>
                )}

                {/* ── Remember + Forgot ── */}
                {mode === 'login' && (
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem', marginTop:'-.25rem' }}>
                    <label style={{ display:'flex', alignItems:'center', gap:'.5rem', cursor:'pointer', fontSize:'.8125rem', color:'var(--text-muted)' }}>
                      <input type="checkbox" checked={rememberMe} onChange={e=>setRememberMe(e.target.checked)} style={{ accentColor:'var(--primary)', width:16, height:16 }}/>
                      Recordarme
                    </label>
                    <button onClick={()=>switchMode('forgot')} style={{ background:'none', border:'none', color:'var(--primary)', fontWeight:700, fontSize:'.8125rem', cursor:'pointer', fontFamily:'inherit' }}>
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}

                {/* ── T&C for register ── */}
                {mode === 'register' && (
                  <div style={{ fontSize:'.75rem', color:'var(--text-faint)', marginBottom:'1rem', lineHeight:1.5 }}>
                    Al registrarte, aceptas nuestros{' '}
                    <a href="#" style={{ color:'var(--primary)', fontWeight:700, textDecoration:'none' }}>Términos de uso</a>{' '}y{' '}
                    <a href="#" style={{ color:'var(--primary)', fontWeight:700, textDecoration:'none' }}>Política de privacidad</a>.
                  </div>
                )}

                {/* ── Submit ── */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    width:'100%', minHeight:48,
                    background: loading ? 'var(--primary-hl)' : 'linear-gradient(150deg, var(--primary) 0%, #3a4c80 100%)',
                    color: loading ? 'var(--primary)' : '#fff',
                    border:'none', borderRadius:'var(--r-lg)',
                    fontFamily:'inherit', fontWeight:800, fontSize:'.9375rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:'.625rem',
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(91,108,158,.4)',
                    transition:'all 160ms',
                    marginBottom:'.875rem',
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ width:18, height:18, borderRadius:'50%', border:'2.5px solid var(--primary)', borderTopColor:'transparent', animation:'spin .7s linear infinite', display:'inline-block' }}/>
                      {mode === 'login' ? 'Entrando…' : mode === 'register' ? 'Creando cuenta…' : 'Enviando…'}
                    </>
                  ) : (
                    <>
                      {mode === 'login' ? '🔑 Iniciar sesión' : mode === 'register' ? '✨ Crear cuenta' : '✉️ Enviar enlace'}
                    </>
                  )}
                </button>

                {/* ── Social auth ── */}
                {mode !== 'forgot' && (
                  <>
                    <OrDivider/>
                    <div style={{ display:'flex', gap:'.625rem' }}>
                      <SocialBtn icon={<GoogleIcon/>} label="Google" onClick={()=>{ setLoading(true); setTimeout(()=>{setLoading(false);navigate('/dashboard')},900) }}/>
                      <SocialBtn icon={<AppleIcon/>}  label="Apple"  onClick={()=>{ setLoading(true); setTimeout(()=>{setLoading(false);navigate('/dashboard')},900) }}/>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Bottom link */}
          {!success && (
            <p style={{ textAlign:'center', marginTop:'1.25rem', fontSize:'.875rem', color:'var(--text-muted)' }}>
              {mode === 'login'
                ? <>¿No tienes cuenta? <button onClick={()=>switchMode('register')} style={{ background:'none', border:'none', color:'var(--primary)', fontWeight:800, cursor:'pointer', fontFamily:'inherit', fontSize:'inherit' }}>Regístrate gratis</button></>
                : mode === 'register'
                ? <>¿Ya tienes cuenta? <button onClick={()=>switchMode('login')} style={{ background:'none', border:'none', color:'var(--primary)', fontWeight:800, cursor:'pointer', fontFamily:'inherit', fontSize:'inherit' }}>Inicia sesión</button></>
                : null
              }
            </p>
          )}

          {/* Demo shortcut */}
          {mode !== 'forgot' && (
            <div style={{ textAlign:'center', marginTop:'.75rem' }}>
              <button onClick={()=>navigate('/dashboard')} style={{ background:'none', border:'none', color:'var(--text-faint)', fontSize:'.75rem', cursor:'pointer', fontFamily:'inherit', textDecoration:'underline dotted' }}>
                Entrar sin cuenta (demo) →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Inline styles for login-specific layouts */}
      <style>{`
        .login-brand-panel {
          width: 45%;
          min-height: 100dvh;
          background: linear-gradient(160deg, #2A3462 0%, #1a2050 40%, #3d2a62 100%);
          padding: 3rem 3.5rem;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }
        .login-brand-panel::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle at 30% 60%, rgba(196,181,224,.18) 0%, transparent 60%),
                      radial-gradient(circle at 70% 20%, rgba(139,159,212,.14) 0%, transparent 50%);
        }
        .login-mobile-logo { display: none; }
        @media (max-width: 768px) {
          .login-brand-panel { display: none; }
          .login-mobile-logo {
            display: flex; align-items: center; gap: .625rem;
            justify-content: center; margin-bottom: 1.5rem;
          }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
