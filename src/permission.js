import router from "./router";
import store from "./store";
// import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth";
// import getters from "@/store/getters"; // get token from localstorage
import { resetRouter } from "@/router";
import request from "@/utils/request";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login", "/oauth2/callback"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = to.meta.title;

  // determine whether the user has logged in
  const hasToken = getToken();
  // console.log("token", hasToken);
  if (hasToken !== null) {
    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      next({ path: "/" });
      NProgress.done();
    } else {
      const hasGetUserInfo = store.getters.name;
      if (hasGetUserInfo) {
        //当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的会自动进入404页面
        next();
      } else {
        store
          .dispatch("user/getInfo")
          .then(() => {
            // 拉取路由表
            //此时已经得到userInfo 里面的路由表
            // router.addRoutes(store.getters.routers) deprecated
            resetRouter(); //清空原有路由 防止重复key
            store.getters.routers.forEach((route) => {
              //addRoutes 方法仅仅是帮你注入新的路由，并没有帮你剔除其它路由
              router.addRoute(route);
            });
            next({ ...to, replace: true }); //不能直接next() 不然刷新空白页
            // next(); //不能直接next() 不然刷新空白页
          })
          .catch((err) => {
            // store.dispatch("user/fedLogOut").then(() => {
            //   Message.error("验证失败,请重新登录" + err.message);
            //   next({ path: "/login" });
            // });
          });
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      //"Oauth2/callback"
      // console.log("github 返回的授权码",to.query.code)
      if (whiteList.indexOf(to.path) === 1 && to.query.code !== undefined) {
        document.title = "oauth2";
        request({
          url: "/oauth2/callback",
          method: "get",
          params: {
            code: to.query.code,
          },
        }).then(
          (response) => {
            console.log("response", response);
            const token = response.token;
            console.log("store", store);
            store.commit("user/SET_TOKEN", token);
            console.log("ssss" + store.getters.token);
            next(`/index`);
          },
          (error) => {
            next(`/login`);
          }
        );
      } else {
        //  login whitelist, go directly
        next();
      }
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
