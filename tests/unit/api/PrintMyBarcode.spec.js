import { createLabels, createPrintJob } from '@/api/PrintMyBarcode'
import PrinterList from '@/config/PrinterList'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('PrintMyBarcode.js', () => {
  let barcodes, printer

  beforeEach(() => {
    barcodes = ['DN1234567', 'DN2345678', 'DN3456789']
    printer = PrinterList[0]
  })

  describe('createLabels', () => {
    beforeEach(() => {
      // Mock the date
      const date = new Date(2021, 5, 23)

      vi.useFakeTimers()
      vi.setSystemTime(date)
    })

    afterEach(() => {
      // Reset the date
      vi.useRealTimers()
    })

    it('returns an empty array if the printer is not toshiba or squix', () => {
      expect(createLabels({ printer: { name: 'invalid' }, barcodes })).toEqual(
        [],
      )
    })

    it('returns the correct labels if the printer is toshiba', () => {
      const labels = createLabels({ printer: { name: 'toshiba' }, barcodes })
      expect(labels).toEqual([
        {
          main_label: {
            top_left: '23-JUN-2021',
            bottom_left: 'DN1234567',
            barcode: 'DN1234567',
          },
        },
        {
          main_label: {
            top_left: '23-JUN-2021',
            bottom_left: 'DN2345678',
            barcode: 'DN2345678',
          },
        },
        {
          main_label: {
            top_left: '23-JUN-2021',
            bottom_left: 'DN3456789',
            barcode: 'DN3456789',
          },
        },
      ])
    })

    it('returns the correct labels if the printer is squix', () => {
      const labels = createLabels({ printer: { name: 'squix' }, barcodes })
      expect(labels).toEqual({
        main_label: {
          top_left: '23-JUN-2021',
          bottom_left: 'TEST',
          barcode: 'TEST',
        },
      })
    })
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
