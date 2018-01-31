import Store from '@/lib/Store'

export default {
  Store,
  install (Vue, options) {
    Vue.prototype.$Store = Store
  }
}
