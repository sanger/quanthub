import './styles/index.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import BootstrapVue from 'bootstrap-vue'
import storePlugin from './storePlugin'
import { registerGlobal } from '@/components/shared'

// Vue.use(BootstrapVue)
Vue.use(storePlugin)

Vue.config.productionTip = false
registerGlobal(Vue)

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
