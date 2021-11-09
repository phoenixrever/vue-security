import Vue from 'vue'
import App from '@/App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import store from '@/store'
import 'normalize.css/normalize.css' // 所有的浏览器上对于未定义的样式浏览效果达到一致
import '@/permission' // permission control

// require("./mock")

Vue.use(ElementUI)

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
