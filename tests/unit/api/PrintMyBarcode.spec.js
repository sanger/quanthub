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
    let fetchMock

    beforeEach(() => {
      fetchMock = vi.spyOn(window, 'fetch')
      fetchMock.mockResolvedValue({
        if_you_can_see_this:
          'tests should be added to check the response is used and correct',
      })
    })

    afterEach(() => {
      fetchMock.mockRestore()
    })

    it('throws errors if printer or barcodes are not provided', async () => {
      await expect(
        createPrintJob({ printer: null, barcodes: null }),
      ).rejects.toThrow(
        'The printer must be provided, there must be at least one barcode.',
      )
      await expect(createPrintJob({ printer: null, barcodes })).rejects.toThrow(
        'The printer must be provided',
      )
      await expect(createPrintJob({ printer, barcodes: null })).rejects.toThrow(
        'There must be at least one barcode',
      )
    })

    describe('when the printer is toshiba', () => {
      it('calls the printer service with the correct parameters', async () => {
        await createPrintJob({ printer, barcodes })
        expect(fetchMock).toBeCalledTimes(1)
        expect(fetchMock).toBeCalledWith(
          `${import.meta.env.VITE_PRINT_MY_BARCODE_BASE_URL}/v2/print_jobs`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/vnd.api+json',
              Accept: 'application/vnd.api+json',
            },
            body: JSON.stringify({
              print_job: {
                printer_name: printer.name,
                label_template_id: import.meta.env
                  .VITE_LABEL_TEMPLATE_ID_TOSHIBA,
                label_template_name: 'sqsc_96plate_label_template_code128',
                labels: createLabels({ printer, barcodes }),
              },
            }),
          },
        )
      })
    })

    describe('when the printer is squix', () => {
      it('calls the printer service with the correct parameters', async () => {
        printer = PrinterList[1]
        await createPrintJob({ printer, barcodes })
        expect(fetchMock).toBeCalledTimes(1)
        expect(fetchMock).toBeCalledWith(
          `${import.meta.env.VITE_PRINT_MY_BARCODE_BASE_URL}/v2/print_jobs`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/vnd.api+json',
              Accept: 'application/vnd.api+json',
            },
            body: JSON.stringify({
              print_job: {
                printer_name: printer.name,
                label_template_name: import.meta.env
                  .VITE_LABEL_TEMPLATE_NAME_SQUIX,
                labels: createLabels({ printer, barcodes }),
              },
            }),
          },
        )
      })
    })
  })
})
