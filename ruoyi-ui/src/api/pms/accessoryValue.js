import request from '@/utils/request'

// 查询配件值列表
export function listAccessoryValue(query) {
  return request({
    url: '/pms/accessory/value/list',
    method: 'get',
    params: query
  })
}

// 查询配件值详细
export function getAccessoryValue(valueId) {
  return request({
    url: '/pms/accessory/value/' + valueId,
    method: 'get'
  })
}

// 新增配件值
export function addAccessoryValue(data) {
  return request({
    url: '/pms/accessory/value',
    method: 'post',
    data: data
  })
}

// 修改配件值
export function updateAccessoryValue(data) {
  return request({
    url: '/pms/accessory/value',
    method: 'put',
    data: data
  })
}

// 删除配件值
export function delAccessoryValue(valueId) {
  return request({
    url: '/pms/accessory/value/' + valueId,
    method: 'delete'
  })
}

// 导出配件值
export function exportAccessoryValue(query) {
  return request({
    url: '/pms/accessory/value/export',
    method: 'get',
    params: query
  })
}

// 获取某类型下的所有配件值
export function listByType(typeId) {
  return request({
    url: '/pms/accessory/value/listByType/' + typeId,
    method: 'get'
  })
}