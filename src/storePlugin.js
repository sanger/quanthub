import Store from '@/Store'

export default {
  Store,
  install(Vue) {
    Vue.prototype.$Store = Store
  },
}
