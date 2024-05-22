import PrintJob from '@/components/PrintJob.vue'
import PrinterList from '@/config/PrinterList'
import flushPromises from 'flush-promises'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { mount } from './testHelper'

let createPrintJob = Promise.resolve(true)
vi.mock('@/api/PrintMyBarcode', () => ({
  default: vi.fn(() => createPrintJob),
}))

describe('PrintJob.vue', () => {
  let cmp, printJob

  beforeEach(() => {
    cmp = mount(PrintJob)
    cmp.setData({
      barcodes: 'DN1234567\nDN2345678\nDN3456789\n',
      printerName: 'ippbc',
      barcodeError: '',
      printerError: '',
    })
    printJob = cmp.vm
  })

  describe('printerOptions', () => {
    it('will return a list of printerOptions based on the PrinterList config', () => {
      expect(printJob.printerOptions).toEqual(
        PrinterList.map((printer) => ({
          text: printer.name,
          value: printer.name,
        })),
      )
    })
  })

  describe('printer', () => {
    it('will return the full printer when the printerName exists and is valid', () => {
      cmp.setData({ printerName: PrinterList[0].name })
      expect(printJob.printer).toEqual(PrinterList[0])
    })

    it('will return undefined when the printerName does not exist', () => {
      cmp.setData({ printerName: '' })
      expect(printJob.printer).toEqual(undefined)
    })
  })

  describe('execute', () => {
    it('successfully', async () => {
      createPrintJob = Promise.resolve(true)
      printJob.execute()
      await flushPromises()
      expect(printJob.$refs.alert.message).toEqual(
        'barcode successfully printed',
      )
    })

    it('unsuccessfully', async () => {
      createPrintJob = Promise.resolve(false)
      printJob.execute()
      await flushPromises()

      expect(printJob.$refs.alert.message).toEqual('barcode printing failed')
    })
  })

  describe('valid', () => {
    it('is valid if the printerName and barcodes are not blank', () => {
      cmp.setData({ printerName: PrinterList[0].name, barcodes: 'DN1234567' })
      const valid = printJob.valid()
      expect(valid).toEqual(true)
      expect(printJob.printerError).toEqual('')
      expect(printJob.barcodeError).toEqual('')
    })

    it('is returns false and adds a barcode error if barcodes is blank', () => {
      cmp.setData({ barcodes: '' })
      const valid = printJob.valid()
      expect(valid).toEqual(false)
      expect(printJob.barcodeError).toEqual(
        'There must be at least one barcode',
      )
    })

    it('is not valid if the barcode is blank', () => {
      cmp.setData({ printerName: '' })
      const valid = printJob.valid()
      expect(valid).toEqual(false)
      expect(printJob.printerError).toEqual('Please select a printer')
    })
  })

  describe('formattedBarcodes', () => {
    it('returns an array of barcodes', () => {
      const barcodes = 'DN1234567\nDN2345678\nDN3456789\n\n'
      const expectedBarcodes = ['DN1234567-QC', 'DN2345678-QC', 'DN3456789-QC']
      cmp.setData({ barcodes })
      expect(printJob.formattedBarcodes()).toEqual(expectedBarcodes)
    })
  })

  describe('reset', () => {
    it('resets the component data', () => {
      cmp.setData({
        printerName: 'ippbc',
        barcodes: 'DN1234567\nDN2345678\nDN3456789\n',
        barcodeError: 'error',
        printerError: 'error',
      })
      printJob.reset()
      expect(printJob.printerName).toEqual(PrinterList[0].name)
      expect(printJob.barcodes).toEqual('')
      expect(printJob.barcodeError).toEqual('')
      expect(printJob.printerError).toEqual('')
    })
  })
})
