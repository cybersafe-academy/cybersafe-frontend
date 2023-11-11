import { createI18n } from 'vue-i18n'

import en from '@/locales/en.json'
import pt from '@/locales/pt.json'

export default createI18n({
  locale: import.meta.env.VUE_APP_I18N_LOCALE || 'pt',
  fallbackLocale: import.meta.env.VUE_APP_I18N_FALLBACK_LOCALE || 'pt',
  warnHtmlInMessage: false,
  messages: {
    en: en,
    pt: pt
  }
})
