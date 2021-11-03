import request from '@/utils/request'

export function getInfo(token) {
  return request({
    url: '/api/userInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/logout',
    method: 'post'
  })
}
