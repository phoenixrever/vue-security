import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/layout"; //首字母大写的Vue模板不能省略
import Index from "@/views/Index";

Vue.use(VueRouter);

/**
 *
 // 当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 hidden: true // (默认 false)

 //当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 redirect: 'noRedirect'

 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 alwaysShow: true

 name: 'router-name' // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 meta: {
      roles: ['admin', 'editor'] // 设置该路由进入的权限，支持多个权限叠加
      title: 'title' // 设置该路由在侧边栏和面包屑中展示的名字
      icon: 'svg-name' // 设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
      noCache: true // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
      breadcrumb: false //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
      affix: true // 如果设置为true，它则会固定在tags-view中(默认 false)

      // 当路由设置了该属性，则会高亮相对应的侧边栏。
      // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
      // 点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
      activeMenu: '/article/list'
    }
 */

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

//所有权限通用路由表
//如首页和登录页和一些不用权限的公用页面
//实例化vue的时候只挂载constantRouter
export const constantRouterMap = [
  {
    name: "login",
    path: "/login",
    component: () => import("@/views/Login"),
    meta: {
      title: "login",
    },
    hidden: true,
  },
  {
    name: "flutter",
    path: "/flutter",
    component: () => import("@/views/flutter"),
    meta: { title: "flutter" },
    hidden: true,
  },

  {
    name: "503",
    path: "/503",
    component: () => import("@/views/503"),
    meta: { title: "503" },
    hidden: true,
  },

  {
    name: "404",
    path: "/404",
    component: () => import("@/views/404"),
    meta: { title: "404" },
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/index",
    children: [
      {
        name: "Home",
        path: "index",
        component: Index,
        meta: { title: "Home", icon: "el-icon-s-home" },
      },
    ],
  },
];

// 404 page must be placed at the end !!!
export const notFoundRoute = { path: "*", redirect: "/404", hidden: true };

const router = new VueRouter({
  mode: "history", // require service support
  // scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
});

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = new VueRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
