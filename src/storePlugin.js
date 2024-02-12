import Store from '@/Store'

export default {
  Store,
  install: (app) => {
    app.config.globalProperties.$Store = Store
  },
}
