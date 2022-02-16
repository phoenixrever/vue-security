import _import from "@/utils/_import";

export default function (routers) {
  return filterAsyncRouter(routers);
}
//将后台返回的json权限数据格式化成路由需要的样式 （递归遍历子节点）
/**
   {
    path: '/',
    component: Layout,   
    redirect: '/index',
    children: [{
      name: 'Home',
      path: 'index',  子路由的path 也可以重复
      component: Index,
      meta: {"title": "Home",icon:"el-icon-s-home"},
    }]
  },
 */
export const filterAsyncRouter = (asyncRouterMap) => {
  //遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter((route) => {
    if (route.component) {
      //_import 自动导入
      route.component = _import(route.component);
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children);
    }
    return true;
  });
  return accessedRouters;
};
