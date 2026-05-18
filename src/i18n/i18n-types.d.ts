/**
 * i18next augmentation — DEVE ter export {} para ser tratado como
 * module augmentation e não como module re-declaration.
 *
 * Sem o export {}, TypeScript SUBSTITUI toda a declaração do módulo
 * i18next, apagando TFunction, .use(), .changeLanguage e outros exports.
 *
 * Com resources: { translation: Record<string, unknown> }, o t() aceita
 * qualquer string sem o union estrito "translation:key.path" gerado pelo
 * typeof es, resolvendo todos os TS2345 nos componentes.
 */
export {}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    returnNull: false
    resources: {
      translation: Record<string, unknown>
    }
  }
}
