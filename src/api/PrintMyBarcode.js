//TODO: Upgrade to SprayPaint?
import { JSORMBase, attr } from 'jsorm/dist/jsorm'

const ApplicationRecord = JSORMBase.extend({
  static: {
    baseUrl: import.meta.env.VITE_PRINT_MY_BARCODE_BASE_URL,
    apiNamespace: '/v1',
  },
})

const PrintJob = ApplicationRecord.extend({
  static: {
    jsonapiType: 'print_jobs',
  },
  attrs: {
    labelTemplateId: attr(),
    printerName: attr(),
    labels: attr(),
  },
})

export default PrintJob
