import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from '@/axios'

Vue.config.productionTip = false
if (localStorage.getItem('user-token')) {
  axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('user-token')
}
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
