import { useSettingsStore } from '@/store'
import defaultSettings from '@/settings'

/**
 * 动态修改标题
 */
export function useDynamicTitle() {
  const settings = useSettingsStore.getState()
  if (settings.dynamicTitle) {
    document.title = settings.title + ' - ' + defaultSettings.title
  } else {
    document.title = defaultSettings.title
  }
}
