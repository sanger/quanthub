import Vue from 'vue'
import Router from 'vue-router'
import Plate from '@/components/Plate'
import Upload from '@/components/Upload'
import PrintJob from '@/components/PrintJob'
import PlateList from '@/components/PlateList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {name: 'PlateList'},
      component: PlateList
    },
    {
      path: '/plates',
      name: 'PlateList',
      component: PlateList
    },
    {
      path: '/plate',
      name: 'Plate',
      component: Plate,
      props: {barcode: true}
    },
    { path: '/plate/:barcode',
      component: Plate,
      props: true
    },
    {
      path: '/upload',
      name: 'Upload',
      component: Upload
    },
    {
      path: '/print_job',
      name: 'PrintJob',
      component: PrintJob
    }
  ]
})
