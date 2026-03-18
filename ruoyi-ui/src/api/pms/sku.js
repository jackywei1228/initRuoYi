import request from '@/utils/request'

// 查询SKU列表
export function listSku(query) {
  return request({
    url: '/pms/sku/list',
    method: 'get',
    params: query
  })
}

// 查询SKU详细
export function getSku(skuId) {
  return request({
    url: '/pms/sku/' + skuId,
    method: 'get'
  })
}

// 新增SKU
export function addSku(data) {
  return request({
    url: '/pms/sku',
    method: 'post',
    data: data
  })
}

// 修改SKU
export function updateSku(data) {
  return request({
    url: '/pms/sku',
    method: 'put',
    data: data
  })
}

// 删除SKU
export function delSku(skuId) {
  return request({
    url: '/pms/sku/' + skuId,
    method: 'delete'
  })
}

// 导出SKU
export function exportSku(query) {
  return request({
    url: '/pms/sku/export',
    method: 'get',
    params: query
  })
}

// 获取SKU配件配置
export function listAccessories(skuId) {
  return request({
    url: '/pms/sku/accessories/' + skuId,
    method: 'get'
  })
}

// 更新SKU配件配置
export function updateAccessories(skuId, data) {
  return request({
    url: '/pms/sku/accessories/' + skuId,
    method: 'put',
    data: data
  })
}

// SKU对比功能
export function compare(skuIds) {
  return request({
    url: '/pms/sku/compare',
    method: 'post',
    data: skuIds
  })
}

// 生成SKU编码
export function generateCode(bareboneId) {
  return request({
    url: '/pms/sku/generateCode/' + bareboneId,
    method: 'get'
  })
}