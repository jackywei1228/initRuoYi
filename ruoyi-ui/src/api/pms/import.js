import request from '@/utils/request'

// 上传文件进行导入
export function upload(data) {
  return request({
    url: '/pms/import/upload',
    method: 'post',
    data: data
  })
}

// 导入记录列表
export function listRecords(query) {
  return request({
    url: '/pms/import/list',
    method: 'get',
    params: query
  })
}

// 导入明细
export function getDetails(recordId) {
  return request({
    url: '/pms/import/details/' + recordId,
    method: 'get'
  })
}

// 核对确认
export function verify(detailId, data) {
  return request({
    url: '/pms/import/verify/' + detailId,
    method: 'put',
    data: data
  })
}

// 批量核对
export function batchVerify(recordId, data) {
  return request({
    url: '/pms/import/batchVerify/' + recordId,
    method: 'put',
    data: data
  })
}