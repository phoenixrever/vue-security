import Vue from "vue";
import App from "@/App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/styles/index.scss"; // global css
import store from "@/store";
import "normalize.css/normalize.css"; // 所有的浏览器上对于未定义的样式浏览效果达到一致
import "@/permission"; // permission control
import { hasPermission, hasRoleIds } from "@/utils/auth";
import debounce from "./utils/debounce";

// require("./mock");

Vue.use(ElementUI);
//element ui 按需引入 暂时不搞  还要去查用了哪些组件

Vue.config.productionTip = false;
Vue.prototype.$hasPermission = hasPermission;
Vue.prototype.$hasRoleIds = hasRoleIds;

Vue.prototype.$debounce = debounce;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
