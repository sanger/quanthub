import Vue from 'vue'
import Router from 'vue-router'
import Plate from '@/components/Plate.vue'
import Upload from '@/components/Upload.vue'
import PrintJob from '@/components/PrintJob.vue'
import PlateList from '@/components/PlateList.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: { name: 'PlateList' },
      component: PlateList,
    },
    {
      path: '/plates',
      name: 'PlateList',
      component: PlateList,
    },
    {
      path: '/plate',
      name: 'Plate',
      component: Plate,
      props: { barcode: true },
    },
    { path: '/plate/:barcode', component: Plate, props: true },
    {
      path: '/upload',
      name: 'Upload',
      component: Upload,
    },
    {
      path: '/print_job',
      name: 'PrintJob',
      component: PrintJob,
    },
  ],
})
