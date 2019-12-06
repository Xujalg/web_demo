// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/style.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false

Vue.use(ElementUI)
/* eslint-disable no-new */

import axios from 'axios'

var axo = axios.create({
  baseURL: 'http://localhost:8888/api/private/v1'
})
axo.interceptors.request.use(function (conf) {
  // console.log(conf.url)
  if (conf.url !== '/login') {
    conf.headers.Authorization = localStorage.getItem('token')
  }
  return conf
})
Vue.prototype.http = axo

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
