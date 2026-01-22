import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEn from 'element-ui/lib/locale/lang/en'
import elementZh from 'element-ui/lib/locale/lang/zh-CN'
import { getI18nMessages } from '@/api/i18n'

import en from './en'
import zh from './zh'

Vue.use(VueI18n)

const DEFAULT_LANG = 'zh'
const locale = Cookies.get('language') || DEFAULT_LANG

const messages = {
  en: { ...elementEn, ...en },
  zh: { ...elementZh, ...zh }
}

const i18n = new VueI18n({
  locale,
  fallbackLocale: DEFAULT_LANG,
  messages
})

export async function loadLocaleMessages(lang) {
  try {
    const response = await getI18nMessages(lang)
    if (response && response.data) {
      i18n.mergeLocaleMessage(lang, response.data)
    }
  } catch (error) {
    console.warn('Failed to load i18n messages:', error)
  }
}

export async function setLanguage(lang) {
  Cookies.set('language', lang)
  await loadLocaleMessages(lang)
  i18n.locale = lang
}

export default i18n
