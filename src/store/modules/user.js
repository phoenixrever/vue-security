import {constantRouterMap,notFoundRoute} from '@/router';
import {getToken, setToken, removeToken,removePermissions} from '@/utils/auth'
import { getInfo } from '@/api/user'
import routerFormat from '@/utils/routerFormater'
import {logout} from "@/api/user"

const user = {
  //开启命名空间  false的话 ...mapState('user',['sum','school','subject']), user是不认识的 只能自己拿到user.属性
  namespaced: true,
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    routers: constantRouterMap,
    permissions:[],
    addRouters: []
  },
  mutations: {
    SET_ROLES(state, value){
      state.roles.push(value)
    },
    SET_TOKEN(state, value) {
      state.token = value
      setToken(value)
    },
    SET_PERMISSIONS(state, value) {
      state.permissions=value
    },
    SET_ROUTERS: (state, routers) => {
      // state.addRouters = routers; //路由访问
      //静态路由 + 动态路由 合并成侧边栏菜单  此处的路由并没有注册到vueRouter 上
      //404 页面一定要最后加载，如果放在 constantRoutes 一同声明了 404 ，后面的所有页面都会被拦截到
      state.routers = constantRouterMap.concat(routers).concat(notFoundRoute); //菜单显示
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    LOGOUT: (state) => {
      state.addRouters = [];
      state.routers = [];
      state.name = '';
      state.roles = [];
      state.token = '';
      state.permissions = [];
    }
  },
  actions: {
    // get user info
    getInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const { data } = response
          console.log("userInfo",data);
          if (!data) {
            return reject('Verification failed, please Login again.')
          }

          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            // reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.username)
          commit("SET_PERMISSIONS",data.permissions)
          commit('SET_AVATAR', data.avatarPath)
          commit('SET_ROUTERS', routerFormat(data.routers))
          resolve(data)

        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    logOut({commit, state}) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('LOGOUT', '')
          removeToken()
          removePermissions()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出 登陆失败时候使用
    fedLogOut({commit}) {
      return new Promise(resolve => {
        commit('LOGOUT', '')
        removeToken()
        resolve()
      })
    }
  },
}

export default user
