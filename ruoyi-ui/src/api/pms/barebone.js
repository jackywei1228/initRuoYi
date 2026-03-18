import request from '@/utils/request'

// 查询基础型号列表
export function listBarebone(query) {
  return request({
    url: '/pms/barebone/list',
    method: 'get',
    params: query
  })
}

// 查询基础型号详细
export function getBarebone(bareboneId) {
  return request({
    url: '/pms/barebone/' + bareboneId,
    method: 'get'
  })
}

// 新增基础型号
export function addBarebone(data) {
  return request({
    url: '/pms/barebone',
    method: 'post',
    data: data
  })
}

// 修改基础型号
export function updateBarebone(data) {
  return request({
    url: '/pms/barebone',
    method: 'put',
    data: data
  })
}

// 删除基础型号
export function delBarebone(bareboneId) {
  return request({
    url: '/pms/barebone/' + bareboneId,
    method: 'delete'
  })
}

// 导出基础型号
export function exportBarebone(query) {
  return request({
    url: '/pms/barebone/export',
    method: 'get',
    params: query
  })
}

// 获取SPU关联的配件
export function listAccessories(bareboneId) {
  return request({
    url: '/pms/barebone/accessories/' + bareboneId,
    method: 'get'
  })
}

// 绑定配件到SPU
export function bindAccessories(bareboneId, data) {
  return request({
    url: '/pms/barebone/accessories/' + bareboneId,
    method: 'post',
    data: data
  })
}

// SPU对比功能
export function compare(bareboneIds) {
  return request({
    url: '/pms/barebone/compare',
    method: 'post',
    data: bareboneIds
  })
}