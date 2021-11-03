import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth'
import getters from "@/store/getters"; // get token from localstorage
import { resetRouter } from '@/router'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title =to.meta.title

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // console.log('getters',getters);
      // console.log('store',store);
      //routes里面有静态路由
      if (store.getters.name === '') { // 判断当前用户是否已拉取过路由表信息
        store.dispatch('user/getInfo').then(() => { // 拉取路由表
          //此时已经得到userInfo 里面的路由表
          // router.addRoutes(store.getters.routers) deprecated
          resetRouter()
          store.getters.routers.forEach(route=>{
            //addRoutes 方法仅仅是帮你注入新的路由，并没有帮你剔除其它路由
            router.addRoute(route)
          })
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        }).catch(err => {
          store.dispatch('user/fedLogOut').then(() => {
            Message.error('验证失败,请重新登录'+err.message)
            next({ path: '/login' })
          })
        });
      } else {
        next() //当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
