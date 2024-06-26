import Plate from '@/components/Plate.vue'
import PlateList from '@/components/PlateList.vue'
import PrintJob from '@/components/PrintJob.vue'
import Upload from '@/components/Upload.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
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

export default router
