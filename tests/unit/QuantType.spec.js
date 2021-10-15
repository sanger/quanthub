import Vue from 'vue'
import QuantType from '@/components/QuantType'
import * as WellFactories from '@/QuantTypeWellFactories'
import quantTypes from '@/config/quantTypes'

const component = Vue.extend(QuantType)

const buildQuantType = (quantType, data = {}) => {
  return new component({ data, propsData: { quantType } })
}

describe('QuantType.vue', () => {
  let quantType, options

  describe('default', () => {
    beforeEach(() => {
      options = {
        wellType: 'PlateReader',
        conversion: {
          factors: {
            dilution: 500,
            standardInsertSize: 452,
            libraryInsertSize: 573,
          },
          expression: '(dilution*standardInsertSize)/libraryInsertSize',
          decimalPlaces: 5,
        },
      }
      quantType = buildQuantType('', options)
    })

    it('provides a conversion factor', () => {
      expect(quantType.conversionFactor).toEqual(394.41535776614313)
    })

    it('provides a well type', () => {
      expect(quantType.WellFactory).toEqual(WellFactories.PlateReader)
    })

    it('has the replicate options', () => {
      expect(Object.keys(quantType.replicateOptions)).toEqual([
        'conversionFactor',
        'decimalPlaces',
        'key',
        'units',
        'assay',
        'outlier',
        'fields',
      ])
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
      quantType = buildQuantType('libraryPlateReader')
    })

    it('has some metadata', () => {
      expect(quantType.hasMetadata()).toBeTruthy()
    })

    it('must have the correct options', () => {
      expect(quantType.$data).toEqual({
        ...quantTypes['libraryPlateReader'],
        grid: {},
      })
    })

    it('has the correct outlier options', () => {
      expect(quantType.qcResults.outlier).toEqual({
        type: 'cv',
        threshold: 20,
      })
    })

    it('has the correct qc results fields', () => {
      expect(quantType.qcResults.fields).toEqual([
        'barcode',
        'well_location',
        'key',
        'value',
        'units',
        'cv',
        'assay_type',
        'assay_version',
      ])
    })
  })

  describe('stockPlateReader', () => {
    beforeEach(() => {
      quantType = buildQuantType('stockPlateReader')
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
      quantType = buildQuantType('normalisation')
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
      quantType = buildQuantType('workingDilutionPlateReader')
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
      quantType = buildQuantType('libraryQPCR10ul')
    })

    it('must have the correct options', () => {
      expect(quantType.$data).toEqual({
        ...quantTypes['libraryQPCR10ul'],
        grid: {},
      })
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
      quantType = buildQuantType('libraryQPCR5ul')
    })

    it('must have the correct options', () => {
      expect(quantType.$data).toEqual({
        ...quantTypes['libraryQPCR5ul'],
        grid: {},
      })
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
      quantType = buildQuantType('libraryQPCR5ulQuadruplicate')
    })

    it('must have the correct options', () => {
      expect(quantType.$data).toEqual({
        ...quantTypes['libraryQPCR5ulQuadruplicate'],
        grid: {},
      })
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
      expect(quantType.qcResults.outlier).toEqual({
        type: 'mad',
        threshold: 3.5,
      })
    })

    it('has the correct qc results fields', () => {
      expect(quantType.qcResults.fields).toEqual([
        'barcode',
        'well_location',
        'key',
        'value',
        'units',
        'assay_type',
        'assay_version',
      ])
    })
  })

  describe('RNA - Stock', () => {
    beforeEach(() => {
      quantType = buildQuantType('RNAStock')
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
      quantType = buildQuantType('RNALibrary')
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
      quantType = buildQuantType('LCMB')
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
      quantType = buildQuantType('ISC')
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
      quantType = buildQuantType('chromiumSingleCellcDNA')
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
      quantType = buildQuantType('chromiumSingleCellLibrary')
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
      quantType = buildQuantType('duplexSeqLibrary')
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
      quantType = buildQuantType('duplexSeqALLib')
    })

    it('must have the correct options', () => {
      expect(quantType.$data).toEqual({
        ...quantTypes['duplexSeqALLib'],
        grid: {},
      })
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

  describe('Heron 96 cDNA', () => {
    beforeEach(() => {
      quantType = buildQuantType('heron96cdna')
    })

    it('must have the correct units', () => {
      expect(quantType.qcResults.units).toEqual('ng/ul')
    })

    it('must have the correct conversion factor', () => {
      expect(quantType.conversionFactor).toEqual(1)
    })
  })

  describe('Heron 384 cDNA', () => {
    beforeEach(() => {
      quantType = buildQuantType('heron384cdna')
    })

    it('must have the correct units', () => {
      expect(quantType.qcResults.units).toEqual('ng/ul')
    })

    it('must have the correct conversion factor', () => {
      expect(quantType.conversionFactor).toEqual(1)
    })
  })

  describe('v2 - new plasticware - greiner assay plate', () => {
    it('ISC - V2 - greiner assay plate', () => {
      const quantType = buildQuantType('ISCV2')
      expect(quantType.name).toEqual('ISC - greiner assay plate')
      expect(quantType.qcResults.assay.version).toEqual('v2.0')
    })

    it('LCMB - V2 - greiner assay plate', () => {
      const quantType = buildQuantType('LCMBV2')
      expect(quantType.name).toEqual('LCMB - greiner assay plate')
      expect(quantType.qcResults.assay.version).toEqual('v2.0')
    })

    it('libraryPlateReader - V2 - greiner assay plate', () => {
      const quantType = buildQuantType('libraryPlateReaderV2')
      expect(quantType.name).toEqual(
        'Library - Plate Reader - greiner assay plate'
      )
      expect(quantType.qcResults.assay.version).toEqual('v2.0')
    })

    it('stockPlateReader - V2 - greiner assay plate', () => {
      const quantType = buildQuantType('stockPlateReaderV2')
      expect(quantType.name).toEqual(
        'Stock - Plate Reader - greiner assay plate'
      )
      expect(quantType.qcResults.assay.version).toEqual('v2.0')
    })

    it('workingDilutionPlateReader - V2 - greiner assay plate', () => {
      const quantType = buildQuantType('workingDilutionPlateReaderV2')
      expect(quantType.name).toEqual(
        'Working Dilution - Plate Reader - greiner assay plate'
      )
      expect(quantType.qcResults.assay.version).toEqual('v2.0')
    })

    it('normalisation - V2 - greiner assay plate', () => {
      const quantType = buildQuantType('normalisationV2')
      expect(quantType.name).toEqual('Normalisation - greiner assay plate')
      expect(quantType.qcResults.assay.version).toEqual('v2.0')
    })

    it('RNAStock - V2 - greiner assay plate', () => {
      const quantType = buildQuantType('RNAStockV2')
      expect(quantType.name).toEqual('RNA - Stock - greiner assay plate')
      expect(quantType.qcResults.assay.version).toEqual('v2.0')
    })

    it('RNALibrary - V2 - greiner assay plate', () => {
      const quantType = buildQuantType('RNALibraryV2')
      expect(quantType.name).toEqual('RNA - Library - greiner assay plate')
      expect(quantType.qcResults.assay.version).toEqual('v2.0')
    })

    it('chromiumSingleCellcDNA - V2 - greiner assay plate', () => {
      const quantType = buildQuantType('chromiumSingleCellcDNAV2')
      expect(quantType.name).toEqual(
        'Chromium Single Cell - cDNA - greiner assay plate'
      )
      expect(quantType.qcResults.assay.version).toEqual('v2.0')
    })

    it('chromiumSingleCellLibrary - V2 - greiner assay plate', () => {
      const quantType = buildQuantType('chromiumSingleCellLibraryV2')
      expect(quantType.name).toEqual(
        'Chromium Single Cell - Library - greiner assay plate'
      )
      expect(quantType.qcResults.assay.version).toEqual('v2.0')
    })

    it('duplexSeqALLib - V2 - greiner assay plate', () => {
      const quantType = buildQuantType('duplexSeqALLibV2')
      expect(quantType.name).toEqual('Duplex Seq AL Lib - greiner assay plate')
      expect(quantType.qcResults.assay.version).toEqual('v2.0')
    })

    it('duplexSeqLibrary - V2 - greiner assay plate', () => {
      const quantType = buildQuantType('duplexSeqLibraryV2')
      expect(quantType.name).toEqual('Duplex Seq Library - greiner assay plate')
      expect(quantType.qcResults.assay.version).toEqual('v2.0')
    })

    it('heron96cdna - V2 - greiner assay plate', () => {
      const quantType = buildQuantType('heron96cdnaV2')
      expect(quantType.name).toEqual('Heron 96 cDNA - greiner assay plate')
      expect(quantType.qcResults.assay.version).toEqual('v2.0')
    })

    it('heron384cdna - V2 - greiner assay plate', () => {
      const quantType = buildQuantType('heron384cdnaV2')
      expect(quantType.name).toEqual('Heron 384 cDNA - greiner assay plate')
      expect(quantType.qcResults.assay.version).toEqual('v2.0')
    })
  })

  describe('heronTubeTapeStation', () => {
    beforeEach(() => {
      quantType = buildQuantType('heronTubeTapeStation')
    })

    it('must have the correct units', () => {
      // nM is the same as nmol/l but consistent with other measures
      expect(quantType.qcResults.units).toEqual('nM')
    })

    it('must have the correct key', () => {
      expect(quantType.qcResults.key).toEqual('molarity')
    })

    it('must have the correct conversion factor', () => {
      expect(quantType.conversionFactor).toEqual(1.62)
    })
  })
})
