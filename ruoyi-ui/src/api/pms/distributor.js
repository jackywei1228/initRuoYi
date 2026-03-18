import request from '@/utils/request'

// 查询经销商列表
export function listDistributor(query) {
  return request({
    url: '/pms/distributor/list',
    method: 'get',
    params: query
  })
}

// 查询经销商详细
export function getDistributor(distributorId) {
  return request({
    url: '/pms/distributor/' + distributorId,
    method: 'get'
  })
}

// 新增经销商
export function addDistributor(data) {
  return request({
    url: '/pms/distributor',
    method: 'post',
    data: data
  })
}

// 修改经销商
export function updateDistributor(data) {
  return request({
    url: '/pms/distributor',
    method: 'put',
    data: data
  })
}

// 删除经销商
export function delDistributor(distributorId) {
  return request({
    url: '/pms/distributor/' + distributorId,
    method: 'delete'
  })
}

// 导出经销商
export function exportDistributor(query) {
  return request({
    url: '/pms/distributor/export',
    method: 'get',
    params: query
  })
}

// 按等级查询经销商
export function listByLevel(levelId) {
  return request({
    url: '/pms/distributor/listByLevel/' + levelId,
    method: 'get'
  })
}