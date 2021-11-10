import request from '@/utils/request'

export function getInfo() {
  return request({
    url: '/securityuaa/user/authUserInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/securityuaa/auth/oauth/logout',
    method: 'post'
  })
}
