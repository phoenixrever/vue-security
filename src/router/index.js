import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layout/Index'  //首字母大写的Vue模板不能省略

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [{
      path: 'index',
      name: 'Index',
      component: () => import('@/views/Index'), //首字母大写的Vue模板不能省略
      // meta: { title: 'index', icon: 'dashboard' }
    }]
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>import('../views/Login.vue')
  }
]
const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
})
export default router
