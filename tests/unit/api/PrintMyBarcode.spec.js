import createPrintJob from '@/api/PrintMyBarcode'
import PrinterList from '@/config/PrinterList'
import { describe, expect, it, beforeEach } from 'vitest'

describe('PrintMyBarcode.js', () => {
  let barcodes, printer

  beforeEach(() => {
    barcodes = ['DN1234567','nDN2345678','nDN3456789']
    printer = PrinterList[0]
  })

  describe('createPrintJob', () => {
    it('returns false if printer or barcodes are not provided', async () => {
      expect(await createPrintJob({ printer: null, barcodes })).toEqual(false)
      expect(await createPrintJob({ printer, barcodes: null })).toEqual(false)
    })

    // describe('when the printer is toshiba', () => {
    //   // expect fetch to be called with the correct labels
    // })

    // describe('when the printer is squix', () => {
    //   // expect fetch to be called with the correct labels
    // })
  })
})
