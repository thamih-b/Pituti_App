import { useState, useRef } from 'react'
import { showToast } from '../components/AppLayout'
import Input from '../components/Input'
import Button from '../components/Button'

function Toggle({ initial = true }: { initial?: boolean }) {
  const [on, setOn] = useState(initial)
  return (
    <div style={{ width:40, height:22, borderRadius:99, background:on?'var(--primary)':'var(--border)', cursor:'pointer', position:'relative', flexShrink:0, transition:'background 200ms' }}
      onClick={()=>setOn(v=>!v)}>
      <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left:on?'calc(100% - 19px)':3, transition:'left 200ms' }}/>
    </div>
  )
}

export default function SettingsPage() {
  const [name,      setName]      = useState('Thamires Lopes')
  const [email,     setEmail]     = useState('thamires@email.com')
  const [bio,       setBio]       = useState('')
  const [phone,     setPhone]     = useState('')
  const [photoUrl,  setPhotoUrl]  = useState<string | null>(null)
  const [saving,    setSaving]    = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const result = ev.target?.result as string
      if (result) { setPhotoUrl(result); showToast('📸 Foto de perfil actualizada') }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!name.trim()) return
    setSaving(true)
    setTimeout(() => { setSaving(false); showToast('✓ Cambios guardados correctamente') }, 900)
  }

  const initials = name.split(' ').filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join('')

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Ajustes</div><div className="page-subtitle">Cuenta y preferencias</div></div>
      </div>

      {/* ── Profile Hero ── */}
      <div className="settings-profile-hero">
        <div className="settings-avatar-wrap">
          <div className="settings-avatar">
            {photoUrl ? <img src={photoUrl} alt={name}/> : <span>{initials}</span>}
          </div>
          <button className="settings-avatar-btn" onClick={()=>photoInputRef.current?.click()} title="Cambiar foto">
            📷
          </button>
          <input ref={photoInputRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhotoChange}/>
        </div>
        <div className="settings-profile-info">
          <div className="settings-profile-name">{name || 'Tu nombre'}</div>
          <div className="settings-profile-email">{email}</div>
          <div className="settings-profile-joined">Miembro desde enero 2026 · 3 mascotas</div>
        </div>
        <div style={{ display:'flex', gap:'.5rem', flexDirection:'column', alignSelf:'flex-start', flexShrink:0 }}>
          <span className="badge badge-green">✓ Cuenta activa</span>
          <span className="badge badge-blue">🐾 3 mascotas</span>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="settings-layout">

        {/* Profile form */}
        <div className="settings-card">
          <div className="settings-card-title"><span>👤</span> Datos personales</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'.875rem' }}>
            <Input label="Nombre completo" name="name" value={name} onChange={e=>setName(e.target.value)} required/>
            <Input label="Email" name="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
            <Input label="Teléfono" name="phone" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+34 600 000 000"/>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label className="form-label" style={{ fontSize:'.8125rem', fontWeight:700, color:'var(--text-muted)' }}>Sobre mí <span style={{ color:'var(--text-faint)', fontWeight:500 }}>(opcional)</span></label>
              <textarea className="form-input" rows={2}
                placeholder="Cuidador/a de mascotas, veterinaria vocacional…"
                value={bio} onChange={e=>setBio(e.target.value)}
                style={{ resize:'vertical', minHeight:60, fontFamily:'inherit' }}/>
            </div>
          </div>
          <div style={{ marginTop:'1.125rem', display:'flex', gap:'.5rem', justifyContent:'flex-end' }}>
            <Button variant="ghost" onClick={()=>{ setName('Thamires Lopes'); setEmail('thamires@email.com'); setBio(''); setPhone('') }}>Descartar</Button>
            <Button onClick={handleSave} isLoading={saving}>Guardar cambios</Button>
          </div>
        </div>

        {/* Preferences */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1.125rem' }}>
          <div className="settings-card">
            <div className="settings-card-title"><span>🎨</span> Apariencia</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
              <div className="notif-row">
                <div className="notif-row-info">
                  <div className="notif-row-label">Tema</div>
                  <div className="notif-row-sub">Claro u oscuro</div>
                </div>
                <button className="btn btn-secondary btn-sm"
                  onClick={()=>{ const d=document.documentElement; const cur=d.getAttribute('data-theme'); d.setAttribute('data-theme',cur==='dark'?'light':'dark'); showToast('Tema cambiado') }}>
                  Cambiar
                </button>
              </div>
              <div className="notif-row" style={{ borderBottom:'none' }}>
                <div className="notif-row-info">
                  <div className="notif-row-label">Idioma</div>
                  <div className="notif-row-sub">Español</div>
                </div>
                <select className="form-input" style={{ width:'auto', padding:'.25rem .5rem', fontSize:'.8125rem' }}>
                  <option>Español</option><option>Português</option><option>English</option>
                </select>
              </div>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-title"><span>🔔</span> Notificaciones</div>
            {[
              { label:'Vacunas a vencer',       sub:'7 días antes del vencimiento',     on:true  },
              { label:'Dosis de medicamentos',  sub:'Recordatorio diario de dosis',     on:true  },
              { label:'Síntomas sin resolución',sub:'Cuando un síntoma lleva +3 días',  on:true  },
              { label:'Resumen semanal',         sub:'Cada lunes por email',             on:false },
              { label:'Alertas urgentes',        sub:'Push inmediato en emergencias',    on:true  },
            ].map(n=>(
              <div key={n.label} className="notif-row">
                <div className="notif-row-info">
                  <div className="notif-row-label">{n.label}</div>
                  <div className="notif-row-sub">{n.sub}</div>
                </div>
                <Toggle initial={n.on}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Danger zone ── */}
      <div className="settings-card" style={{ marginTop:'1.125rem', borderColor:'rgba(200,64,106,.25)' }}>
        <div className="settings-card-title" style={{ color:'var(--err)' }}><span>⚠️</span> Zona de riesgo</div>
        <div style={{ display:'flex', flexDirection:'column', gap:'.75rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
            <div>
              <div style={{ fontSize:'.875rem', fontWeight:700, color:'var(--text)' }}>Exportar datos</div>
              <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>Descarga un CSV con todo el historial de tus mascotas</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={()=>showToast('CSV descargado')}>Exportar</button>
          </div>
          <div className="divider" style={{ margin:'.25rem 0' }}/>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
            <div>
              <div style={{ fontSize:'.875rem', fontWeight:700, color:'var(--err)' }}>Eliminar cuenta</div>
              <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>Esta acción es irreversible y borrará todos tus datos</div>
            </div>
            <button className="btn btn-danger btn-sm">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  )
}
