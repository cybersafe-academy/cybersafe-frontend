import { createI18n } from 'vue-i18n'

export default createI18n({
  locale: import.meta.env.VUE_APP_I18N_LOCALE || 'pt',
  fallbackLocale: import.meta.env.VUE_APP_I18N_FALLBACK_LOCALE || 'pt',
  messages: {
    en: (await import("./locales/en.json")),
    pt: (await import("./locales/pt.json"))
  }
})
