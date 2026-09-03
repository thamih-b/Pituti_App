
import {
  useState, useRef, useEffect, useCallback, type ReactNode,
  type ChangeEvent, type KeyboardEvent,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  parsePhoneNumber,
  isValidPhoneNumber,
  type CountryCode,
} from 'libphonenumber-js'
import { showToast } from '../components/AppLayout'
import BackButton from '../components/BackButton'
import DeleteAccountModal from '../components/DeleteAccountModal'
import { useUser, deriveAvatar } from '../context/UserContext'
import { usersApi } from '../api'
import { resizeImageToDataUrl } from '../utils/imageResize'
import { useTheme } from '../context/PitutiContext'


// ═══════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════

interface CountryEntry {
  code: CountryCode
  flag: string
  name: string
  dial: string
}

/** Top-50 countries sorted by global phone usage */
const COUNTRIES: CountryEntry[] = [
  { code: 'CN', flag: '🇨🇳', name: 'China',          dial: '+86'  },
  { code: 'IN', flag: '🇮🇳', name: 'India',          dial: '+91'  },
  { code: 'US', flag: '🇺🇸', name: 'United States',  dial: '+1'   },
  { code: 'BR', flag: '🇧🇷', name: 'Brasil',         dial: '+55'  },
  { code: 'ID', flag: '🇮🇩', name: 'Indonesia',      dial: '+62'  },
  { code: 'PK', flag: '🇵🇰', name: 'Pakistan',       dial: '+92'  },
  { code: 'NG', flag: '🇳🇬', name: 'Nigeria',        dial: '+234' },
  { code: 'BD', flag: '🇧🇩', name: 'Bangladesh',     dial: '+880' },
  { code: 'RU', flag: '🇷🇺', name: 'Russia',         dial: '+7'   },
  { code: 'MX', flag: '🇲🇽', name: 'México',         dial: '+52'  },
  { code: 'ET', flag: '🇪🇹', name: 'Ethiopia',       dial: '+251' },
  { code: 'JP', flag: '🇯🇵', name: 'Japan',          dial: '+81'  },
  { code: 'PH', flag: '🇵🇭', name: 'Philippines',    dial: '+63'  },
  { code: 'EG', flag: '🇪🇬', name: 'Egypt',          dial: '+20'  },
  { code: 'CD', flag: '🇨🇩', name: 'DR Congo',       dial: '+243' },
  { code: 'VN', flag: '🇻🇳', name: 'Vietnam',        dial: '+84'  },
  { code: 'TR', flag: '🇹🇷', name: 'Turkey',         dial: '+90'  },
  { code: 'DE', flag: '🇩🇪', name: 'Germany',        dial: '+49'  },
  { code: 'TH', flag: '🇹🇭', name: 'Thailand',       dial: '+66'  },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom', dial: '+44'  },
  { code: 'FR', flag: '🇫🇷', name: 'France',         dial: '+33'  },
  { code: 'ES', flag: '🇪🇸', name: 'España',         dial: '+34'  },
  { code: 'PT', flag: '🇵🇹', name: 'Portugal',       dial: '+351' },
  { code: 'IT', flag: '🇮🇹', name: 'Italia',         dial: '+39'  },
  { code: 'AR', flag: '🇦🇷', name: 'Argentina',      dial: '+54'  },
  { code: 'CO', flag: '🇨🇴', name: 'Colombia',       dial: '+57'  },
  { code: 'CL', flag: '🇨🇱', name: 'Chile',          dial: '+56'  },
  { code: 'PE', flag: '🇵🇪', name: 'Perú',           dial: '+51'  },
  { code: 'CA', flag: '🇨🇦', name: 'Canada',         dial: '+1'   },
  { code: 'AU', flag: '🇦🇺', name: 'Australia',      dial: '+61'  },
  { code: 'ZA', flag: '🇿🇦', name: 'South Africa',   dial: '+27'  },
  { code: 'KR', flag: '🇰🇷', name: 'South Korea',    dial: '+82'  },
  { code: 'SA', flag: '🇸🇦', name: 'Saudi Arabia',   dial: '+966' },
  { code: 'AE', flag: '🇦🇪', name: 'UAE',            dial: '+971' },
  { code: 'PL', flag: '🇵🇱', name: 'Poland',         dial: '+48'  },
  { code: 'NL', flag: '🇳🇱', name: 'Netherlands',    dial: '+31'  },
  { code: 'CH', flag: '🇨🇭', name: 'Switzerland',    dial: '+41'  },
  { code: 'SE', flag: '🇸🇪', name: 'Sweden',         dial: '+46'  },
  { code: 'NO', flag: '🇳🇴', name: 'Norway',         dial: '+47'  },
  { code: 'DK', flag: '🇩🇰', name: 'Denmark',        dial: '+45'  },
  { code: 'FI', flag: '🇫🇮', name: 'Finland',        dial: '+358' },
  { code: 'BE', flag: '🇧🇪', name: 'Belgium',        dial: '+32'  },
  { code: 'AT', flag: '🇦🇹', name: 'Austria',        dial: '+43'  },
  { code: 'GR', flag: '🇬🇷', name: 'Greece',         dial: '+30'  },
  { code: 'UA', flag: '🇺🇦', name: 'Ukraine',        dial: '+380' },
  { code: 'PT', flag: '🇵🇹', name: 'Portugal',       dial: '+351' },
  { code: 'NZ', flag: '🇳🇿', name: 'New Zealand',    dial: '+64'  },
  { code: 'SG', flag: '🇸🇬', name: 'Singapore',      dial: '+65'  },
  { code: 'HK', flag: '🇭🇰', name: 'Hong Kong',      dial: '+852' },
  { code: 'IL', flag: '🇮🇱', name: 'Israel',         dial: '+972' },
]

// Detecta país inicial a partir de um número E.164
function detectCountryFromE164(e164: string): CountryEntry {
  if (!e164) return COUNTRIES.find(c => c.code === 'BR') ?? COUNTRIES[0]
  // Ordena por comprimento do dial desc para evitar ambiguidade (+1 vs +1xxx)
  const sorted = [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length)
  return sorted.find(c => e164.startsWith(c.dial)) ?? COUNTRIES[0]
}

// Remove tudo que não é dígito
function digitsOnly(s: string): string { return s.replace(/\D/g, '') }

// ═══════════════════════════════════════════════════════════════════
// PHONE INPUT
// ═══════════════════════════════════════════════════════════════════

interface PhoneInputProps {
  value: string           // E.164 stored value, e.g. "+5511988880000"
  onChange: (e164: string, isValid: boolean) => void
}

function PhoneInput({ value, onChange }: PhoneInputProps) {
  const { t } = useTranslation()
  const [country,      setCountry]      = useState<CountryEntry>(() => detectCountryFromE164(value))
  const [localDigits,  setLocalDigits]  = useState<string>(() => {
    if (!value) return ''
    const c = detectCountryFromE164(value)
    return digitsOnly(value.slice(c.dial.length))
  })
  const [dropOpen,     setDropOpen]     = useState(false)
  const [search,       setSearch]       = useState('')
  const [phoneValid,   setPhoneValid]   = useState(true)
  const dropRef   = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
  const c = detectCountryFromE164(value)
  setCountry(c)
  setLocalDigits(value ? digitsOnly(value.slice(c.dial.length)) : '')
}, [value])

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false); setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Foca search ao abrir
  useEffect(() => {
    if (dropOpen) setTimeout(() => searchRef.current?.focus(), 60)
  }, [dropOpen])

  const validate = useCallback((digits: string, cc: CountryEntry): boolean => {
    if (!digits) return true
    try { return isValidPhoneNumber(`${cc.dial}${digits}`, cc.code) }
    catch { return digits.length >= 6 && digits.length <= 15 }
  }, [])

  const emit = useCallback((digits: string, cc: CountryEntry) => {
    const valid = validate(digits, cc)
    setPhoneValid(valid)
    // Armazena como E.164 limpo: +<código><dígitos>
    onChange(digits ? `${cc.dial}${digits}` : '', valid)
  }, [validate, onChange])

  const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Sem máscara rígida — aceita espaços e hifens mas armazena só dígitos
    const digits = digitsOnly(e.target.value)
    if (digits.length > 15) return   // limite E.164 máximo
    setLocalDigits(digits)
    emit(digits, country)
  }

  const handleCountrySelect = (c: CountryEntry) => {
    setCountry(c); setDropOpen(false); setSearch('')
    emit(localDigits, c)
  }

  const filtered = search
    ? COUNTRIES.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dial.includes(search) ||
        c.code.toLowerCase().includes(search.toLowerCase())
      )
    : COUNTRIES

  const errMsg = !phoneValid && localDigits
    ? t('settings.phoneInvalid', { defaultValue: 'Número inválido para este país' })
    : ''

  return (
    <div style={{ position: 'relative' }} ref={dropRef}>
      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'stretch' }}>

        {/* ── Selector de país ── */}
        <button
          type="button"
          onClick={() => setDropOpen(d => !d)}
          aria-label="Select country"
          style={{
            display: 'flex', alignItems: 'center', gap: '.375rem',
            padding: '0 .75rem', borderRadius: 'var(--r-md)',
            border: `1.5px solid ${dropOpen ? 'var(--primary)' : 'var(--border)'}`,
            background: 'var(--surface)', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '.875rem', fontWeight: 600,
            color: 'var(--text)', whiteSpace: 'nowrap', minHeight: 42, flexShrink: 0,
            transition: 'border-color var(--trans)',
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>{country.flag}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '.8rem' }}>{country.dial}</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            style={{ color: 'var(--text-faint)', transform: dropOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* ── Campo de número ── */}
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="tel"
            inputMode="numeric"
            className={`form-input${!phoneValid && localDigits ? ' input-error' : ''}`}
            value={localDigits}
            onChange={handleNumberChange}
            maxLength={20}
            placeholder={t('settings.phonePlaceholder', { defaultValue: '11 98888 0000' })}
            autoComplete="tel-national"
            style={{ paddingRight: localDigits ? '2rem' : undefined }}
          />
          {/* Ícone de validade */}
          {localDigits && (
            <span style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              fontSize: '.9rem', color: phoneValid ? 'var(--success)' : 'var(--err)',
              pointerEvents: 'none',
            }}>
              {phoneValid ? '✓' : '✗'}
            </span>
          )}
        </div>
      </div>

      {/* Mensagem de erro */}
      {errMsg && (
        <p style={{ fontSize: '.72rem', color: 'var(--err)', marginTop: '.25rem', marginLeft: 0 }}>
          {errMsg}
        </p>
      )}

      {/* ── Dropdown de países ── */}
      {dropOpen && (
        <div style={{
          position: 'absolute', top: '110%', left: 0,
          width: 280, maxHeight: 280,
          background: 'var(--surface)', border: '1.5px solid var(--border)',
          borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-lg)', zIndex: 200,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Search */}
          <div style={{ padding: '.5rem .75rem', borderBottom: '1px solid var(--divider)' }}>
            <input
              ref={searchRef}
              className="form-input"
              placeholder={t('btn.loading', { defaultValue: 'Buscar país…' })}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ height: 34, fontSize: '.8125rem' }}
            />
          </div>
          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '.8125rem' }}>
                —
              </div>
            ) : filtered.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleCountrySelect(c)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '.625rem',
                  width: '100%', padding: '.5rem .875rem',
                  background: c.code === country.code ? 'var(--primary-hl)' : 'transparent',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: '.8125rem', textAlign: 'left',
                  color: c.code === country.code ? 'var(--primary)' : 'var(--text)',
                  fontWeight: c.code === country.code ? 700 : 400,
                  transition: 'background 100ms',
                }}
              >
                <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{c.flag}</span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.name}
                </span>
                <span style={{ color: 'var(--text-faint)', fontSize: '.75rem', flexShrink: 0 }}>
                  {c.dial}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// CITY AUTOCOMPLETE (Nominatim / OpenStreetMap — sem API key)
// ═══════════════════════════════════════════════════════════════════

interface CityResult { display: string; city: string; country: string }

interface CityAutocompleteProps {
  value: string
  onChange: (city: string) => void
  placeholder?: string
  lang: string
}

function CityAutocomplete({ value, onChange, placeholder, lang }: CityAutocompleteProps) {
  const [query,    setQuery]    = useState(value)
  const [results,  setResults]  = useState<CityResult[]>([])
  const [open,     setOpen]     = useState(false)
  const [fetching, setFetching] = useState(false)
  const timerRef  = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const wrapRef   = useRef<HTMLDivElement>(null)

  // Sync quando o valor externo muda (ex: discard)
  useEffect(() => { setQuery(value) }, [value])

  // Fecha ao clicar fora
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setOpen(false); return }
    setFetching(true)
    try {
      const url =
        `https://nominatim.openstreetmap.org/search` +
        `?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1`
      const res  = await fetch(url, {
        headers: {
          'Accept-Language': lang,
          'User-Agent':       'PitutiApp/1.0 (contact@pituti.app)',
        },
      })
      const data: any[] = await res.json()
      const cities = data
        .filter(d => ['city', 'town', 'village', 'municipality', 'administrative'].includes(d.type))
        .slice(0, 6)
        .map(d => ({
          display: d.display_name,
          city:    d.address?.city ?? d.address?.town ?? d.address?.village ?? d.name ?? '',
          country: d.address?.country ?? '',
        }))
        .filter((c, i, arr) => arr.findIndex(x => x.city === c.city && x.country === c.country) === i)
      setResults(cities)
      setOpen(cities.length > 0)
    } catch { setResults([]) }
    setFetching(false)
  }, [lang])

  const handleChange = (v: string) => {
    setQuery(v)
    onChange(v)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => search(v), 420)
  }

  const handleSelect = (item: CityResult) => {
    const label = item.country ? `${item.city}, ${item.country}` : item.city
    setQuery(label)
    onChange(label)
    setOpen(false)
    setResults([])
  }

  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); setResults([]) }
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          className="form-input"
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={open}
        />
        {fetching && (
          <span style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            fontSize: '.8rem', color: 'var(--text-faint)', animation: 'spin 1s linear infinite',
          }}>
            ⏳
          </span>
        )}
      </div>

      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: 'var(--surface)', border: '1.5px solid var(--border)',
          borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-lg)', zIndex: 200,
          overflow: 'hidden',
        }}>
          {results.map((r, i) => (
            <button
              key={i}
              type="button"
              onMouseDown={() => handleSelect(r)}
              style={{
                display: 'flex', alignItems: 'center', gap: '.5rem',
                width: '100%', padding: '.5rem .875rem',
                background: 'transparent', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit',
                fontSize: '.8375rem', textAlign: 'left', transition: 'background 100ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--primary-hl)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ flexShrink: 0, color: 'var(--text-muted)' }}>📍</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{r.city}</span>
              {r.country && (
                <span style={{ color: 'var(--text-faint)', fontSize: '.75rem', marginLeft: 'auto', flexShrink: 0 }}>
                  {r.country}
                </span>
              )}
            </button>
          ))}
          <div style={{
            fontSize: '.65rem', color: 'var(--text-faint)', textAlign: 'right',
            padding: '.2rem .75rem .4rem', borderTop: '1px solid var(--divider)',
          }}>
            © OpenStreetMap contributors
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// HELPERS — Layout sub-components
// ═══════════════════════════════════════════════════════════════════

function Toggle({ initial = true }: { initial?: boolean }) {
  const [on, setOn] = useState(initial)
  return (
    <button
      type="button" role="switch" aria-checked={on}
      onClick={() => setOn(v => !v)}
      style={{
        width: 40, height: 22, borderRadius: 99,
        background: on ? 'var(--primary)' : 'var(--border)',
        cursor: 'pointer', position: 'relative', flexShrink: 0,
        transition: 'background 200ms', border: 'none', padding: 0,
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 3, left: on ? 21 : 3,
        transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
      }} />
    </button>
  )
}

function LanguageSelector({ userId }: { userId: string }) {
  const { i18n } = useTranslation()
  const langs = [
    { code: 'es', flag: '🇪🇸', label: 'Español'   },
    { code: 'en', flag: '🇬🇧', label: 'English'   },
    { code: 'pt', flag: '🇧🇷', label: 'Português' },
  ]
  const handleSelect = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('lang', code)
    // FIX (sync): antes só ficava em localStorage — nunca chegava ao
    // servidor, por isso mudar de idioma num aparelho nunca refletia no
    // outro. Falha de rede aqui não é grave: o idioma já mudou localmente.
    if (userId) {
      usersApi.update(userId, { language: code }).catch(err => {
        console.warn('[LanguageSelector] falha ao sincronizar idioma:', err)
      })
    }
  }
  return (
    <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', paddingTop: '.25rem' }}>
      {langs.map(l => (
        <button
          key={l.code} type="button"
          onClick={() => handleSelect(l.code)}
          style={{
            display: 'flex', alignItems: 'center', gap: '.375rem',
            padding: '.45rem .9rem', borderRadius: 'var(--r-full)',
            border: `1.5px solid ${i18n.language === l.code ? 'var(--primary)' : 'var(--border)'}`,
            background:  i18n.language === l.code ? 'var(--primary-hl)' : 'var(--surface-offset)',
            color:       i18n.language === l.code ? 'var(--primary)'    : 'var(--text-muted)',
            fontWeight:  i18n.language === l.code ? 800 : 600,
            fontSize: '.8125rem', cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all var(--trans)',
          }}
        >
          <span style={{ fontSize: '1rem' }}>{l.flag}</span>
          {l.label}
          {i18n.language === l.code && (
            <span style={{ fontSize: '.6rem', opacity: .7 }}>✓</span>
          )}
        </button>
      ))}
    </div>
  )
}

function Card({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1.5px solid var(--border)',
      borderRadius: 'var(--r-xl)', boxShadow: 'var(--sh-xs)',
      overflow: 'hidden', ...style,
    }}>
      {children}
    </div>
  )
}

function CardHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '.75rem',
      padding: '1rem 1.5rem',
      borderBottom: '1.5px solid var(--divider)',
      background: 'var(--surface)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 'var(--r-md)',
        background: 'var(--surface-offset)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: '.9375rem', color: 'var(--text)' }}>{title}</div>
        {subtitle && (
          <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.05rem' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )
}

function CardBody({ children }: { children: ReactNode }) {
  return <div style={{ padding: '1.25rem 1.5rem' }}>{children}</div>
}

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: '.375rem',
      fontWeight: 700, fontSize: '.8125rem', color: 'var(--text)',
      marginBottom: '.375rem',
    }}>
      {label}
      {hint && (
        <span style={{ fontWeight: 400, color: 'var(--text-faint)', fontSize: '.72rem' }}>
          · {hint}
        </span>
      )}
    </label>
  )
}

function NotifRow({ label, sub, initial }: { label: string; sub: string; initial: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1rem',
      padding: '.75rem 0', borderBottom: '1px solid var(--divider)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '.875rem', color: 'var(--text)' }}>{label}</div>
        <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.15rem' }}>{sub}</div>
      </div>
      <Toggle initial={initial} />
    </div>
  )
}

function exportCSV(name: string, email: string) {
  const csv  = [['name', name], ['email', email], ['date', new Date().toLocaleString()]]
    .map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const a    = Object.assign(document.createElement('a'), {
    href:     URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })),
    download: 'pituti-data.csv',
  })
  a.click()
}

// ═══════════════════════════════════════════════════════════════════
// SETTINGS PAGE
// ═══════════════════════════════════════════════════════════════════

export default function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { user, setUser, logout } = useUser()
  const { theme, toggleTheme } = useTheme()

  const [name,        setName]        = useState(user.name     ?? '')
  const [email,       setEmail]       = useState(user.email    ?? '')
  const [phone,       setPhone]       = useState(user.phone    ?? '')
  const [phoneValid,  setPhoneValid]  = useState(true)
  const [city,        setCity]        = useState(user.city     ?? '')
  const [bio,         setBio]         = useState(user.bio      ?? '')
  const [photoUrl,    setPhotoUrl]    = useState<string | null>(user.photoUrl ?? null)
  const [saving,      setSaving]      = useState(false)
  const [saved,       setSaved]       = useState(false)
  const [deleteOpen,  setDeleteOpen]  = useState(false)
  const photoRef = useRef<HTMLInputElement>(null)

  // Sync quando o user muda (ex: após login)
  useEffect(() => {
    setName(user.name     ?? '')
    setEmail(user.email   ?? '')
    setPhone(user.phone   ?? '')
    setCity(user.city     ?? '')
    setBio(user.bio       ?? '')
    setPhotoUrl(user.photoUrl ?? null)
  }, [user])

function normalizeApiUser(apiData: Partial<{
  id: string; name: string; email: string
  photoUrl: string | null; phone: string | null; city: string | null; bio: string | null
  createdAt: string
}>, fallback: { phone: string; city: string; bio: string }) {
  return {
    ...apiData,
    phone: apiData.phone ?? fallback.phone,
    city:  apiData.city  ?? fallback.city,
    bio:   apiData.bio   ?? fallback.bio,
  }
}

function persistUserLocally(u: typeof user) {
  const key = 'pitutiuser'
  const storage = localStorage.getItem(key) || localStorage.getItem('pitutitoken')
    ? localStorage : sessionStorage
  storage.setItem(key, JSON.stringify({
    id: u.id, name: u.name, email: u.email, phone: u.phone, city: u.city, bio: u.bio, photoUrl: u.photoUrl,
  }))
}

const handlePhotoChange = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  let resized: string
  try {
    resized = await resizeImageToDataUrl(file)
  } catch (err) {
    console.warn('[SettingsPage] falha ao processar a foto:', err)
    showToast(t('toast.photoError', { defaultValue: 'Não foi possível processar a foto' }), 'err')
    return
  }

  const nextUser = { ...user, photoUrl: resized }
  setPhotoUrl(resized)
  setUser(nextUser)
  try {
    persistUserLocally(nextUser)
  } catch (err) {
    console.warn('[SettingsPage] falha ao gravar a foto localmente (quota?):', err)
    showToast(t('toast.storageError', { defaultValue: 'A foto é demasiado grande para guardar neste aparelho' }), 'err')
    return
  }
  showToast(t('toast.changesSaved'))

  // A foto é a ÚNICA chamada que envia photoUrl — handleSave nunca a reenvia
  if (user.id) {
    try {
      const res = await usersApi.update(user.id, { photoUrl: resized })
      const merged = { ...nextUser, ...normalizeApiUser(res?.data ?? {}, { phone, city, bio }) }
      setUser(merged)
      persistUserLocally(merged)
    } catch (err) {
      console.warn('[SettingsPage] foto guardada só localmente, falhou a sincronizar:', err)
      showToast(t('toast.syncError', { defaultValue: 'Guardado neste aparelho, mas falhou ao sincronizar com o servidor' }), 'err')
    }
  }
}

const handleSave = async () => {
  if (!name.trim()) return
  setSaving(true)

  const updated = { ...user, name: name.trim(), email, phone, city, bio, photoUrl, avatar: deriveAvatar(name.trim()) }

  setUser(updated)
  try {
    persistUserLocally(updated)
  } catch (err) {
    console.warn('[SettingsPage] falha ao gravar localmente (quota?):', err)
    showToast(t('toast.storageError', { defaultValue: 'Não foi possível guardar neste aparelho (espaço insuficiente)' }), 'err')
    setSaving(false)
    return
  }
  setSaved(true)
  showToast(t('toast.changesSaved'))
  setTimeout(() => setSaved(false), 3000)

  try {
    if (user.id) {
      // FIX: NÃO envia photoUrl aqui — já foi sincronizada em handlePhotoChange.
      // Reenviá-la (potencialmente vários KB/MB em base64) tornava este pedido
      // extremamente lento em rede móvel (~60s), parecendo que o botão não
      // respondia.
      const res = await usersApi.update(user.id, {
        name: name.trim(),
        phone: phone || null,
        bio: bio || null,
        city: city || null,
      })
      const merged = { ...updated, ...normalizeApiUser(res?.data ?? {}, { phone, city, bio }) }
      setUser(merged)
      persistUserLocally(merged)
    }
  } catch (err) {
    console.warn('[SettingsPage] alterações guardadas só localmente, falhou a sincronizar:', err)
    showToast(t('toast.syncError', { defaultValue: 'Guardado neste aparelho, mas falhou ao sincronizar com o servidor' }), 'err')
  } finally {
    setSaving(false)
  }
}


  const handleDiscard = () => {
    setName(user.name ?? ''); setEmail(user.email ?? '')
    setPhone(user.phone ?? ''); setCity(user.city ?? '')
    setBio(user.bio ?? ''); setPhotoUrl(user.photoUrl ?? null)
  }

  const handleDeleteAccount = () => {
    setDeleteOpen(false)
    showToast(t('settings.deleteToast', { defaultValue: 'Goodbye.' }), 'err')
    setTimeout(() => { try { localStorage.clear(); sessionStorage.clear() } catch {} ; window.location.href = '/login' }, 2000)
  }

  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <BackButton />

      {/* ── Page header ── */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">{t('settings.title')}</h1>
          <p className="page-subtitle">{t('settings.subtitle')}</p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          HERO — Avatar + nome + logout
      ══════════════════════════════════════════════════ */}
      <Card style={{ marginBottom: '1.25rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1.25rem',
          padding: '1.5rem',
          background: 'linear-gradient(130deg, var(--primary-hl) 0%, var(--surface) 65%)',
          flexWrap: 'wrap',
        }}>
          {/* Avatar */}
          <div
            style={{ position: 'relative', flexShrink: 0, cursor: 'pointer' }}
            onClick={() => photoRef.current?.click()}
            title={t('settings.changePhoto')}
          >
            <div style={{
              width: 80, height: 80, borderRadius: '50%', overflow: 'hidden',
              border: '3px solid var(--primary)',
              boxShadow: '0 0 0 4px var(--primary-hl)',
              background: 'var(--surface-offset)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)',
            }}>
              {photoUrl
                ? <img src={photoUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                : <span>{initials || '🐾'}</span>}
            </div>
            <div style={{
              position: 'absolute', bottom: 1, right: 1,
              width: 24, height: 24, borderRadius: '50%',
              background: 'var(--primary)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '.65rem', border: '2px solid var(--surface)',
              boxShadow: '0 1px 4px rgba(0,0,0,.2)',
            }}>📷</div>
            <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 140 }}>
            <div style={{ fontWeight: 800, fontSize: '1.1875rem', color: 'var(--text)', lineHeight: 1.2 }}>
              {name || t('settings.fullNamePlaceholder')}
            </div>
            <div style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginTop: '.2rem' }}>{email}</div>
            {(city || phone) && (
              <div style={{ fontSize: '.75rem', color: 'var(--text-faint)', marginTop: '.2rem' }}>
                {city && `📍 ${city}`}{city && phone && ' · '}{phone && `📱 ${phone}`}
              </div>
            )}
            <div style={{ display: 'flex', gap: '.375rem', marginTop: '.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-green" style={{ fontSize: '.7rem' }}>
                ✓ {t('settings.activeAccount', { defaultValue: 'Active account' })}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button" onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: '.375rem',
              padding: '.45rem 1rem', borderRadius: 'var(--r-full)',
              border: '1.5px solid var(--border)', background: 'var(--surface)',
              color: 'var(--text-muted)', fontWeight: 600, fontSize: '.8125rem',
              cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
              transition: 'all var(--trans)',
            }}
          >
            🚪 {t('settings.logout', { defaultValue: 'Sign out' })}
          </button>
        </div>
      </Card>

      {/* ══════════════════════════════════════════════════
          DADOS PESSOAIS
      ══════════════════════════════════════════════════ */}
      <Card style={{ marginBottom: '1.25rem' }}>
        <CardHeader
          icon="👤"
          title={t('settings.personalData')}
          subtitle={t('settings.personalSubtitle')}
        />
        <CardBody>
          {/* Nome */}
          <div style={{ marginBottom: '1.125rem' }}>
            <FieldLabel label={t('settings.fullName')} />
            <input
              className="form-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('settings.fullNamePlaceholder')}
              autoComplete="name"
              maxLength={80}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.125rem' }}>
            <FieldLabel label={t('settings.email')} />
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              autoComplete="email"
            />
          </div>

          {/* Telefone */}
          <div style={{ marginBottom: '1.125rem' }}>
            <FieldLabel
              label={t('settings.phone')}
              hint={t('btn.optional', { defaultValue: 'optional' })}
            />
            <PhoneInput
              value={phone}
              onChange={(e164, valid) => { setPhone(e164); setPhoneValid(valid) }}
            />
          </div>

          {/* Cidade */}
          <div style={{ marginBottom: '1.125rem' }}>
            <FieldLabel
              label={t('settings.city', { defaultValue: 'City' })}
              hint={t('btn.optional', { defaultValue: 'optional' })}
            />
            <CityAutocomplete
              value={city}
              onChange={setCity}
              placeholder={t('settings.cityPlaceholder', { defaultValue: 'Start typing…' })}
              lang={i18n.language}
            />
          </div>

          {/* Bio */}
          <div>
            <FieldLabel
              label={t('settings.about')}
              hint={t('btn.optional', { defaultValue: 'optional' })}
            />
            <textarea
              className="form-input"
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value.slice(0, 300))}
              placeholder={t('settings.aboutPlaceholder')}
              style={{ resize: 'vertical', minHeight: 72, fontFamily: 'inherit', lineHeight: 1.5 }}
            />
            <div style={{ fontSize: '.7rem', color: bio.length > 270 ? 'var(--warn)' : 'var(--text-faint)', textAlign: 'right', marginTop: '.2rem' }}>
              {bio.length} / 300
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ══════════════════════════════════════════════════
          IDIOMA + APARÊNCIA (2 colunas)
      ══════════════════════════════════════════════════ */}
      <div className="settings-2col" style={{ marginBottom: '1.25rem' }}>
        <Card>
          <CardHeader icon="🌍" title={t('settings.language')} />
          <CardBody>
            <LanguageSelector userId={user.id} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader icon="🎨" title={t('settings.appearance', { defaultValue: 'Appearance' })} subtitle={t('settings.themeHint')} />
          <CardBody>
            <p style={{ fontSize: '.8125rem', color: 'var(--text-muted)', marginBottom: '.75rem' }}>
              {t('settings.theme')}
            </p>
<div style={{ display: 'flex', gap: '.5rem' }}>
  {(['light', 'dark'] as const).map((mode, i) => {
    const icon = i === 0 ? '☀️' : '🌙'
    const active = theme === mode
    return (
      <button
        key={mode} type="button"
        onClick={() => { if (theme !== mode) toggleTheme() }}
        style={{
          flex: 1, padding: '.6rem', borderRadius: 'var(--r-lg)',
          border: `1.5px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
          background: active ? 'var(--primary-hl)' : 'var(--surface)',
          cursor: 'pointer', fontSize: '1.25rem', transition: 'all var(--trans)',
        }}
      >
        {icon}
      </button>
    )
  })}
</div>
          </CardBody>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════
          NOTIFICAÇÕES
      ══════════════════════════════════════════════════ */}
      <Card style={{ marginBottom: '1.25rem' }}>
        <CardHeader icon="🔔" title={t('settings.notifications')} />
        <CardBody>
          <NotifRow label={t('settings.vaccineAlert')}  sub={t('settings.vaccineAlertHint')}  initial={true}  />
          <NotifRow label={t('settings.medAlert')}      sub={t('settings.medAlertHint')}      initial={true}  />
          <NotifRow label={t('settings.symptomAlert')}  sub={t('settings.symptomAlertHint')}  initial={true}  />
          <NotifRow label={t('settings.weeklyDigest')}  sub={t('settings.weeklyDigestHint')}  initial={false} />
          <NotifRow label={t('settings.urgentAlerts')}  sub={t('settings.urgentAlertsHint')}  initial={true}  />
        </CardBody>
      </Card>

      {/* ══════════════════════════════════════════════════
          DADOS & PRIVACIDADE
      ══════════════════════════════════════════════════ */}
      <Card style={{ marginBottom: '2rem' }}>
        <CardHeader icon="🔒" title={t('settings.dangerZone', { defaultValue: 'Data & Privacy' })} />
        <CardBody>
          <div className="settings-2col settings-2col--tight">
            <div style={{
              padding: '1rem', borderRadius: 'var(--r-lg)',
              background: 'var(--surface-offset)', border: '1.5px solid var(--border)',
            }}>
              <div style={{ fontWeight: 700, fontSize: '.875rem', marginBottom: '.375rem' }}>
                📦 {t('settings.exportData')}
              </div>
              <p style={{ fontSize: '.775rem', color: 'var(--text-muted)', marginBottom: '.75rem', lineHeight: 1.4 }}>
                {t('settings.exportHint')}
              </p>
              <button type="button" className="btn btn-secondary" style={{ width: '100%', fontSize: '.8125rem' }}
                onClick={() => exportCSV(name, email)}>
                ⬇ {t('settings.exportBtn')}
              </button>
            </div>
            <div style={{
              padding: '1rem', borderRadius: 'var(--r-lg)',
              background: 'var(--err-hl)', border: '1.5px solid color-mix(in oklab, var(--err) 20%, transparent)',
            }}>
              <div style={{ fontWeight: 700, fontSize: '.875rem', marginBottom: '.375rem', color: 'var(--err)' }}>
                🗑 {t('settings.deleteAccount')}
              </div>
              <p style={{ fontSize: '.775rem', color: 'var(--text-muted)', marginBottom: '.75rem', lineHeight: 1.4 }}>
                {t('settings.deleteHint')}
              </p>
              <button type="button" className="btn btn-ghost" style={{ width: '100%', fontSize: '.8125rem', color: 'var(--err)', borderColor: 'var(--err)' }}
                onClick={() => setDeleteOpen(true)}>
                {t('settings.deleteBtn')}
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* ══════════════════════════════════════════════════
          SAVE BAR
      ══════════════════════════════════════════════════ */}
      <div style={{
        display: 'flex', gap: '.75rem', justifyContent: 'flex-end',
        paddingBottom: '3rem',
      }}>
        <button type="button" className="btn btn-secondary" onClick={handleDiscard} disabled={saving}>
          {t('btn.discard')}
        </button>
        <button
          type="button" className="btn btn-primary" onClick={handleSave}
          disabled={saving || !name.trim()}
          style={{ minWidth: 148 }}
        >
          {saving
            ? t('settings.saving', { defaultValue: 'Saving…' })
            : saved
            ? `✓ ${t('settings.saved')}`
            : t('btn.saveChanges')}
        </button>
      </div>

      <DeleteAccountModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={handleDeleteAccount} />
    </div>
  )

}
