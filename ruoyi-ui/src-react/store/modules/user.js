import { create } from 'zustand'
import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { isHttp, isEmpty } from '@/utils/validate'
import defAva from '@/assets/images/profile.jpg'
import { Modal } from 'antd'

export const useUserStore = create((set, get) => ({
  token: getToken(),
  id: '',
  name: '',
  nickName: '',
  avatar: '',
  roles: [],
  permissions: [],
  login: async (userInfo) => {
    const username = userInfo.username.trim()
    const password = userInfo.password
    const code = userInfo.code
    const uuid = userInfo.uuid
    const res = await login(username, password, code, uuid)
    setToken(res.token)
    set({ token: res.token })
  },
  getInfo: async () => {
    const res = await getInfo()
    const user = res.user
    let avatar = user.avatar || ''
    if (!isHttp(avatar)) {
      avatar = isEmpty(avatar) ? defAva : process.env.VUE_APP_BASE_API + avatar
    }
    if (res.roles && res.roles.length > 0) {
      set({ roles: res.roles, permissions: res.permissions || [] })
    } else {
      set({ roles: ['ROLE_DEFAULT'], permissions: [] })
    }
    set({
      id: user.userId,
      name: user.userName,
      nickName: user.nickName,
      avatar
    })
    if (res.isDefaultModifyPwd) {
      Modal.confirm({
        title: '安全提示',
        content: '您的密码还是初始密码，请修改密码！',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          window.location.href = '/user/profile?activeTab=resetPwd'
        }
      })
    }
    if (!res.isDefaultModifyPwd && res.isPasswordExpired) {
      Modal.confirm({
        title: '安全提示',
        content: '您的密码已过期，请尽快修改密码！',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          window.location.href = '/user/profile?activeTab=resetPwd'
        }
      })
    }
    return res
  },
  logout: async () => {
    await logout(get().token)
    set({ token: '', roles: [], permissions: [], id: '', name: '', nickName: '', avatar: '' })
    removeToken()
  },
  fedLogout: async () => {
    set({ token: '' })
    removeToken()
  }
}))
