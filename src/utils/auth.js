// import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  // return Cookies.get(TokenKey)
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  localStorage.setItem(TokenKey,token)
}
//保存用户权限
export function setPermissions(permissions) {
  // return Cookies.set(TokenKey, token)
  sessionStorage.setItem("permissions",permissions)
}
//删除用户权限
export function removePermissions(permissions) {
  // return Cookies.set(TokenKey, token)
  sessionStorage.removeItem("permissions")
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  localStorage.removeItem(TokenKey)
}

export function hasPermission(permission) {
  const p = sessionStorage.getItem("permissions") || [];
  return p.indexOf(permission)>-1
}
