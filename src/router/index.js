import Vue from 'vue'
import Router from 'vue-router'
import Plate from '@/components/Plate'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Plate',
      component: Plate
    },
    {
      path: '/plate',
      name: 'Plate',
      component: Plate
    }
  ]
})
