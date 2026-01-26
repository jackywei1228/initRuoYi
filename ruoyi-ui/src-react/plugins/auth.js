import { useUserStore } from '@/store'

function authPermission(permission) {
  const all_permission = '*:*:*'
  const permissions = useUserStore.getState().permissions
  if (permission && permission.length > 0) {
    return permissions.some(v => all_permission === v || v === permission)
  }
  return false
}

function authRole(role) {
  const super_admin = 'admin'
  const roles = useUserStore.getState().roles
  if (role && role.length > 0) {
    return roles.some(v => super_admin === v || v === role)
  }
  return false
}

export default {
  // 验证用户是否具备某权限
  hasPermi(permission) {
    return authPermission(permission)
  },
  // 验证用户是否含有指定权限，只需包含其中一个
  hasPermiOr(permissions) {
    return permissions.some(item => authPermission(item))
  },
  // 验证用户是否含有指定权限，必须全部拥有
  hasPermiAnd(permissions) {
    return permissions.every(item => authPermission(item))
  },
  // 验证用户是否具备某角色
  hasRole(role) {
    return authRole(role)
  },
  // 验证用户是否含有指定角色，只需包含其中一个
  hasRoleOr(roles) {
    return roles.some(item => authRole(item))
  },
  // 验证用户是否含有指定角色，必须全部拥有
  hasRoleAnd(roles) {
    return roles.every(item => authRole(item))
  }
}
