import './styles/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import storePlugin from './storePlugin'
import { registerGlobal } from '@/components/shared'

// Vue.config.productionTip = false
const app = createApp(App)
registerGlobal(app)
app.use(storePlugin)
app.use(router)
app.mount('#app')