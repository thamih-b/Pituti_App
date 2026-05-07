import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import i18n from '../i18n/i18n'
import type { Lang } from '../i18n/locales/types'

interface LanguageContextValue {
  lang:    Lang
  setLang: (l: Lang) => void
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es', setLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(
    () => (localStorage.getItem('lang') as Lang) ?? 'es'
  )

  const setLang = (l: Lang) => {
    setLangState(l)
    i18n.changeLanguage(l)
    localStorage.setItem('lang', l)
  }

  useEffect(() => {
    i18n.changeLanguage(lang)
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)