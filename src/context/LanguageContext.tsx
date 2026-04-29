import {
  createContext, useContext, useState, useCallback,
  type ReactNode,
} from 'react'
import { TRANSLATIONS, LANG_LABELS, type Lang, type Translations } from '../i18n/translations'

// ── Types ────────────────────────────────────────────────────────
interface LanguageContextValue {
  lang:        Lang
  setLang:     (l: Lang) => void
  t:           Translations
  langLabel:   string
}

// ── Context ──────────────────────────────────────────────────────
const LanguageContext = createContext<LanguageContextValue | null>(null)

// ── Helpers ──────────────────────────────────────────────────────
function readStoredLang(): Lang {
  try {
    const v = localStorage.getItem('pituti-lang')
    if (v === 'es' || v === 'en' || v === 'pt') return v
  } catch { /* ignore */ }
  // Try browser language
  const browser = navigator.language.slice(0, 2).toLowerCase()
  if (browser === 'en') return 'en'
  if (browser === 'pt') return 'pt'
  return 'es'
}

function applyLangToDOM(lang: Lang) {
  document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : lang)
}

// ── Provider ─────────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const l = readStoredLang()
    applyLangToDOM(l)
    return l
  })

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    applyLangToDOM(l)
    try { localStorage.setItem('pituti-lang', l) } catch { /* ignore */ }
  }, [])

  return (
    <LanguageContext.Provider value={{
      lang,
      setLang,
      t: TRANSLATIONS[lang],
      langLabel: LANG_LABELS[lang],
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

// ── Hook ─────────────────────────────────────────────────────────
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>')
  return ctx
}

/** Convenience shortcut: returns just the translation object */
export function useT() {
  return useLanguage().t
}

export type { Lang }
