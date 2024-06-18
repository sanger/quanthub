import { parseCustomPrinters } from '@/lib/PrinterHelpers.js'
import { describe, expect, it } from 'vitest'

describe('PrinterHelpers', () => {
  describe('parseCustomPrinters', () => {
    it('should return an empty array if undefined is provided', () => {
      const result = parseCustomPrinters(undefined)
      expect(result).toEqual([])
    })

    it('should return an empty array if an empty string is provided', () => {
      const result = parseCustomPrinters('')
      expect(result).toEqual([])
    })

    it('should return an array of printer names when provided a comma-separated string of printer names', () => {
      const result = parseCustomPrinters('Printer 1, Printer 2, Printer 3')
      expect(result).toEqual(['Printer 1', 'Printer 2', 'Printer 3'])
    })
  })
})
