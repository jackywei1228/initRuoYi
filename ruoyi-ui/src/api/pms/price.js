import request from '@/utils/request'

// 查询价格列表
export function listPrice(query) {
  return request({
    url: '/pms/price/list',
    method: 'get',
    params: query
  })
}

// 查询价格详细
export function getPrice(priceId) {
  return request({
    url: '/pms/price/' + priceId,
    method: 'get'
  })
}

// 新增价格
export function addPrice(data) {
  return request({
    url: '/pms/price',
    method: 'post',
    data: data
  })
}

// 修改价格
export function updatePrice(data) {
  return request({
    url: '/pms/price',
    method: 'put',
    data: data
  })
}

// 删除价格
export function delPrice(priceId) {
  return request({
    url: '/pms/price/' + priceId,
    method: 'delete'
  })
}

// 导出价格
export function exportPrice(query) {
  return request({
    url: '/pms/price/export',
    method: 'get',
    params: query
  })
}

// 计算价格（Total Cost, Margin等）
export function calculate(data) {
  return request({
    url: '/pms/price/calculate',
    method: 'post',
    data: data
  })
}

// 获取价格变更历史
export function getHistory(priceId) {
  return request({
    url: '/pms/price/history/' + priceId,
    method: 'get'
  })
}

// 获取SKU的当前价格
export function getBySku(skuId) {
  return request({
    url: '/pms/price/sku/' + skuId,
    method: 'get'
  })
}