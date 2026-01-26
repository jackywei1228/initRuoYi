import { create } from 'zustand'
import Cookies from 'js-cookie'

export const useAppStore = create((set, get) => ({
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false,
    hide: false
  },
  device: 'desktop',
  size: Cookies.get('size') || 'middle',
  toggleSideBar: () => {
    const state = get()
    if (state.sidebar.hide) {
      return
    }
    const opened = !state.sidebar.opened
    Cookies.set('sidebarStatus', opened ? 1 : 0)
    set({ sidebar: { ...state.sidebar, opened, withoutAnimation: false } })
  },
  closeSideBar: (withoutAnimation = false) => {
    Cookies.set('sidebarStatus', 0)
    set({ sidebar: { ...get().sidebar, opened: false, withoutAnimation } })
  },
  toggleDevice: (device) => {
    set({ device })
  },
  setSize: (size) => {
    Cookies.set('size', size)
    set({ size })
  },
  toggleSideBarHide: (status) => {
    set({ sidebar: { ...get().sidebar, hide: status } })
  }
}))
