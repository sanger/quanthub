import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/stylesheets/layout.scss'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import storePlugin from './storePlugin'

Vue.use(BootstrapVue)
Vue.use(storePlugin)

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
