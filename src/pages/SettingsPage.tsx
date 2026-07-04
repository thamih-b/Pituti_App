import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { showToast } from '../components/AppLayout'
import BackButton from '../components/BackButton'
import DeleteAccountModal from '../components/DeleteAccountModal'
import { useUser, deriveAvatar } from '../context/UserContext'
import { usersApi } from '../api'

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({ initial = true }: { initial?: boolean }) {
  const [on, setOn] = useState(initial)
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setOn(v => !v)}
      style={{
        width: 40, height: 22, borderRadius: 99, padding: 0,
        background: on ? 'var(--primary)' : 'var(--border)',
        cursor: 'pointer', position: 'relative', flexShrink: 0,
        transition: 'background 200ms', border: 'none',
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 3,
        left: on ? 'calc(100% - 19px)' : 3,
        transition: 'left 200ms',
        boxShadow: '0 1px 3px rgba(0,0,0,.2)',
      }} />
    </button>
  )
}

// ── LanguageSelector ──────────────────────────────────────────────────────────

function LanguageSelector() {
  const { t, i18n } = useTranslation()
  const langs = [
    { code: 'es', flag: '🇪🇸', label: 'Español'   },
    { code: 'en', flag: '🇬🇧', label: 'English'   },
    { code: 'pt', flag: '🇧🇷', label: 'Português' },
  ]
  return (
    <div style={{ display: 'flex', gap: '.375rem', flexWrap: 'wrap' }}>
      {langs.map(l => (
        <button
          key={l.code}
          type="button"
          onClick={() => {
            i18n.changeLanguage(l.code)
            localStorage.setItem('lang', l.code)
            showToast('✓')
          }}
          style={{
            display: 'flex', alignItems: 'center', gap: '.375rem',
            padding: '.4rem .875rem', borderRadius: 'var(--r-full)',
            border: `1.5px solid ${i18n.language === l.code ? 'var(--primary)' : 'var(--border)'}`,
            background: i18n.language === l.code ? 'var(--primary-hl)' : 'var(--surface-offset)',
            color:      i18n.language === l.code ? 'var(--primary)'    : 'var(--text-muted)',
            fontWeight: i18n.language === l.code ? 800 : 600,
            fontSize: '.8125rem', cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all var(--trans)', minHeight: 40,
          }}
        >
          <span style={{ fontSize: '1rem' }}>{l.flag}</span>
          {l.label}
          {i18n.language === l.code && (
            <span style={{ fontSize: '.65rem', opacity: .8 }}>✓</span>
          )}
        </button>
      ))}
    </div>
  )
}

// ── SectionCard ───────────────────────────────────────────────────────────────

function SectionCard({
  icon, title, subtitle, children, accent = false,
}: {
  icon: string; title: string; subtitle?: string
  children: React.ReactNode; accent?: boolean
}) {
  return (
    <div className="settings-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{
        padding: '1rem 1.375rem .875rem',
        borderBottom: '1.5px solid var(--divider)',
        display: 'flex', alignItems: 'center', gap: '.75rem',
        background: accent
          ? 'linear-gradient(135deg, var(--primary-hl), var(--surface))'
          : 'var(--surface)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 'var(--r-md)',
          background: accent ? 'var(--primary)' : 'var(--surface-offset)',
          color: accent ? '#fff' : 'var(--text-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '.9375rem', color: 'var(--text)' }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.05rem' }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
      <div style={{ padding: '1.125rem 1.375rem' }}>
        {children}
      </div>
    </div>
  )
}

// ── FormRow ───────────────────────────────────────────────────────────────────

function FormRow({
  icon, label, required, hint, children,
}: {
  icon: string; label: string; required?: boolean; hint?: string; children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '.375rem',
        marginBottom: '.375rem',
      }}>
        <span style={{ fontSize: '.9rem' }}>{icon}</span>
        <label style={{
          fontWeight: 700, fontSize: '.8125rem', color: 'var(--text)',
        }}>
          {label}
          {required && (
            <span style={{ color: 'var(--primary)', marginLeft: '.2rem' }}>*</span>
          )}
        </label>
        {hint && (
          <span style={{ fontSize: '.72rem', color: 'var(--text-faint)', marginLeft: '.25rem' }}>
            · {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

// ── NotifRow ──────────────────────────────────────────────────────────────────

function NotifRow({ label, sub, initial }: { label: string; sub: string; initial: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1rem',
      padding: '.625rem 0', borderBottom: '1px solid var(--divider)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '.875rem', color: 'var(--text)' }}>{label}</div>
        <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.1rem' }}>{sub}</div>
      </div>
      <Toggle initial={initial} />
    </div>
  )
}

// ── exportCSV ─────────────────────────────────────────────────────────────────

function exportCSV(name: string, email: string) {
  const rows = [
    ['name', name],
    ['email', email],
    ['exported', new Date().toLocaleString()],
  ]
  const csv  = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url; a.download = 'pituti-dados.csv'; a.click()
  URL.revokeObjectURL(url)
}

// ── SettingsPage ──────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { t }                   = useTranslation()
  const { user, setUser, logout } = useUser()

  const [name,       setName]       = useState('')
  const [email,      setEmail]      = useState('')
  const [phone,      setPhone]      = useState('')
  const [city,       setCity]       = useState('')
  const [bio,        setBio]        = useState('')
  const [photoUrl,   setPhotoUrl]   = useState<string | null>(null)
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const photoRef = useRef<HTMLInputElement>(null)

  // Sincroniza estado local com dados do user
  useEffect(() => {
    setName(user.name     ?? '')
    setEmail(user.email   ?? '')
    setPhone(user.phone   ?? '')
    setCity(user.city     ?? '')
    setBio(user.bio       ?? '')
    setPhotoUrl(user.photoUrl ?? null)
  }, [user])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const r = ev.target?.result as string
      if (r) { setPhotoUrl(r); showToast(t('settings.changePhoto') + ' ✓') }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)

    // 1. Actualiza contexto e localStorage imediatamente (não depende da API)
    const updatedUser = {
      ...user,
      name: name.trim(),
      email,
      phone,
      city,
      bio,
      photoUrl,
      avatar: deriveAvatar(name.trim()),
    }
    setUser(updatedUser)

    const storageKey = 'pitutiuser'
    const useLocal   = !!localStorage.getItem(storageKey) || !!localStorage.getItem('pitutitoken')
    const storage    = useLocal ? localStorage : sessionStorage
    storage.setItem(storageKey, JSON.stringify({
      id: user.id, name: name.trim(), email, phone, city, bio, photoUrl,
    }))

    // 2. Tenta persistir no servidor (falha silenciosa — dados já salvos localmente)
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
    } catch { /* silencioso */ }

    setSaved(true)
    showToast(t('toast.changesSaved'))
    setTimeout(() => setSaved(false), 3000)
    setSaving(false)
  }

  const handleDiscard = () => {
    setName(user.name     ?? '')
    setEmail(user.email   ?? '')
    setPhone(user.phone   ?? '')
    setCity(user.city     ?? '')
    setBio(user.bio       ?? '')
    setPhotoUrl(user.photoUrl ?? null)
  }

  const handleDeleteAccount = () => {
    setDeleteOpen(false)
    showToast(t('settings.deleteToast'), 'err')
    setTimeout(() => {
      try { localStorage.clear(); sessionStorage.clear() } catch {}
      window.location.href = '/login'
    }, 2000)
  }

  // Iniciais para avatar
  const initials = name.split(' ').filter(Boolean).slice(0, 2)
    .map(w => w[0].toUpperCase()).join('')

  return (
    <div>
      <BackButton />

      <div className="page-header">
        <div>
          <h1 className="page-title">{t('settings.title')}</h1>
          <p className="page-subtitle">{t('settings.subtitle')}</p>
        </div>
      </div>

      {/* ── Hero de perfil ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '1.25rem',
        padding: '1.25rem 1.5rem',
        background: 'linear-gradient(135deg, var(--primary-hl) 0%, var(--surface) 100%)',
        borderRadius: 'var(--r-xl)',
        border: '1.5px solid var(--border)',
        boxShadow: 'var(--sh-sm)',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        {/* Avatar clicável */}
        <div
          style={{ position: 'relative', flexShrink: 0, cursor: 'pointer' }}
          onClick={() => photoRef.current?.click()}
          title={t('settings.changePhoto')}
        >
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid var(--primary)',
            boxShadow: '0 0 0 3px var(--primary-hl)',
            background: 'var(--surface-offset)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)',
          }}>
            {photoUrl
              ? <img
                  src={photoUrl}
                  alt={name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              : <span>{initials || '🐾'}</span>}
          </div>
          {/* Badge de câmera */}
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 22, height: 22, borderRadius: '50%',
            background: 'var(--primary)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '.7rem', border: '2px solid var(--surface)',
          }}>
            📷
          </div>
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
        </div>

        {/* Info de nome e email */}
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{
            fontWeight: 800, fontSize: '1.125rem', color: 'var(--text)', lineHeight: 1.2,
          }}>
            {name || t('settings.fullNamePlaceholder')}
          </div>
          <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>
            {email}
          </div>
          {city && (
            <div style={{ fontSize: '.75rem', color: 'var(--text-faint)', marginTop: '.15rem' }}>
              📍 {city}
            </div>
          )}
          <div style={{ display: 'flex', gap: '.375rem', marginTop: '.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-green" style={{ fontSize: '.7rem' }}>
              ✓ {t('settings.activeAccount')}
            </span>
          </div>
        </div>

        {/* Botão de sair */}
        <button
          type="button"
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: '.375rem',
            padding: '.4rem .875rem', borderRadius: 'var(--r-full)',
            border: '1.5px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-muted)',
            fontWeight: 600, fontSize: '.8125rem',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all var(--trans)', minHeight: 36, flexShrink: 0,
          }}
        >
          🚪 {t('settings.logout', { defaultValue: 'Sair' })}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* ── Dados pessoais ── */}
        <SectionCard
          icon="👤"
          title={t('settings.personalData')}
          subtitle={t('settings.personalSubtitle')}
          accent
        >
          {/* Nome */}
          <FormRow icon="👤" label={t('settings.fullName')} required>
            <input
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('settings.fullNamePlaceholder')}
            />
          </FormRow>

          {/* Email */}
          <FormRow icon="✉️" label={t('settings.email')} required>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              autoComplete="email"
            />
          </FormRow>

          {/* Telefone e cidade numa linha */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
            <FormRow icon="📱" label={t('settings.phone')}>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder={t('settings.phonePlaceholder')}
                autoComplete="tel"
              />
            </FormRow>
            <FormRow icon="📍" label={t('settings.city')}>
              <input
                className="form-input"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder={t('settings.cityPlaceholder')}
              />
            </FormRow>
          </div>

          {/* Bio */}
          <FormRow
            icon="📝"
            label={t('settings.about')}
            hint={t('btn.optional')}
          >
            <textarea
              className="form-input"
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder={t('settings.aboutPlaceholder')}
              style={{ resize: 'vertical', minHeight: 68, fontFamily: 'inherit', lineHeight: 1.5 }}
            />
            <div style={{
              fontSize: '.7rem', color: 'var(--text-faint)',
              marginTop: '.25rem', textAlign: 'right',
            }}>
              {bio.length}/300
            </div>
          </FormRow>
        </SectionCard>

        {/* ── Idioma ── */}
        <SectionCard icon="🌍" title={t('settings.language')} subtitle={t('settings.languageHint')}>
          <LanguageSelector />
        </SectionCard>

        {/* ── Notificações ── */}
        <SectionCard icon="🔔" title={t('settings.notifications')}>
          <NotifRow label={t('settings.vaccineAlert')}  sub={t('settings.vaccineAlertHint')}  initial={true}  />
          <NotifRow label={t('settings.medAlert')}      sub={t('settings.medAlertHint')}      initial={true}  />
          <NotifRow label={t('settings.symptomAlert')}  sub={t('settings.symptomAlertHint')}  initial={true}  />
          <NotifRow label={t('settings.weeklyDigest')}  sub={t('settings.weeklyDigestHint')}  initial={false} />
          <NotifRow label={t('settings.urgentAlerts')}  sub={t('settings.urgentAlertsHint')}  initial={true}  />
        </SectionCard>

        {/* ── Dados & privacidade ── */}
        <SectionCard icon="🔒" title={t('settings.dangerZone')}>
          <div style={{ marginBottom: '.75rem' }}>
            <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginBottom: '.5rem' }}>
              {t('settings.exportHint')}
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={() => exportCSV(name, email)}
            >
              ⬇ {t('settings.exportBtn')}
            </button>
          </div>
          <div style={{ borderTop: '1px solid var(--divider)', paddingTop: '.75rem' }}>
            <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginBottom: '.5rem' }}>
              {t('settings.deleteHint')}
            </div>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ width: '100%', color: 'var(--err)', borderColor: 'var(--err-hl)' }}
              onClick={() => setDeleteOpen(true)}
            >
              🗑 {t('settings.deleteBtn')}
            </button>
          </div>
        </SectionCard>
      </div>

      {/* ── Botões de acção ── */}
      <div style={{
        display: 'flex', gap: '.75rem', justifyContent: 'flex-end',
        marginTop: '1.5rem', paddingBottom: '2rem',
      }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleDiscard}
          disabled={saving}
        >
          {t('btn.discard')}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
          style={{ minWidth: 140 }}
        >
          {saving
            ? t('settings.saving', { defaultValue: 'Guardando…' })
            : saved
            ? `✓ ${t('settings.saved')}`
            : t('btn.saveChanges')}
        </button>
      </div>

      <DeleteAccountModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  )
}
