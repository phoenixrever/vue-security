import request from "@/utils/request";

export function getInfo() {
  return request({
    url: "user/authUserInfo",
    method: "get",
  });
}

export function logout() {
  return request({
    url: "tokenLogout",
    method: "post",
  });
}
