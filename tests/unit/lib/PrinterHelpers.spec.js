import PrinterList from '@/config/PrinterList'
import { filterPrintersByEnvironment } from '@/lib/PrinterHelpers.js'
import { describe, expect, it } from 'vitest'

describe('PrinterHelpers', () => {
  describe('filterPrintersByEnvironment', () => {
    it('should return an empty array if no printers are provided', () => {
      const result = filterPrintersByEnvironment({
        printers: [],
        hideNonProductionPrinters: false,
      })
      expect(result).toEqual([])
    })

    it('should return all printers if no environment is provided', () => {
      const printers = [
        { name: 'Printer 1', nonProductionPrinter: true },
        { name: 'Printer 2', nonProductionPrinter: false },
        { name: 'Printer 3', nonProductionPrinter: false },
      ]
      const result = filterPrintersByEnvironment({ printers })
      expect(result).toEqual(['Printer 1', 'Printer 2', 'Printer 3'])
    })

    it('should not return any non-production printers where nonProductionPrinter is true and hideNonProductionPrinters is true', () => {
      const printers = [
        { name: 'Printer 1', nonProductionPrinter: true },
        { name: 'Printer 2', nonProductionPrinter: false },
        { name: 'Printer 3', nonProductionPrinter: false },
      ]
      const result = filterPrintersByEnvironment({
        printers,
        hideNonProductionPrinters: true,
      })
      expect(result).toEqual(['Printer 2', 'Printer 3'])
    })

    describe('when using the PrinterList config', () => {
      it('should return the correct printers for when hideNonProductionPrinters is false', () => {
        const result = filterPrintersByEnvironment({
          printers: PrinterList.printers,
          hideNonProductionPrinters: false,
        })
        expect(result).toEqual([
          'stub',
          'morgan-plate-barcode',
          'f225bc',
          'h106bc',
          'g214bc',
          'g216abc',
          'aa312bc',
          'aa312bc2',
        ])
      })

      it('should return the correct printers for when hideNonProductionPrinters is true', () => {
        const result = filterPrintersByEnvironment({
          printers: PrinterList.printers,
          hideNonProductionPrinters: true,
        })
        expect(result).toEqual([
          'f225bc',
          'h106bc',
          'g214bc',
          'g216abc',
          'aa312bc',
          'aa312bc2',
        ])
      })
    })
  })
})
