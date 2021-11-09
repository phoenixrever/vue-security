import request from '@/utils/request'

export function getInfo() {
  return request({
    url: '/securityuaa/user/authUserInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/api/logout',
    method: 'post'
  })
}
