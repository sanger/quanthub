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
                    expression: '(dilution*standardInsertSize)/libraryInsertSize',
                    decimalPlaces: 5
                  }
                }
      cmp = Vue.extend(QuantType)
      quantType = new cmp({ data: options})
    })

    it('provides a conversion factor', () => {
      expect(quantType.conversionFactor).toEqual(394.41535776614313)
    })

    it('provides a well type', () => {
      expect(quantType.WellFactory).toEqual(WellFactories.PlateReader)
    })

    it('has the replicate options', () => {
      expect(Object.keys(quantType.replicateOptions)).toEqual(['conversionFactor', 'decimalPlaces', 'key', 'units', 'assay', 'outlier', 'fields'])
      expect(quantType.replicateOptions.decimalPlaces).toEqual(5)
    })

    it('should have metadata by default', () => {
      expect(quantType.hasMetadata()).toBeTruthy()
    })

    it('has the required fields for qc results', () => {
      expect(quantType.qcResults.fields).toBeDefined()
    })

    it('must have the default number of decimal places when no config specified for the quant type', () => {
      expect(quantType.conversion.decimalPlaces).toEqual(5)
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
      expect(quantType.$data).toEqual(quantTypes['libraryPlateReader'])
    })

    it('has the correct outlier options', () => {
      expect(quantType.qcResults.outlier).toEqual({type: 'cv', threshold: 20})
    })

    it('has the correct qc results fields', () => {
      expect(quantType.qcResults.fields).toEqual(['barcode','well_location','key','value','units','cv','assay_type','assay_version'])
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
      expect(quantType.conversionFactor).toEqual(1)
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
      expect(quantType.conversionFactor).toEqual(1)
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
      expect(quantType.conversionFactor).toEqual(1)
    })

  })

  describe('libraryQPCR - 10ul', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'libraryQPCR10ul'}})
    })

    it('must have the correct options', () => {
      expect(quantType.$data).toEqual(quantTypes['libraryQPCR10ul'])
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
      expect(quantType.$data).toEqual(quantTypes['libraryQPCR5ul'])
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

    it('has the correct assay version', () => {
      expect(quantType.qcResults.assay.version).toEqual('v2.0')
    })

  

  })

  describe('libraryQPCR - 5ul - Quadruplicate', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'libraryQPCR5ulQuadruplicate'}})
    })

    it('must have the correct options', () => {
      expect(quantType.$data).toEqual(quantTypes['libraryQPCR5ulQuadruplicate'])
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

    it('has the correct assay version', () => {
      expect(quantType.qcResults.assay.version).toEqual('v3.0')
    })

    it('has the correct outlier options', () => {
      expect(quantType.qcResults.outlier).toEqual({type: 'mad', threshold: 3.5})
    })

    it('has the correct qc results fields', () => {
      expect(quantType.qcResults.fields).toEqual(['barcode','well_location','key','value','units','assay_type','assay_version'])
    })

  })

  describe('RNA - Stock', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'RNAStock'}})
    })

    it('must have the correct units', () => {
      expect(quantType.qcResults.units).toEqual('ng/ul')
    })

    it('must have the correct conversion factor', () => {
      expect(quantType.conversionFactor).toEqual(1)
    })

  })

  describe('RNA - Library', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'RNALibrary'}})
    })

    it('must have the correct units', () => {
      expect(quantType.qcResults.units).toEqual('ng/ul')
    })

    it('must have the correct conversion factor', () => {
      expect(quantType.conversionFactor).toEqual(1)
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
      expect(quantType.conversionFactor).toEqual(1)
    })

  })

  describe('ISC', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'ISC'}})
    })

    it('must have the correct units', () => {
      expect(quantType.qcResults.units).toEqual('ng/ul')
    })

    it('must have the correct conversion factor', () => {
      expect(quantType.conversionFactor).toEqual(1)
    })

  })

  describe('chromiumSingleCellcDNA', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'chromiumSingleCellcDNA'}})
    })

    it('must have the correct units', () => {
      expect(quantType.qcResults.units).toEqual('ng/ul')
    })

    it('must have the correct conversion factor', () => {
      expect(quantType.conversionFactor).toEqual(1)
    })

  })

  describe('chromiumSingleCellLibrary', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'chromiumSingleCellLibrary'}})
    })

    it('must have the correct units', () => {
      expect(quantType.qcResults.units).toEqual('ng/ul')
    })

    it('must have the correct conversion factor', () => {
      expect(quantType.conversionFactor).toEqual(1)
    })

  })

  describe('Duplex Seq Library', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'duplexSeqLibrary'}})
    })

    it('must have the correct units', () => {
      expect(quantType.qcResults.units).toEqual('ng/ul')
    })

    it('must have the correct conversion factor', () => {
      expect(quantType.conversionFactor).toEqual(1)
    })

    it('must have the default number of decimal places when not specified in the config', () => {
      expect(quantType.conversion.decimalPlaces).toEqual(3)
    })

  })

  describe('Duplex Seq AL Lib', () => {

    beforeEach(() => {
      cmp = Vue.extend(QuantType)
      quantType = new cmp({propsData: { quantType: 'duplexSeqALLib'}})
    })

    it('must have the correct options', () => {
      expect(quantType.$data).toEqual(quantTypes['duplexSeqALLib'])
    })

    it('must have the correct units', () => {
      expect(quantType.qcResults.units).toEqual('nM')
    })

    it('has some metadata', () => {
      expect(quantType.hasMetadata()).toBeTruthy()
    })

    it('must have the number of decimal places specified in the config', () => {
      expect(quantType.conversion.decimalPlaces).toEqual(20)
    })

  })
})