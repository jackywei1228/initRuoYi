import { create } from 'zustand'

export const useTagsViewStore = create((set, get) => ({
  visitedViews: [],
  cachedViews: [],
  iframeViews: [],
  addIframeView: (view) => {
    if (get().iframeViews.some(v => v.path === view.path)) return
    set({ iframeViews: [...get().iframeViews, { ...view, title: view.meta?.title || 'no-name' }] })
  },
  addVisitedView: (view) => {
    if (get().visitedViews.some(v => v.path === view.path)) return
    set({ visitedViews: [...get().visitedViews, { ...view, title: view.meta?.title || 'no-name' }] })
  },
  addCachedView: (view) => {
    if (get().cachedViews.includes(view.name)) return
    if (view.meta && !view.meta.noCache) {
      set({ cachedViews: [...get().cachedViews, view.name] })
    }
  },
  delVisitedView: (view) => {
    set({
      visitedViews: get().visitedViews.filter(v => v.path !== view.path),
      iframeViews: get().iframeViews.filter(v => v.path !== view.path)
    })
  },
  delIframeView: (view) => {
    set({ iframeViews: get().iframeViews.filter(v => v.path !== view.path) })
  },
  delCachedView: (view) => {
    set({ cachedViews: get().cachedViews.filter(v => v !== view.name) })
  },
  delOthersVisitedViews: (view) => {
    set({
      visitedViews: get().visitedViews.filter(v => v.meta?.affix || v.path === view.path),
      iframeViews: get().iframeViews.filter(v => v.path === view.path)
    })
  },
  delOthersCachedViews: (view) => {
    const index = get().cachedViews.indexOf(view.name)
    set({ cachedViews: index > -1 ? get().cachedViews.slice(index, index + 1) : [] })
  },
  delAllVisitedViews: () => {
    const affixTags = get().visitedViews.filter(tag => tag.meta?.affix)
    set({ visitedViews: affixTags, iframeViews: [] })
  },
  delAllCachedViews: () => {
    set({ cachedViews: [] })
  },
  updateVisitedView: (view) => {
    set({ visitedViews: get().visitedViews.map(v => (v.path === view.path ? { ...v, ...view } : v)) })
  },
  delRightTags: (view) => {
    const index = get().visitedViews.findIndex(v => v.path === view.path)
    if (index === -1) return
    const nextVisited = get().visitedViews.filter((item, idx) => idx <= index || item.meta?.affix)
    const cachedSet = new Set(get().cachedViews)
    nextVisited.forEach(item => cachedSet.delete(item.name))
    set({ visitedViews: nextVisited, cachedViews: Array.from(cachedSet) })
  },
  delLeftTags: (view) => {
    const index = get().visitedViews.findIndex(v => v.path === view.path)
    if (index === -1) return
    const nextVisited = get().visitedViews.filter((item, idx) => idx >= index || item.meta?.affix)
    const cachedSet = new Set(get().cachedViews)
    nextVisited.forEach(item => cachedSet.delete(item.name))
    set({ visitedViews: nextVisited, cachedViews: Array.from(cachedSet) })
  }
}))
