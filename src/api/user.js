import request from '@/utils/request'

export function getInfo() {
  return request({
    url: '/api/userInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/api/logout',
    method: 'post'
  })
}
