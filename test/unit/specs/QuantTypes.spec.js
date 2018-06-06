import Vue from 'vue'
import { mount } from '@vue/test-utils'
import * as Cells from '@/lib/QuantTypes'

describe('QuantTypes.js', () => {

  let options, cell

  describe('PlateReader Cell', () => {

    beforeEach(() => {
      options = {row: 'A', column: '1', content: 'Sample X1', id: 'A1', concentration: 1.345}
      cell = new Cells.PlateReader(options)
    })

    it('must have a row', () => {
      expect(cell.row).toEqual(options.row)
    })

    it('must have a column', () => {
      expect(cell.column).toEqual(options.column)
    })

    it('must have a content', () => {
      expect(cell.column).toEqual(options.column)
    })

    it('must have an id', () => {
      expect(cell.column).toEqual(options.column)
    })

    it('must have a concentration', () => {
      expect(cell.concentration).toEqual(options.concentration)
    })

    it('must have a type', () => {
      expect(cell.type).toEqual('Sample')
    })

    it('produces some json', () => {
      expect(cell.json).toEqual({row: 'A', column: '1', type: 'Sample', id: 'A1', concentration: 1.345})
    })

  })

  describe('QPCR Cell', () => {

    describe('sample', () => {

      beforeEach(() => {
        options = {include: 'TRUE', color: '128', pos: 'N1', name: 'A1', cp: '24.21', concentration: '5.61E+01', standard: '0.0002', status: 'red'}
        cell = new Cells.QPCR(options)
      })

      it('must have an include', () => {
        expect(cell.include).toEqual(options.include)
      })

      it('must have a color', () => {
        expect(cell.color).toEqual(options.color)
      })

      it('must have a pos', () => {
        expect(cell.pos).toEqual(options.pos)
      })

      it('must have an name', () => {
        expect(cell.name).toEqual(options.name)
      })

      it('must have a cp', () => {
        expect(cell.cp).toEqual(options.cp)
      })

      it('must have a concentration', () => {
        expect(cell.concentration).toEqual(56.1)
      })

      it('must have a standard', () => {
        expect(cell.standard).toEqual(options.standard)
      })

      it('must have a status', () => {
        expect(cell.status).toEqual(options.status)
      })

      it('must have a row', () => {
        expect(cell.row).toEqual('N')
      })

      it('must have a column', () => {
        expect(cell.column).toEqual('1')
      })

      it('will have an id', () => {
        expect(cell.id).toEqual('A1')
      })

      it('will have a type', () => {
        expect(cell.type).toEqual('Sample')
      })

      it('produces some json', () => {
        expect(cell.json).toEqual({row: 'N', column: '1', type: 'Sample', id: 'A1', concentration: 56.1})
      })

    })

    describe('bugfix - column is 10 or above', () => {
      beforeEach(() => {
        options = {include: 'TRUE', color: '128', pos: 'D23', name: 'B6', cp: '24.21', concentration: '5.61E+01', standard: '0.0002', status: 'red'}
        cell = new Cells.QPCR(options)
      })

      it('will have the correct row', () => {
        expect(cell.row).toEqual('D')
      })

      it('will have the correct column', () => {
        expect(cell.column).toEqual('23')
      })

    })

    describe('standard', () => {

      beforeEach(() => {
        options = {include: 'TRUE', color: '128', pos: 'N1', name: '0.0002pM', cp: '24.21', concentration: '2.66E-04', standard: '0.0002', status: 'red'}
        cell = new Cells.QPCR(options)
      })

      it('will have a name', () => {
        expect(cell.name).toEqual('0.0002pM')
      })

      it('will not have an id', () => {
        expect(cell.id).toEqual('')
      })

      it('will have a type', () => {
        expect(cell.type).toEqual('Standard')
      })

      it('will have a concentration', () => {
        expect(cell.concentration).toEqual(0.000266)
      })

    })

  })
  
})