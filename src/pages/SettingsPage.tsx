import { useState, useRef } from 'react'
import { showToast } from '../components/AppLayout'
import { PfBtn } from '../components/FooterButtons'
import DeleteAccountModal from '../components/DeleteAccountModal'
import BackButton from '../components/BackButton'

function Toggle({ initial = true }: { initial?: boolean }) {
  const [on, setOn] = useState(initial)
  return (
    <div style={{ width:40,height:22,borderRadius:99,background:on?'var(--primary)':'var(--border)',cursor:'pointer',position:'relative',flexShrink:0,transition:'background 200ms' }} onClick={()=>setOn(v=>!v)}>
      <div style={{ width:16,height:16,borderRadius:'50%',background:'#fff',position:'absolute',top:3,left:on?'calc(100% - 19px)':3,transition:'left 200ms' }}/>
    </div>
  )
}

function SettingsField({ icon, label, type='text', value, onChange, placeholder, multiline=false }: {
  icon:string; label:string; type?:string; value:string; onChange:(v:string)=>void; placeholder?:string; multiline?:boolean
}) {
  return (
    <div className="settings-form-field">
      <div className="settings-form-field-icon">{icon}</div>
      <div className="settings-form-field-inner">
        <div className="settings-form-field-label">{label}</div>
        {multiline
          ?<textarea className="settings-form-field-input" style={{ resize:'none',minHeight:52 }} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={2}/>
          :<input type={type} className="settings-form-field-input" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
        }
      </div>
    </div>
  )
}

function exportCSV(name: string, email: string) {
  const rows = [
    ['Campo','Valor'],['Nombre',name],['Email',email],['Mascotas','3'],
    ['Luna — Gato','Europeo común · 4 años · 4.2kg'],['Toby — Perro','Mestizo · 5 años · 12.4kg'],['Kiwi — Ave','Periquito · 2 años · 32g'],
    ['Vacunas registradas','8'],['Medicamentos activos','2'],['Síntomas en observación','1'],['Notas','3'],
    ['Exportado el',new Date().toLocaleString('es-ES')],
  ]
  const csv  = rows.map(r=>r.map(c=>`"${c}"`).join(',')).join('\n')
  const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'})
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href=url; a.download='pituti-datos.csv'; a.click()
  URL.revokeObjectURL(url)
}

export default function SettingsPage() {
  const [name,   setName]   = useState('Thamires Lopes')
  const [email,  setEmail]  = useState('thamires@email.com')
  const [phone,  setPhone]  = useState('+34 600 000 000')
  const [bio,    setBio]    = useState('')
  const [city,   setCity]   = useState('Madrid, España')
  const [photoUrl,setPhotoUrl]=useState<string|null>(null)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [deleteOpen,setDeleteOpen]=useState(false)
  const photoRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange=(e:React.ChangeEvent<HTMLInputElement>)=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{const r=ev.target?.result as string;if(r){setPhotoUrl(r);showToast('📸 Foto actualizada')}};reader.readAsDataURL(file)}

  const handleSave=()=>{if(!name.trim())return;setSaving(true);setTimeout(()=>{setSaving(false);setSaved(true);showToast('✓ Cambios guardados correctamente');setTimeout(()=>setSaved(false),3000)},800)}

  const handleDeleteAccount=()=>{
    setDeleteOpen(false)
    showToast('Cuenta eliminada. Hasta pronto.','err')
    // In real app: clear localStorage, redirect to login
    setTimeout(()=>{ try{localStorage.clear()}catch{} },2000)
  }

  const initials=name.split(' ').filter(Boolean).slice(0,2).map(w=>w[0].toUpperCase()).join('')

  return (
    <div>
      <BackButton label="Volver"/>
      <div className="page-header">
        <div><div className="page-title">Ajustes</div><div className="page-subtitle">Cuenta y preferencias</div></div>
      </div>

      {/* Profile hero */}
      <div className="settings-profile-hero">
        <div className="settings-avatar-wrap">
          <div className="settings-avatar">{photoUrl?<img src={photoUrl} alt={name}/>:<span>{initials}</span>}</div>
          <button className="settings-avatar-btn" onClick={()=>photoRef.current?.click()} title="Cambiar foto">📷</button>
          <input ref={photoRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhotoChange}/>
        </div>
        <div className="settings-profile-info">
          <div className="settings-profile-name">{name||'Tu nombre'}</div>
          <div className="settings-profile-email">{email}</div>
          <div className="settings-profile-joined">{city&&`📍 ${city} · `}Miembro desde enero 2026 · 3 mascotas</div>
        </div>
        <div style={{ display:'flex',gap:'.5rem',flexDirection:'column',alignSelf:'flex-start',flexShrink:0 }}>
          <span className="badge badge-green">✓ Cuenta activa</span>
          <span className="badge badge-blue">🐾 3 mascotas</span>
        </div>
      </div>

      <div className="settings-layout">
        {/* Datos personales */}
        <div className="settings-card" style={{ padding:0,overflow:'hidden' }}>
          {/* Header */}
          <div style={{ padding:'1rem 1.375rem .875rem',borderBottom:'1.5px solid var(--divider)',display:'flex',alignItems:'center',gap:'.625rem',background:'linear-gradient(135deg,var(--primary-hl),var(--surface))' }}>
            <div style={{ width:34,height:34,borderRadius:'var(--r-md)',background:'var(--primary)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem' }}>👤</div>
            <div>
              <div style={{ fontWeight:800,fontSize:'.9375rem',color:'var(--text)' }}>Datos personales</div>
              <div style={{ fontSize:'.75rem',color:'var(--text-muted)' }}>Tu información en PITUTI</div>
            </div>
          </div>
          {/* Photo */}
          <div style={{ display:'flex',alignItems:'center',gap:'1rem',padding:'.875rem 1.375rem',borderBottom:'1px solid var(--divider)',background:'var(--bg)' }}>
            <div style={{ width:52,height:52,borderRadius:'50%',background:'linear-gradient(135deg,var(--pal-lilac),var(--pal-denim))',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',fontWeight:800,color:'var(--nav-bg)',flexShrink:0 }}>
              {photoUrl?<img src={photoUrl} alt={name} style={{ width:'100%',height:'100%',objectFit:'cover' }}/>:initials}
            </div>
            <div style={{ flex:1 }}><div style={{ fontWeight:700,fontSize:'.875rem',color:'var(--text)' }}>Foto de perfil</div><div style={{ fontSize:'.75rem',color:'var(--text-muted)' }}>JPG, PNG o WebP · Máx. 2 MB</div></div>
            <PfBtn variant="edit" size="sm" onClick={()=>photoRef.current?.click()}>Cambiar</PfBtn>
          </div>
          {/* Fields */}
          <div style={{ margin:0,borderRadius:0,border:'none',display:'flex',flexDirection:'column' }}>
            <SettingsField icon="🪪" label="Nombre completo" value={name} onChange={setName} placeholder="Tu nombre y apellido"/>
            <SettingsField icon="✉️" label="Correo electrónico" type="email" value={email} onChange={setEmail} placeholder="nombre@email.com"/>
            <SettingsField icon="📱" label="Teléfono" type="tel" value={phone} onChange={setPhone} placeholder="+34 600 000 000"/>
            <SettingsField icon="📍" label="Ciudad" value={city} onChange={setCity} placeholder="Madrid, Barcelona…"/>
            <SettingsField icon="💬" label="Sobre mí" value={bio} onChange={setBio} placeholder="Cuidador/a de mascotas…" multiline/>
          </div>
          {/* Save footer */}
          <div style={{ padding:'.875rem 1.375rem',borderTop:'1.5px solid var(--divider)',background:'var(--surface-2)',display:'flex',alignItems:'center',justifyContent:'flex-end',gap:'.5rem' }}>
            {saved&&<div style={{ display:'flex',alignItems:'center',gap:'.375rem',fontSize:'.8125rem',color:'var(--success)',fontWeight:700,marginRight:'auto' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6 9 17l-5-5"/></svg>Guardado</div>}
            <PfBtn variant="cancel" size="sm" onClick={()=>{setName('Thamires Lopes');setEmail('thamires@email.com');setPhone('+34 600 000 000');setBio('');setCity('Madrid, España')}}>Descartar</PfBtn>
            <PfBtn variant="save" size="sm" loading={saving} onClick={handleSave}>Guardar cambios</PfBtn>
          </div>
        </div>

        {/* Right */}
        <div style={{ display:'flex',flexDirection:'column',gap:'1.125rem' }}>
          <div className="settings-card">
            <div className="settings-card-title"><span>🎨</span> Apariencia</div>
            <div className="notif-row"><div className="notif-row-info"><div className="notif-row-label">Tema</div><div className="notif-row-sub">Claro u oscuro</div></div><button className="btn btn-secondary btn-sm" onClick={()=>{const d=document.documentElement;d.setAttribute('data-theme',d.getAttribute('data-theme')==='dark'?'light':'dark');showToast('Tema cambiado')}}>Cambiar</button></div>
            <div className="notif-row" style={{ borderBottom:'none' }}><div className="notif-row-info"><div className="notif-row-label">Idioma</div><div className="notif-row-sub">Español</div></div><select className="form-input" style={{ width:'auto',padding:'.25rem .5rem',fontSize:'.8125rem' }}><option>Español</option><option>Português</option><option>English</option></select></div>
          </div>
          <div className="settings-card">
            <div className="settings-card-title"><span>🔔</span> Notificaciones</div>
            {[{label:'Vacunas a vencer',sub:'7 días antes del vencimiento',on:true},{label:'Dosis de medicamentos',sub:'Recordatorio diario de dosis',on:true},{label:'Síntomas sin resolución',sub:'Cuando un síntoma lleva +3 días',on:true},{label:'Resumen semanal',sub:'Cada lunes por email',on:false},{label:'Alertas urgentes',sub:'Push inmediato en emergencias',on:true}].map(n=>(<div key={n.label} className="notif-row"><div className="notif-row-info"><div className="notif-row-label">{n.label}</div><div className="notif-row-sub">{n.sub}</div></div><Toggle initial={n.on}/></div>))}
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="settings-card" style={{ marginTop:'1.125rem',borderColor:'rgba(200,64,106,.25)' }}>
        <div className="settings-card-title" style={{ color:'var(--err)' }}><span>⚠️</span> Zona de riesgo</div>
        <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'1rem',paddingBottom:'1rem',borderBottom:'1px solid var(--divider)',marginBottom:'1rem' }}>
          <div><div style={{ fontSize:'.875rem',fontWeight:700,color:'var(--text)' }}>Exportar datos</div><div style={{ fontSize:'.75rem',color:'var(--text-muted)',marginTop:'.2rem' }}>Descarga un CSV con todo el historial de tus mascotas, vacunas, medicamentos y síntomas.</div></div>
          <PfBtn variant="archive" size="sm" onClick={()=>{exportCSV(name,email);showToast('📄 CSV descargado')}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exportar CSV
          </PfBtn>
        </div>
        <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:'1rem' }}>
          <div><div style={{ fontSize:'.875rem',fontWeight:700,color:'var(--err)' }}>Eliminar cuenta</div><div style={{ fontSize:'.75rem',color:'var(--text-muted)',marginTop:'.2rem' }}>Acción permanente e irreversible. Se borrarán todos tus datos, mascotas e historial.</div></div>
          <PfBtn variant="delete" size="sm" onClick={()=>setDeleteOpen(true)}>Eliminar cuenta</PfBtn>
        </div>
      </div>

      <DeleteAccountModal isOpen={deleteOpen} onClose={()=>setDeleteOpen(false)} onConfirm={handleDeleteAccount}/>
    </div>
  )
}
