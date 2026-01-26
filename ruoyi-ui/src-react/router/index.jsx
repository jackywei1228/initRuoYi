import React, { Suspense, useEffect, useMemo } from 'react'
import { BrowserRouter, Navigate, useLocation, useRoutes } from 'react-router-dom'
import NProgress from 'nprogress'
import { useUserStore, usePermissionStore, useSettingsStore } from '@/store'
import BasicLayout from '@/layouts/BasicLayout'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import Error401 from '@/pages/Error401'
import Error404 from '@/pages/Error404'
import Redirect from '@/pages/Redirect'

const RequireAuth = ({ children }) => {
  const token = useUserStore(state => state.token)
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

const RouteRenderer = () => {
  const location = useLocation()
  const token = useUserStore(state => state.token)
  const generateRoutes = usePermissionStore(state => state.generateRoutes)
  const dynamicRoutes = usePermissionStore(state => state.routes)
  const setTitle = useSettingsStore(state => state.setTitle)

  useEffect(() => {
    if (token && dynamicRoutes.length === 0) {
      generateRoutes().catch(() => {})
    }
  }, [token, dynamicRoutes.length, generateRoutes])

  const routeConfig = useMemo(() => {
    const layoutChildren = [
      { index: true, element: <Dashboard />, meta: { title: '首页' } },
      { path: 'index', element: <Dashboard />, meta: { title: '首页' } },
      { path: 'redirect/:path*', element: <Redirect /> }
    ]

    return [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/401', element: <Error401 /> },
      {
        path: '/',
        element: (
          <RequireAuth>
            <BasicLayout onTitleChange={setTitle} />
          </RequireAuth>
        ),
        children: [...layoutChildren, ...dynamicRoutes]
      },
      { path: '*', element: <Error404 /> }
    ]
  }, [dynamicRoutes, setTitle])

  const routes = useRoutes(routeConfig)

  useEffect(() => {
    NProgress.configure({ showSpinner: false })
    NProgress.done()
  }, [])

  useEffect(() => {
    NProgress.start()
    NProgress.done()
  }, [location.pathname])

  return <Suspense fallback={null}>{routes}</Suspense>
}

const AppRoutes = () => (
  <BrowserRouter>
    <RouteRenderer />
  </BrowserRouter>
)

export default AppRoutes
