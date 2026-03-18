import request from '@/utils/request'

// 查询配件类型列表
export function listAccessoryType(query) {
  return request({
    url: '/pms/accessory/type/list',
    method: 'get',
    params: query
  })
}

// 查询配件类型详细
export function getAccessoryType(typeId) {
  return request({
    url: '/pms/accessory/type/' + typeId,
    method: 'get'
  })
}

// 新增配件类型
export function addAccessoryType(data) {
  return request({
    url: '/pms/accessory/type',
    method: 'post',
    data: data
  })
}

// 修改配件类型
export function updateAccessoryType(data) {
  return request({
    url: '/pms/accessory/type',
    method: 'put',
    data: data
  })
}

// 删除配件类型
export function delAccessoryType(typeId) {
  return request({
    url: '/pms/accessory/type/' + typeId,
    method: 'delete'
  })
}

// 导出配件类型
export function exportAccessoryType(query) {
  return request({
    url: '/pms/accessory/type/export',
    method: 'get',
    params: query
  })
}