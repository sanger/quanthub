import Vue from 'vue'
import Router from 'vue-router'
import Plate from '@/components/Plate'
import Upload from '@/components/Upload'
import Plates from '@/components/Plates'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {name: 'Plates'},
      component: Plate
    },
    {
      path: '/plates',
      name: 'Plates',
      component: Plates
    },
    {
      path: '/plate',
      name: 'Plate',
      component: Plate,
      props: {id: true}
    },
    { path: '/plate/:id',
      component: Plate,
      props: true
    },
    {
      path: '/upload',
      name: 'Upload',
      component: Upload
    }
  ]
})
