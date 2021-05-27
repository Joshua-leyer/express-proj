// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Router from 'vue-router'
import VueCookies from 'vue-cookies'

// 初始样式
import './assets/css/reset.css';

Vue.config.productionTip = false

Vue.use(VueCookies)
Vue.use(Router)

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')