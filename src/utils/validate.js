import request from "@/utils/request";

//判断路由是不是external即 http请求
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

// 手机号验证
export function isValidPhone(str) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
  return reg.test(str);
}

// 验证密码 长度在6~18之间，以字母开头,只能包含字母、数字和下划线
export function isValidPassword(password) {
  const reg = /^[a-zA-Z]\w{5,17}$/;
  return reg.test(password);
}

// 验证密码   密码，以字母开头，长度在8~18之间，只能包含字母、数字和下划线
// export function isValidPassword(str) {
//   // const reg = /^[a-zA-Z]\w{8,18}$/;
//   const reg = /^[a-zA-Z]\w{8,18}$/;
//   return reg.test(str);
// }

//   验证用户名  用户名要求 数字、字母、下划线的组合，其中数字和字母必须同时存在*
export function isValidUsername(str) {
  const reg = /^(?![^A-Za-z]+$)(?![^0-9]+$)[0-9A-Za-z_]{4,15}$/;
  return reg.test(str);
}

//   验证验证码
export function isValidCode(str) {
  return str === "1234";
}

//添加用户和更新用户验证 唯一性 Promise 形式  如果要考虑验证失败的情况的话 不要返回response.unique
//返回 response 在验证那块看状态吗对不对
export function isUniqueUsername(userId, username) {
  return new Promise((resolve, reject) => {
    request({
      url: `/user/checkUnique/username`,
      method: "get",
      //params 对应@requstparam
      params: {
        userId: userId,
        username: username,
      },
    }).then((response) => {
      console.log(response);
      resolve(response.unique);
    });
  });
}

//async 形式
export function isUniqueEmail(userId, email) {
  return new Promise((resolve, reject) => {
    request({
      url: `/user/checkUnique/email`,
      method: "get",
      //data  对应@requestBody
      params: {
        userId: userId,
        email: email,
      },
    }).then((response) => {
      // console.log(response);
      resolve(response.unique);
    });
  });
}
export function isUniquePhone(userId, phone) {
  return new Promise((resolve, reject) => {
    request({
      url: `/user/checkUnique/phone`,
      method: "get",
      params: {
        userId: userId,
        phone: phone,
      },
    }).then((response) => {
      // console.log(response);
      resolve(response.unique);
    });
  });
}

//角色名 唯一性验证
export function isUniqueRoleName(roleId, name) {
  return new Promise((resolve, reject) => {
    request({
      url: `/role/checkUnique/roleName`,
      method: "get",
      params: {
        roleId,
        name,
      },
    }).then((response) => {
      // console.log(response);
      resolve(response.unique);
    });
  });
}
