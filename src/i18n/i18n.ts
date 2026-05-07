import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from './locales/es.json'
import en from './locales/en.json'
import pt from './locales/pt.json'

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
    pt: { translation: pt },
  },
  lng: (localStorage.getItem('lang') as string) ?? 'es',
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

/*USO NOS COMPONENTES:
import { useTranslation } from 'react-i18next'

export default function VetPage() {
  const { t } = useTranslation()

  return <h1>{t('vet.pageTitle')}</h1>
}
// Strings dinâmicas (substituição de n)

O i18next tem interpolação nativa — em vez de .replace('n', petName):
es.json
{ "notFound": { "hint": "La ruta {{path}} no existe en Pituti" } }  
 PARA:
 t('notFound.hint', { path: pathname })

*/