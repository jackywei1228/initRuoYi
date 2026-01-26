import { useUserStore } from '@/store'

/**
 * 字符权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkPermi(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissions = useUserStore.getState().permissions
    const all_permission = '*:*:*'
    return permissions.some(permission => all_permission === permission || value.includes(permission))
  }
  console.error('need roles! Like checkPermi="[\'system:user:add\',\'system:user:edit\']"')
  return false
}

/**
 * 角色权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkRole(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = useUserStore.getState().roles
    const super_admin = 'admin'
    return roles.some(role => super_admin === role || value.includes(role))
  }
  console.error('need roles! Like checkRole="[\'admin\',\'editor\']"')
  return false
}
