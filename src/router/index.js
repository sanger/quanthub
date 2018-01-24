import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import PlateReader from '@/components/PlateReader'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/plate-reader',
      name: 'PlateReader',
      component: PlateReader
    }

  ]
})
