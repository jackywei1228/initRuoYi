import { create } from 'zustand'
import { getRouters } from '@/api/menu'
import { buildRoutesFromServer, buildMenuFromServer } from '@/router/utils.jsx'

export const usePermissionStore = create((set) => ({
  routes: [],
  sidebarRouters: [],
  topbarRouters: [],
  defaultRoutes: [],
  generateRoutes: async () => {
    const res = await getRouters()
    const serverRoutes = res.data || []
    const appRoutes = buildRoutesFromServer(serverRoutes, { useLayout: false })
    const menuRoutes = buildMenuFromServer(serverRoutes)
    set({
      routes: appRoutes,
      sidebarRouters: menuRoutes,
      topbarRouters: menuRoutes,
      defaultRoutes: menuRoutes
    })
    return appRoutes
  }
}))
