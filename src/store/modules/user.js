import {constantRouterMap} from '@/router';
import {getToken, setToken, removeToken} from '@/utils/auth'
import { getInfo } from '@/api/user'
import routerFormat from '@/utils/routerFormater'

const user = {
  //开启命名空间  false的话 ...mapState('user',['sum','school','subject']), user是不认识的 只能自己拿到user.属性
  namespaced: true,
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_TOKEN(state, value) {
      state.token = value
      localStorage.setItem('token', state.token)
      console.log(value);
    },
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers; //路由访问
      //静态路由 + 动态路由 合并
      state.routers = constantRouterMap.concat(routers); //菜单显示
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
    }
  },
  actions: {
    // get user info
    getInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const { data } = response

          if (!data) {
            return reject('Verification failed, please Login again.')
          }

          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
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
  getters: {
    token(state) {
      return state.token
    }
  }
}

export default user