import Vue from 'vue'
import { mount } from '@vue/test-utils'
import QuantType from '@/components/QuantType'
import * as Cells from '@/lib/QuantTypes'
import quantTypes from '../../../config/quantTypes'

describe('QuantType.vue', () => {

  let cmp, quantType, options

  describe('default', () => {

    beforeEach(() => {
      options = { 
                  cellType: 'PlateReader',
                  conversion: { 
                    factors: { 
                      dilution: 500, standardInsertSize: 452, libraryInsertSize: 573
                    },
                    expression: "(dilution*standardInsertSize)/libraryInsertSize"
                  }
                }
      cmp = mount(QuantType)
      cmp.setData(options)
      quantType = cmp.vm
    })

    it('provides a conversion factor', () => {
      expect(quantType.conversionFactor).toEqual("394.415")
    })

    it('provides a cell type', () => {
      expect(quantType.cell).toEqual(Cells.PlateReader)
    })

  })

  describe('PlateReader', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'plateReader'}})
    })

    it('must have the correct options', () => {
      expect(quantType.$data).toEqual(quantTypes["plateReader"])
    })

  })

   describe('qPCR', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'qPCR'}})
    })

    it('must have the correct options', () => {
      expect(quantType.$data).toEqual(quantTypes["qPCR"])
    })

  })
  
})