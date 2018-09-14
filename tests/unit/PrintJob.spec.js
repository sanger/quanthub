import PrintJob from '@/components/PrintJob'
import Model from '@/api/PrintMyBarcode'
import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'

describe('PrintJob.vue', () => {

  let cmp, printJob, date, attributes

  beforeEach(() => {
    date = new Date('February 1, 2018')
    // TODO: we still have to stub b-alert even though it is now part of the child component
    // how can we abstract this problem away , far away?
    cmp = mount(PrintJob, {propsData: { labelTemplateId: '1' }, stubs: ['b-alert']})
    cmp.setData({barcode: 'DN1234567', printerName: 'ippbc', date: date})
    attributes = {
      labelTemplateId: '1',
      printerName: 'ippbc',
      labels: {
        body: [
          {
            main_label: {
              top_left: '01-FEB-2018',
              bottom_left: 'DN1234567_QC',
              barcode: 'DN1234567_QC'
            }
          }
        ]
      }}
    printJob = cmp.vm 
  })

  it('will modify the barcode for the print job', () => {
    expect(printJob.qcBarcode).toEqual('DN1234567_QC')
  })

  it('creates some valid print job attributes', () => {
    expect(printJob.attributes).toEqual(attributes)
  })

  describe('it sends a print job', () => {
    
    it('successfully', async() => {
      Model.prototype.save = jest.fn(() => Promise.resolve(true))
      printJob.execute()
      await flushPromises()
      expect(printJob.$refs.alert.message).toEqual('barcode successfully printed')
    })

    it('unsuccessfully', async() => {
      Model.prototype.save = jest.fn(() => Promise.resolve(false))
      printJob.execute()
      await flushPromises()
      expect(printJob.$refs.alert.message).toEqual('barcode printing failed')
    })
  })

})