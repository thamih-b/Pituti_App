/**
 * i18n type augmentation — tipagem relaxada para resources.
 *
 * Com `resources: typeof es`, o i18next v23 gera um union de chaves somente
 * na forma prefixada "translation:cares.add.recDaily", recusando as chamadas
 * t('cares.add.recDaily') usadas em toda a aplicação (TS2345).
 *
 * Solução: manter o augmentation correto do módulo mas usar
 * Record<string, unknown> para resources, o que deixa t() aceitar qualquer
 * string sem quebrar os exports reais de i18next (use, TFunction, etc).
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    returnNull: false
    resources: {
      translation: Record<string, unknown>
    }
  }
}
