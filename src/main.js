import { registerGlobal } from '@/components/shared'
import { createApp } from 'vue'

import '../build/app.css'
import App from './App.vue'
import router from './router'
import storePlugin from './storePlugin'

const app = createApp(App)
registerGlobal(app)
app.use(storePlugin)
app.use(router)
app.mount('#app')
