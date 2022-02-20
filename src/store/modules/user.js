import { constantRouterMap, notFoundRoute } from "@/router";
import {
  getToken,
  setToken,
  removeToken,
  // removePermissions,
} from "@/utils/auth";
import { getInfo } from "@/api/user";
import routerFormat from "@/utils/routerFormater";
import { logout } from "@/api/user";

const user = {
  //开启命名空间  false的话 ...mapState('user',['sum','school','subject']), user是不认识的 只能自己拿到user.属性
  namespaced: true,
  state: {
    token: getToken(),
    name: "",
    avatar: "",
    roles: [],
    roleIds: "",
    routers: constantRouterMap,
    permissions: [],
    addRouters: [],
  },
  mutations: {
    // 用push push  會變成 __ob__: Observer  无法遍历取值  =也会变成__ob__: Observer 但是可以取值
    //todo 原因
    SET_ROLES(state, value) {
      state.roles = value;
    },
    SET_ROLEIDS(state, value) {
      state.roleIds = value;
    },
    SET_TOKEN(state, value) {
      console.log("set token ssssssssssssssss");
      state.token = value;
      setToken(value);
    },
    SET_PERMISSIONS(state, value) {
      state.permissions = value;
    },
    SET_ROUTERS: (state, routers) => {
      // state.addRouters = routers; //路由访问
      //静态路由 + 动态路由 合并成侧边栏菜单  此处的路由并没有注册到vueRouter 上
      //404 页面一定要最后加载，如果放在 constantRoutes 一同声明了 404 ，后面的所有页面都会被拦截到
      state.routers = constantRouterMap.concat(routers).concat(notFoundRoute); //菜单显示
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    LOGOUT: (state) => {
      state.addRouters = [];
      state.routers = [];
      state.name = "";
      state.roles = {}; //都是map
      state.roleIds = [];
      state.token = "";
      state.permissions = [];
    },
  },
  actions: {
    // get user info mutation 有好几个参数
    getInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((response) => {
            const data = response.authUserInfo;
            // console.log(data);
            if (!data) {
              return reject("Verification failed, please Login again.");
            }

            if (data.roleIds && data.roleIds.length > 0) {
              commit("SET_ROLEIDS", data.roleIds);
            }

            if (data.roles) {
              // 验证返回的roles是否是一个非空map
              commit("SET_ROLES", data.roles);
            } else {
              // reject('getInfo: roles must be a non-null array !')
            }
            commit("SET_NAME", data.username);
            commit("SET_PERMISSIONS", data.permissions);
            commit("SET_AVATAR", data.avatar);
            commit("SET_ROUTERS", routerFormat(data.routers));
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 登出 context 上下文 阉割版的store 里面有 state commit dispatch
    logOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit("LOGOUT", "");
            removeToken();
            // removePermissions();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    // 前端 登出 登陆失败时候使用
    fedLogOut({ commit }) {
      return new Promise((resolve) => {
        commit("LOGOUT", "");
        removeToken();
        resolve();
      });
    },
  },
};

export default user;
