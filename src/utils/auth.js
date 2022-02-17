// import Cookies from 'js-cookie'
import store from "@/store";
const TokenKey = "token";

export function getToken() {
  // return Cookies.get(TokenKey)
  return localStorage.getItem(TokenKey);
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  if (token !== null && token !== undefined) {
    localStorage.setItem(TokenKey, token);
  }
}

//删除用户权限
export function removePermissions(permissions) {
  // return Cookies.set(TokenKey, token)
  sessionStorage.removeItem(permissions);
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  localStorage.removeItem(TokenKey);
}

export function hasPermission(permission) {
  const p = store.getters.permissions || [];
  return p.indexOf(permission) > -1;
}

export function hasRoleIds(roleId) {
  const p = store.getters.roleIds || [];
  return p.indexOf(roleId) > -1;
}
