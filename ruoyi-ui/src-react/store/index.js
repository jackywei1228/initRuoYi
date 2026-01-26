export { useUserStore } from './modules/user'
export { usePermissionStore } from './modules/permission'
export { useAppStore } from './modules/app'
export { useSettingsStore } from './modules/settings'
export { useTagsViewStore } from './modules/tagsView'

import { useUserStore } from './modules/user'

export const userStore = {
  getState: useUserStore.getState,
  setState: useUserStore.setState
}
