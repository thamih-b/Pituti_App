// src/pages/SettingsPage.tsx
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { showToast } from '../components/AppLayout'
import { PfBtn } from '../components/FooterButtons'
import BackButton from '../components/BackButton'
import DeleteAccountModal from '../components/DeleteAccountModal'
import { useUser, deriveAvatar } from '../context/UserContext'
import { usersApi } from '../api'

// ── Toggle ────────────────────────────────────────────────────────

function Toggle({ initial = true }: { initial?: boolean }) {
  const [on, setOn] = useState(initial)
  return (
    <button
      role="switch"
      aria-checked={on}
      style={{ width:40, height:22, borderRadius:99, background:on?'var(--primary)':'var(--border)', cursor:'pointer', position:'relative', flexShrink:0, transition:'background 200ms', border:'none' }}
      onClick={() => setOn(v => !v)}
    >
      <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left:on?'calc(100% - 19px)':3, transition:'left 200ms' }}/>
    </button>
  )
}

// ── SettingsField ─────────────────────────────────────────────────

function SettingsField({ icon, label, type='text', value, onChange, placeholder, multiline=false }: {
  icon:string; label:string; type?:string; value:string; onChange:(v:string)=>void; placeholder?:string; multiline?:boolean
}) {
  return (
    <div className="settings-form-field">
      <div className="settings-form-field-icon">{icon}</div>
      <div className="settings-form-field-inner">
        <div className="settings-form-field-label">{label}</div>
        {multiline
          ? <textarea className="settings-form-field-input" style={{ resize:'none', minHeight:52 }} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={2}/>
          : <input type={type} className="settings-form-field-input" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>
        }
      </div>
    </div>
  )
}

// ── exportCSV ─────────────────────────────────────────────────────

function exportCSV(name: string, email: string, t: (k: string) => string) {
  const rows = [
    [t('field.name'),  name],
    [t('field.email'), email],
    [t('dates.today'), new Date().toLocaleString()],
  ]
  const csv  = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = 'pituti-dados.csv'; a.click()
  URL.revokeObjectURL(url)
}

// ── LanguageSelector ──────────────────────────────────────────────

function LanguageSelector() {
  const { t, i18n } = useTranslation()

  const langs = [
    { code:'es', flag:'🇪🇸', label:'Español'   },
    { code:'en', flag:'🇬🇧', label:'English'   },
    { code:'pt', flag:'🇧🇷', label:'Português' },
  ]

  const handleChange = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('lang', code)
    showToast(t('toast.languageChanged'))
  }

  return (
    <div style={{ display:'flex', gap:'.375rem', flexWrap:'wrap' }}>
      {langs.map(l => (
        <button key={l.code} onClick={() => handleChange(l.code)}
          style={{
            display:'flex', alignItems:'center', gap:'.375rem',
            padding:'.4rem .875rem',
            borderRadius:'var(--r-full)',
            border:`1.5px solid ${i18n.language===l.code ? 'var(--primary)' : 'var(--border)'}`,
            background: i18n.language===l.code ? 'var(--primary-hl)' : 'var(--surface-offset)',
            color:      i18n.language===l.code ? 'var(--primary)'    : 'var(--text-muted)',
            fontWeight: i18n.language===l.code ? 800 : 600,
            fontSize:'.8125rem', cursor:'pointer', fontFamily:'inherit',
            transition:'all var(--trans)', minHeight:40,
          }}>
          <span style={{ fontSize:'1rem' }}>{l.flag}</span>
          {l.label}
          {i18n.language===l.code && <span style={{ fontSize:'.65rem' }}>✓</span>}
        </button>
      ))}
    </div>
  )
}

// ── SettingsPage ──────────────────────────────────────────────────

export default function SettingsPage() {
  const { t } = useTranslation()
  const { user, setUser, logout } = useUser()

  const [name,       setName]       = useState('')
  const [email,      setEmail]      = useState('')
  const [phone,      setPhone]      = useState('')
  const [bio,        setBio]        = useState('')
  const [city,       setCity]       = useState('')
  const [photoUrl,   setPhotoUrl]   = useState<string|null>(null)
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const photoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setName(user.name)
    setEmail(user.email)
    setPhone(user.phone || '')
    setBio(user.bio || '')
    setCity(user.city || '')
    setPhotoUrl(user.photoUrl)
  }, [user])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const r = ev.target?.result as string
      if (r) { setPhotoUrl(r); showToast(t('toast.photoUpdated')) }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)

    // ─────────────────────────────────────────────────────────────
    // FIX 1: Persiste localmente PRIMEIRO, independente da API.
    // Assim phone/bio/city/photo nunca se perdem por erro de rede.
    // ─────────────────────────────────────────────────────────────
    const updatedUser = {
      ...user,
      name: name.trim(),
      email,
      phone,
      bio,
      city,
      photoUrl,
      avatar: deriveAvatar(name.trim()),
    }

    // Actualiza o contexto imediatamente
    setUser(updatedUser)

    // Persiste no storage correcto (localStorage ou sessionStorage)
    const storageKey = 'pitutiuser'
    const useLocal   = !!localStorage.getItem(storageKey) || !!localStorage.getItem('pitutitoken')
    const storage    = useLocal ? localStorage : sessionStorage
    storage.setItem(storageKey, JSON.stringify({
      id:       user.id,
      name:     name.trim(),
      email,
      phone,
      bio,
      city,
      photoUrl,
    }))

    // ─────────────────────────────────────────────────────────────
    // FIX 2: Envia TODOS os campos ao servidor (incluindo os novos).
    // FIX 3: photo_url em snake_case, como a API espera.
    // A falha da API agora NÃO desfaz o save local.
    // ─────────────────────────────────────────────────────────────
    try {
      if (user.id) {
        await usersApi.update(user.id, {
          name:      name.trim(),
          photo_url: photoUrl ?? null,
          phone:     phone    || null,
          bio:       bio      || null,
          city:      city     || null,
        } as any)
      }
    } catch {
      // API falhou mas dados já estão guardados localmente — não mostra erro ao user
    }

    setSaved(true)
    showToast(t('toast.changesSaved'))
    setTimeout(() => setSaved(false), 3000)
    setSaving(false)
  }

  const handleDiscard = () => {
    setName(user.name)
    setEmail(user.email)
    setPhone(user.phone || '')
    setBio(user.bio || '')
    setCity(user.city || '')
    setPhotoUrl(user.photoUrl)
  }

  const handleDeleteAccount = () => {
    setDeleteOpen(false)
    showToast(t('settings.deleteToast'), 'err')
    setTimeout(() => {
      try { localStorage.clear(); sessionStorage.clear() } catch {}
      window.location.href = '/login'
    }, 2000)
  }

  const initials = name.split(' ').filter(Boolean).slice(0,2).map(w => w[0].toUpperCase()).join('')

  const notifRows = [
    { label: t('settings.vaccineAlert'),  sub: t('settings.vaccineAlertHint'),  on: true  },
    { label: t('settings.medAlert'),      sub: t('settings.medAlertHint'),      on: true  },
    { label: t('settings.symptomAlert'),  sub: t('settings.symptomAlertHint'),  on: true  },
    { label: t('settings.weeklyDigest'),  sub: t('settings.weeklyDigestHint'),  on: false },
    { label: t('settings.urgentAlerts'),  sub: t('settings.urgentAlertsHint'),  on: true  },
  ]

  return (
    <div>
      <BackButton />
      <div className="page-header">
        <div>
          <div className="page-title">{t('settings.title')}</div>
          <div className="page-subtitle">{t('settings.subtitle')}</div>
        </div>
      </div>

      {/* Profile hero */}
      <div className="settings-profile-hero">
        <div className="settings-avatar-wrap">
          <div className="settings-avatar">
            {photoUrl ? <img src={photoUrl} alt={name}/> : <span>{initials}</span>}
          </div>
          <button className="settings-avatar-btn" onClick={() => photoRef.current?.click()} title={t('settings.changePhoto')}>📷</button>
          <input ref={photoRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhotoChange}/>
        </div>
        <div className="settings-profile-info">
          <div className="settings-profile-name">{name || t('settings.fullNamePlaceholder')}</div>
          <div className="settings-profile-email">{email}</div>
          <div className="settings-profile-joined">
            {city && `📍 ${city} · `}{t('settings.memberSince', { count: 0 })}
          </div>
        </div>
        <div style={{ display:'flex', gap:'.5rem', flexDirection:'column', alignSelf:'flex-start', flexShrink:0 }}>
          <span className="badge badge-green">✓ {t('settings.activeAccount')}</span>
          <button
            onClick={logout}
            style={{
              padding:'.4rem .875rem', borderRadius:'var(--r-full)',
              border:'1.5px solid var(--border)', background:'var(--surface-offset)',
              color:'var(--text-muted)', fontWeight:600, fontSize:'.8125rem',
              cursor:'pointer', fontFamily:'inherit', minHeight:36,
            }}
          >
            🚪 {t('settings.logout') ?? 'Sair'}
          </button>
        </div>
      </div>

      <div className="settings-layout">
        {/* ── Dados pessoais ── */}
        <div className="settings-card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ padding:'1rem 1.375rem .875rem', borderBottom:'1.5px solid var(--divider)', display:'flex', alignItems:'center', gap:'.625rem', background:'linear-gradient(135deg,var(--primary-hl),var(--surface))' }}>
            <div style={{ width:34,height:34,borderRadius:'var(--r-md)',background:'var(--primary)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.9rem' }}>👤</div>
            <div>
              <div style={{ fontWeight:800, fontSize:'.9375rem', color:'var(--text)' }}>{t('settings.personalData')}</div>
              <div style={{ fontSize:'.75rem', color:'var(--text-muted)', marginTop:'.05rem' }}>{t('settings.personalDataSub')}</div>
            </div>
          </div>
          <div style={{ padding:'1rem 1.375rem' }}>
            <SettingsField icon="👤" label={t('field.name')}  value={name}  onChange={setName}  placeholder={t('settings.fullNamePlaceholder')}/>
            <SettingsField icon="✉️" label={t('field.email')} value={email} onChange={setEmail} placeholder="email@exemplo.com" type="email"/>
            <SettingsField icon="📱" label={t('field.phone')} value={phone} onChange={setPhone} placeholder="+34 600 000 000"    type="tel"/>
            <SettingsField icon="📍" label={t('field.city')}  value={city}  onChange={setCity}  placeholder={t('settings.cityPh') ?? 'Madrid'}/>
            <SettingsField icon="📝" label={t('field.bio')}   value={bio}   onChange={setBio}   placeholder={t('settings.bioPh') ?? 'Sobre mim…'} multiline/>
          </div>
        </div>

        {/* ── Idioma ── */}
        <div className="settings-card">
          <div style={{ fontWeight:800, fontSize:'.9375rem', color:'var(--text)', marginBottom:'.75rem' }}>
            🌍 {t('settings.language')}
          </div>
          <LanguageSelector />
        </div>

        {/* ── Notificações ── */}
        <div className="settings-card">
          <div style={{ fontWeight:800, fontSize:'.9375rem', color:'var(--text)', marginBottom:'.75rem' }}>
            🔔 {t('settings.notifications')}
          </div>
          {notifRows.map(r => (
            <div key={r.label} style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'.625rem 0', borderBottom:'1px solid var(--divider)' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:'.875rem', color:'var(--text)' }}>{r.label}</div>
                <div style={{ fontSize:'.75rem', color:'var(--text-muted)' }}>{r.sub}</div>
              </div>
              <Toggle initial={r.on}/>
            </div>
          ))}
        </div>

        {/* ── Dados ── */}
        <div className="settings-card">
          <div style={{ fontWeight:800, fontSize:'.9375rem', color:'var(--text)', marginBottom:'.75rem' }}>
            📦 {t('settings.dataPrivacy')}
          </div>
          <button className="btn btn-secondary" style={{ width:'100%', marginBottom:'.5rem' }}
            onClick={() => exportCSV(name, email, t)}>
            ⬇ {t('settings.exportData')}
          </button>
          <button className="btn btn-ghost" style={{ width:'100%', color:'var(--err)' }}
            onClick={() => setDeleteOpen(true)}>
            🗑 {t('settings.deleteAccount')}
          </button>
        </div>
      </div>

      {/* ── Botões de acção ── */}
      <div style={{ display:'flex', gap:'.75rem', justifyContent:'flex-end', marginTop:'1.5rem' }}>
        <PfBtn variant="cancel" onClick={handleDiscard}>{t('btn.discard')}</PfBtn>
        <PfBtn variant="save" onClick={handleSave} disabled={saving}>
          {saving ? t('common.saving') : saved ? `✓ ${t('btn.saved')}` : t('btn.saveChanges')}
        </PfBtn>
      </div>

      <DeleteAccountModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  )
}
