import request from '@/utils/request'

// 查询经销商等级列表
export function listDistributorLevel(query) {
  return request({
    url: '/pms/distributor/level/list',
    method: 'get',
    params: query
  })
}

// 查询经销商等级详细
export function getDistributorLevel(levelId) {
  return request({
    url: '/pms/distributor/level/' + levelId,
    method: 'get'
  })
}

// 新增经销商等级
export function addDistributorLevel(data) {
  return request({
    url: '/pms/distributor/level',
    method: 'post',
    data: data
  })
}

// 修改经销商等级
export function updateDistributorLevel(data) {
  return request({
    url: '/pms/distributor/level',
    method: 'put',
    data: data
  })
}

// 删除经销商等级
export function delDistributorLevel(levelId) {
  return request({
    url: '/pms/distributor/level/' + levelId,
    method: 'delete'
  })
}

// 导出经销商等级
export function exportDistributorLevel(query) {
  return request({
    url: '/pms/distributor/level/export',
    method: 'get',
    params: query
  })
}