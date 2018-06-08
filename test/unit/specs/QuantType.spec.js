import Vue from 'vue'
import { mount } from '@vue/test-utils'
import QuantType from '@/components/QuantType'
import * as WellFactories from '@/lib/QuantTypeWellFactories'
import quantTypes from '../../../config/quantTypes'

describe('QuantType.vue', () => {

  let cmp, quantType, options

  describe('default', () => {

    beforeEach(() => {
      options = { 
                  wellType: 'PlateReader',
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

    it('provides a well type', () => {
      expect(quantType.WellFactory).toEqual(WellFactories.PlateReader)
    })

    it('has the triplicate options', () => {
      expect(Object.keys(quantType.triplicateOptions)).toEqual(['key', 'units', 'assay', 'conversionFactor']);
    })

  })

  describe('libraryPlateReader', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'libraryPlateReader'}})
    })

    it('must have the correct options', () => {
      expect(quantType.$data).toEqual(quantTypes["libraryPlateReader"])
    })

  })

  describe('stockPlateReader', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'stockPlateReader'}})
    })

    it('must have the correct units', () => {
      expect(quantType.qcResults.units).toEqual('ng/ul')
    })

    it('must have the correct conversion factor', () => {
      expect(quantType.conversionFactor).toEqual('1.000')
    })

  })

  describe('cherryPickPlateReader', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'cherryPickPlateReader'}})
    })

    it('must have the correct units', () => {
      expect(quantType.qcResults.units).toEqual('ng/ul')
    })

    it('must have the correct conversion factor', () => {
      expect(quantType.conversionFactor).toEqual('1.000')
    })

  })

  describe('libraryQPCR', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'libraryQPCR'}})
    })

    it('must have the correct options', () => {
      expect(quantType.$data).toEqual(quantTypes["libraryQPCR"])
    })

  })
  
})