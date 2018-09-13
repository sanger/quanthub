const {
  JSORMBase,
  attr
} = require('jsorm/dist/jsorm')

const ApplicationRecord = JSORMBase.extend({
  static: {
    baseUrl: process.env.VUE_APP_PRINT_MY_BARCODE_BASE_URL,
    apiNamespace: '/v1'
  }
})

const PrintJob = ApplicationRecord.extend({
  static: {
    jsonapiType: 'print_jobs'
  },
  attrs: {
    labelTemplateId: attr(),
    printerName: attr(),
    labels: attr()
  }
})

export default PrintJob