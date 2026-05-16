/**
 * i18next type augmentation — sem strict key enforcement.
 *
 * O i18next v23 com `resources: typeof es` gera apenas a forma prefixada
 * "translation:key.path" no union de tipos, recusando as chamadas sem prefixo
 * `t('key.path')` que são usadas em toda a aplicação.
 *
 * Removemos `resources` do CustomTypeOptions para que t() aceite string
 * genérico e o build não falhe com TS2345 em cada componente.
 *
 * O comportamento em runtime não muda — i18next ainda usa os JSONs de locales
 * carregados em i18n.ts.
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    returnNull: false
  }
}