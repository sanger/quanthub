import PrintJob from '@/components/PrintJob.vue'
import PrinterList from '@/config/PrinterList'
import flushPromises from 'flush-promises'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { mount } from './testHelper'

describe('PrintJob.vue', () => {
  let cmp, printJob

  beforeEach(() => {
    vi.stubEnv('VITE_CUSTOM_PRINTERS', 'stub')
    cmp = mount(PrintJob)
    cmp.setData({
      barcodes: 'DN1234567\nDN2345678\nDN3456789\n',
      printerName: 'stub',
      barcodeError: '',
      printerError: '',
    })
    printJob = cmp.vm
  })

  describe('printers', () => {
    it('will return the a list of printers', () => {
      expect(printJob.printers).toEqual([
        'stub',
        'f225bc',
        'h106bc',
        'g214bc',
        'g216abc',
        'aa312bc',
        'aa312bc2',
      ])
    })
  })

  describe('printerOptions', () => {
    it('will return a list of printerOptions based on the PrinterList config', () => {
      expect(printJob.printerOptions).toEqual(
        printJob.printers.map((printer) => ({
          text: printer,
          value: printer,
        })),
      )
    })
  })

  describe('printer', () => {
    it('will return the full printer when the printerName exists and is valid', () => {
      cmp.setData({ printerName: PrinterList[0] })
      expect(printJob.printer).toEqual(PrinterList[0])
    })

    it('will return undefined when the printerName does not exist', () => {
      cmp.setData({ printerName: '' })
      expect(printJob.printer).toEqual(undefined)
    })
  })

  describe('execute', () => {
    let printMyBarcode
    beforeEach(async () => {
      // Mock the createPrintJob function to return a resolved promise
      vi.mock('@/api/PrintMyBarcode')
      printMyBarcode = await import('@/api/PrintMyBarcode')
    })

    it('will generate an alert message on success', async () => {
      printMyBarcode.createPrintJob = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          message: 'success',
        }),
      })

      printJob.execute()
      await flushPromises()

      expect(printJob.$refs.alert.message).toEqual('Printing command sent')
    })

    it('will generate an alert message on failure', async () => {
      printMyBarcode.createPrintJob = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          errors: [
            {
              source: { pointer: '/data/attributes/label_template' },
              detail: "can't be blank",
            },
          ],
        }),
      })

      printJob.execute()
      await flushPromises()

      expect(printJob.$refs.alert.message).toEqual(
        "Printing command failed: /data/attributes/label_template can't be blank",
      )
    })
  })

  describe('valid', () => {
    it('is valid if the printerName and barcodes are not blank', () => {
      cmp.setData({
        printerName: PrinterList.printers[0],
        barcodes: 'DN1234567',
      })
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
        printerName: 'stub',
        barcodes: 'DN1234567\nDN2345678\nDN3456789\n',
        barcodeError: 'error',
        printerError: 'error',
      })
      printJob.reset()
      expect(printJob.printerName).toEqual(printJob.printers[0])
      expect(printJob.barcodes).toEqual('')
      expect(printJob.barcodeError).toEqual('')
      expect(printJob.printerError).toEqual('')
    })
  })
})
