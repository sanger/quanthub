import PrinterList from '@/config/PrinterList'
import { filterPrintersByEnvironment } from '@/lib/PrinterHelpers.js'
import { describe, expect, it } from 'vitest'

describe('PrinterHelpers', () => {
  describe('filterPrintersByEnvironment', () => {
    it('should return an empty array if no printers are provided', () => {
      const result = filterPrintersByEnvironment({
        printers: [],
        environment: 'production',
      })
      expect(result).toEqual([])
    })

    it('should return all printers if no environment is provided', () => {
      const printers = [
        { name: 'Printer 1', hideInProduction: true },
        { name: 'Printer 2', hideInProduction: false },
        { name: 'Printer 3', hideInProduction: false },
      ]
      const result = filterPrintersByEnvironment({ printers })
      expect(result).toEqual(['Printer 1', 'Printer 2', 'Printer 3'])
    })

    it('should not return any printers where hideInProduction is true of environment is production', () => {
      const printers = [
        { name: 'Printer 1', hideInProduction: true },
        { name: 'Printer 2', hideInProduction: false },
        { name: 'Printer 3', hideInProduction: false },
      ]
      const result = filterPrintersByEnvironment({
        printers,
        environment: 'production',
      })
      expect(result).toEqual(['Printer 2', 'Printer 3'])
    })

    describe('when using the PrinterList config', () => {
      it('should return the correct printers for the development environment', () => {
        const result = filterPrintersByEnvironment({
          printers: PrinterList.printers,
          environment: 'development',
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

      it('should return the correct printers for the production environment', () => {
        const result = filterPrintersByEnvironment({
          printers: PrinterList.printers,
          environment: 'production',
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
