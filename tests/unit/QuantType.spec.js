import Vue from 'vue'
import QuantType from '@/components/QuantType'
import * as WellFactories from '@/QuantTypeWellFactories'
import quantTypes from '@/config/quantTypes'

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
      cmp = Vue.extend(QuantType)
      quantType = new cmp({ data: options})
    })

    it('provides a conversion factor', () => {
      expect(quantType.conversionFactor).toEqual("394.415")
    })

    it('provides a well type', () => {
      expect(quantType.WellFactory).toEqual(WellFactories.PlateReader)
    })

    it('has the triplicate options', () => {
      expect(Object.keys(quantType.triplicateOptions)).toEqual(['key', 'units', 'assay', 'conversionFactor', 'cvThreshold']);
    })

    it('has a cv threshold', () => {
      expect(quantType.cvThreshold).toBeDefined()
    })

    it('should have metadata by default', () => {
      expect(quantType.hasMetadata()).toBeTruthy()
    })

  })

  describe('libraryPlateReader', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'libraryPlateReader'}})
    })

    it('has some metadata', () => {
      expect(quantType.hasMetadata()).toBeTruthy()
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

  describe('Normalisation', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'normalisation'}})
    })

    it('must have the correct units', () => {
      expect(quantType.qcResults.units).toEqual('ng/ul')
    })

    it('must have the correct conversion factor', () => {
      expect(quantType.conversionFactor).toEqual('1.000')
    })

  })

  describe('Working Dilution - Plate Reader', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'workingDilutionPlateReader'}})
    })

    it('must have the correct units', () => {
      expect(quantType.qcResults.units).toEqual('ng/ul')
    })

    it('must have the correct conversion factor', () => {
      expect(quantType.conversionFactor).toEqual('1.000')
    })

  })

  describe('libraryQPCR - 10ul', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'libraryQPCR10ul'}})
    })

    it('must have the correct options', () => {
      expect(quantType.$data).toEqual(quantTypes["libraryQPCR10ul"])
    })

    it('must have the correct units', () => {
      expect(quantType.qcResults.units).toEqual('nM')
    })

    it('has some metadata', () => {
      expect(quantType.hasMetadata()).toBeTruthy()
    })

  })

  describe('libraryQPCR - 5ul', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'libraryQPCR5ul'}})
    })

    it('must have the correct options', () => {
      expect(quantType.$data).toEqual(quantTypes["libraryQPCR5ul"])
    })

    it('has some metadata', () => {
      expect(quantType.hasMetadata()).toBeFalsy()
    })

    it('must have the correct units', () => {
      expect(quantType.qcResults.units).toEqual('nM')
    })

    it('has the correct well type', () => {
      expect(quantType.$data.wellType).toEqual('QPCR5ul')
    })

  })

  describe('RNA - High throughput', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'RNAHighThroughput'}})
    })

    it('must have the correct units', () => {
      expect(quantType.qcResults.units).toEqual('ng/ul')
    })

    it('must have the correct conversion factor', () => {
      expect(quantType.conversionFactor).toEqual('1.000')
    })

  })

  describe('LCMB', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'LCMB'}})
    })

    it('must have the correct units', () => {
      expect(quantType.qcResults.units).toEqual('ng/ul')
    })

    it('must have the correct conversion factor', () => {
      expect(quantType.conversionFactor).toEqual('1.000')
    })

  })
  
})