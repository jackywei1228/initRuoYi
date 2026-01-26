import request from '@/utils/request'

export const getI18nMessages = (lang) => {
  return request({
    url: '/system/i18n/messages',
    method: 'get',
    params: { lang }
  })
}
