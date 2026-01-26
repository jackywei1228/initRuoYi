import React, { useMemo } from 'react'
import { Layout, Menu, Dropdown, Avatar, Breadcrumb, Space, Typography } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  SettingOutlined,
  AppstoreOutlined,
  SafetyOutlined,
  ToolOutlined,
  ProfileOutlined
} from '@ant-design/icons'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { useAppStore, usePermissionStore, useUserStore } from '@/store'
import logo from '@/assets/logo/logo.png'
import './BasicLayout.scss'

const { Header, Sider, Content } = Layout

const iconMap = {
  dashboard: <DashboardOutlined />,
  system: <SettingOutlined />,
  monitor: <SafetyOutlined />,
  tool: <ToolOutlined />,
  user: <UserOutlined />,
  component: <AppstoreOutlined />,
  log: <ProfileOutlined />
}

const getMenuItems = (routes) => {
  return (routes || []).map((route) => {
    const iconKey = route.meta?.icon
    const item = {
      key: route.path,
      icon: iconMap[iconKey] || undefined,
      label: route.meta?.title || route.name || route.path
    }
    if (route.children && route.children.length > 0) {
      item.children = getMenuItems(route.children)
    }
    return item
  })
}

const findRouteChain = (routes, pathname) => {
  for (const route of routes || []) {
    if (route.path === pathname) return [route]
    if (route.children && route.children.length) {
      const childChain = findRouteChain(route.children, pathname)
      if (childChain.length) return [route, ...childChain]
    }
  }
  return []
}

const BasicLayout = ({ onTitleChange }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const sidebarRouters = usePermissionStore(state => state.sidebarRouters)
  const { sidebar, toggleSideBar } = useAppStore(state => ({
    sidebar: state.sidebar,
    toggleSideBar: state.toggleSideBar
  }))
  const user = useUserStore(state => ({
    name: state.name,
    nickName: state.nickName,
    avatar: state.avatar,
    logout: state.logout
  }))

  const menuItems = useMemo(() => getMenuItems(sidebarRouters), [sidebarRouters])
  const breadcrumbChain = useMemo(() => findRouteChain(sidebarRouters, location.pathname), [sidebarRouters, location.pathname])

  const title = breadcrumbChain[breadcrumbChain.length - 1]?.meta?.title
  if (title && onTitleChange) {
    onTitleChange(title)
  }

  const handleMenuClick = ({ key }) => {
    navigate(key)
  }

  const handleLogout = async () => {
    await user.logout()
    navigate('/login')
  }

  const userMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
      { key: 'logout', icon: <LogoutOutlined />, label: '退出登录' }
    ],
    onClick: ({ key }) => {
      if (key === 'profile') {
        navigate('/user/profile')
      } else if (key === 'logout') {
        handleLogout()
      }
    }
  }

  return (
    <Layout className="ruoyi-layout">
      <Sider
        collapsible
        collapsed={!sidebar.opened}
        trigger={null}
        width={220}
        className="ruoyi-sider"
      >
        <div className="ruoyi-logo">
          <img src={logo} alt="logo" />
          {!sidebar.opened ? null : <Typography.Text>JK管理系统</Typography.Text>}
        </div>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header className="ruoyi-header">
          <div className="ruoyi-header-left">
            {sidebar.opened ? (
              <MenuFoldOutlined onClick={toggleSideBar} />
            ) : (
              <MenuUnfoldOutlined onClick={toggleSideBar} />
            )}
            <Breadcrumb className="ruoyi-breadcrumb">
              {breadcrumbChain.map((item) => (
                <Breadcrumb.Item key={item.path}>{item.meta?.title || item.name}</Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </div>
          <div className="ruoyi-header-right">
            <Dropdown menu={userMenu} placement="bottomRight">
              <Space className="ruoyi-user">
                <Avatar src={user.avatar} icon={<UserOutlined />} />
                <span>{user.nickName || user.name}</span>
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content className="ruoyi-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default BasicLayout
