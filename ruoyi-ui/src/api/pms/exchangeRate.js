import request from '@/utils/request'

// 查询汇率列表
export function listExchangeRate(query) {
  return request({
    url: '/pms/exchangeRate/list',
    method: 'get',
    params: query
  })
}

// 查询汇率详细
export function getExchangeRate(rateId) {
  return request({
    url: '/pms/exchangeRate/' + rateId,
    method: 'get'
  })
}

// 新增汇率
export function addExchangeRate(data) {
  return request({
    url: '/pms/exchangeRate',
    method: 'post',
    data: data
  })
}

// 修改汇率
export function updateExchangeRate(data) {
  return request({
    url: '/pms/exchangeRate',
    method: 'put',
    data: data
  })
}

// 删除汇率
export function delExchangeRate(rateId) {
  return request({
    url: '/pms/exchangeRate/' + rateId,
    method: 'delete'
  })
}

// 导出汇率
export function exportExchangeRate(query) {
  return request({
    url: '/pms/exchangeRate/export',
    method: 'get',
    params: query
  })
}

// 获取最新汇率
export function getLatest(currencyPair) {
  return request({
    url: '/pms/exchangeRate/latest',
    method: 'get',
    params: { currencyPair }
  })
}

// 获取历史汇率
export function getHistory(currencyPair, startDate, endDate) {
  return request({
    url: '/pms/exchangeRate/history',
    method: 'get',
    params: {
      currencyPair,
      startDate,
      endDate
    }
  })
}