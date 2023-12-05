import PrintJob from '@/components/PrintJob.vue'
import Model from '@/api/PrintMyBarcode'
import flushPromises from 'flush-promises'
import PrinterList from '@/config/PrinterList'
import { mount, localVue } from './testHelper'
import { vi, describe, expect, it, beforeEach } from 'vitest'

describe('PrintJob.vue', () => {
  let cmp, printJob, date, attributes

  beforeEach(() => {
    date = new Date('February 1, 2018')
    // TODO: we still have to stub b-alert even though it is now part of the child component
    // how can we abstract this problem away, far away?
    cmp = mount(PrintJob, { propsData: { labelTemplateId: '1' }, localVue })
    cmp.setData({
      barcodes: 'DN1234567\nDN2345678\nDN3456789\n',
      printerName: 'ippbc',
      date: date,
    })
    attributes = {
      labelTemplateId: '1',
      printerName: 'ippbc',
      labels: {
        body: [
          {
            main_label: {
              top_left: '01-FEB-2018',
              bottom_left: 'DN1234567-QC',
              barcode: 'DN1234567-QC',
            },
          },
          {
            main_label: {
              top_left: '01-FEB-2018',
              bottom_left: 'DN2345678-QC',
              barcode: 'DN2345678-QC',
            },
          },
          {
            main_label: {
              top_left: '01-FEB-2018',
              bottom_left: 'DN3456789-QC',
              barcode: 'DN3456789-QC',
            },
          },
        ],
      },
    }
    printJob = cmp.vm
  })

  it('creates some valid print job attributes', () => {
    expect(printJob.attributes).toEqual(attributes)
  })

  it('will have a list of printers', () => {
    expect(cmp.find('#printer-list').findAll('option').length).toEqual(
      PrinterList.length
    )
  })

  describe('it sends a print job', () => {
    it('successfully', async () => {
      Model.prototype.save = vi.fn(() => Promise.resolve(true))
      printJob.execute()
      await flushPromises()
      expect(printJob.$refs.alert.message).toEqual(
        'barcode successfully printed'
      )
    })

    it('unsuccessfully', async () => {
      Model.prototype.save = vi.fn(() => Promise.resolve(false))
      printJob.execute()
      await flushPromises()
      expect(printJob.$refs.alert.message).toEqual('barcode printing failed')
    })
  })

  describe('it will not be valid', () => {
    it('is not valid if printer is blank', () => {
      cmp.setData({ barcodes: '' })
      printJob.execute()
      expect(printJob.errors['barcodes']).toEqual('must be completed')
    })

    it('is not valid if the barcode is blank', () => {
      cmp.setData({ printerName: '' })
      printJob.execute()
      expect(printJob.errors['printerName']).toEqual('must be completed')
    })
  })
})
