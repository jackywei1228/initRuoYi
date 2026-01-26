import React from 'react'
import BasicLayout from '@/layouts/BasicLayout'
import ParentView from '@/layouts/components/ParentView'
import InnerLink from '@/layouts/components/InnerLink'
import Placeholder from '@/pages/Placeholder'

const pageModules = import.meta.glob('../pages/**/*.jsx')

const normalizeComponentPath = (component) => component?.replace(/^\/+/, '').replace(/\/+$/, '')

const resolvePage = (component) => {
  const clean = normalizeComponentPath(component)
  if (!clean) return Placeholder
  const candidate = `../pages/${clean}.jsx`
  if (pageModules[candidate]) {
    return React.lazy(pageModules[candidate])
  }
  return Placeholder
}

export const resolveRouteElement = (component, useLayout = true) => {
  if (component === 'Layout') return useLayout ? BasicLayout : ParentView
  if (component === 'ParentView') return ParentView
  if (component === 'InnerLink') return InnerLink
  return resolvePage(component)
}

export const buildRoutesFromServer = (routes, options = {}) => {
  const { useLayout = true } = options
  const travel = (items, parentPath = '') => {
    return (items || []).map((route) => {
      const currentPath = joinPath(parentPath, route.path)
      const Component = resolveRouteElement(route.component, useLayout)
      const children = route.children ? travel(route.children, currentPath) : undefined
      return {
        path: currentPath,
        element: Component === BasicLayout ? <BasicLayout /> : <Component />,
        children: children && children.length > 0 ? children : undefined,
        meta: route.meta || {},
        hidden: route.hidden,
        name: route.name
      }
    })
  }
  return travel(routes)
}

export const buildMenuFromServer = (routes, parentPath = '') => {
  return (routes || [])
    .filter((route) => !route.hidden)
    .map((route) => {
      const currentPath = joinPath(parentPath, route.path)
      return {
        path: currentPath,
        name: route.name,
        meta: route.meta || {},
        children: route.children ? buildMenuFromServer(route.children, currentPath) : []
      }
    })
}

export const joinPath = (parentPath, path) => {
  if (!parentPath) return path.startsWith('/') ? path : `/${path}`
  const full = `${parentPath}/${path}`.replace(/\/+/g, '/')
  return full.startsWith('/') ? full : `/${full}`
}
