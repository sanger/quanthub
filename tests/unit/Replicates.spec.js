import Vue from 'vue'
import Well from '@/components/wells/Sample.vue'
import {
  ReplicateList,
  Replicate,
  NullReplicate,
  defaultOptions,
} from '@/Replicates'
import { describe, expect, it, beforeEach } from 'vitest'

describe('Replicates.vue', () => {
  let cmp, well1, well2, well3, well4

  beforeEach(() => {
    cmp = Vue.extend(Well)
    well1 = new cmp({
      propsData: {
        row: 'A',
        column: '1',
        content: 'Sample X1',
        id: 'A1',
        concentration: '3.014',
        plateBarcode: 'DN1234567',
      },
    })
    well2 = new cmp({
      propsData: {
        row: 'A',
        column: '2',
        content: 'Sample X1',
        id: 'A1',
        concentration: '3.163',
        plateBarcode: 'DN1234567',
      },
    })
    well3 = new cmp({
      propsData: {
        row: 'B',
        column: '1',
        content: 'Sample X1',
        id: 'A1',
        concentration: '2.836',
        plateBarcode: 'DN1234567',
      },
    })
  })

  describe('Replicate', () => {
    let replicate

    describe('creating all wells up front', () => {
      beforeEach(() => {
        replicate = Replicate({
          wells: [well1, well2, well3],
          options: { ...defaultOptions, cvThreshold: 20 },
        })
      })

      it('will have three wells', () => {
        expect(replicate.wells).toEqual([well1, well2, well3])
      })

      it('will set an mean', () => {
        expect(typeof replicate.mean()).toEqual('number')
      })

      it('must have some options', () => {
        expect(replicate.options.key).toBeDefined()
        expect(replicate.options.units).toBeDefined()
        expect(replicate.options.conversionFactor).toBeDefined()
      })

      it('will set a standard deviation', () => {
        expect(typeof replicate.standardDeviation()).toEqual('number')
      })

      it('will have an id', () => {
        expect(replicate.id()).toEqual(well1.id)
      })

      it('will have a plate barcode', () => {
        expect(replicate.plateBarcode()).toEqual('DN1234567')
      })

      it('will set a cv', () => {
        // (0.16371418183325878/3.0043333333333333) * 100 = 5.449
        expect(typeof replicate.cv()).toEqual('number')
        expect(replicate.needsInspection()).toBeFalsy()
      })

      it('can retrieve active wells', () => {
        well3.active = false
        expect(replicate.activeWells()).toHaveLength(2)
      })

      it('will recalculate statistics correctly if a well is rendered inactive', () => {
        const mean = replicate.mean()
        const standardDeviation = replicate.standardDeviation()
        const cv = replicate.cv()
        well3.active = false

        // mean = 3.088
        // nM = 7.998
        // (3.014 - 3.088)squared = 0.005
        // (3.163 - 3.088)squared = 0.006
        // (0.005 + 0.006) / 1 = 0.011
        // std = sqrt (0.011) = 0.105
        // cv = (0.105/3.088 * 100) = 3.400
        expect(replicate.mean()).not.toEqual(mean)
        expect(replicate.standardDeviation()).not.toEqual(standardDeviation)
        expect(replicate.cv()).not.toEqual(cv)
      })

      it('will return some json for exporting purposes', () => {
        expect(replicate.json()).toEqual({
          barcode: replicate.plateBarcode(),
          well_location: replicate.id(),
          key: replicate.options.key,
          value: replicate.adjustedMean(),
          units: replicate.options.units,
          cv: replicate.cv(),
          assay_type: replicate.options.assay.type,
          assay_version: replicate.options.assay.version,
        })

        replicate.options.fields = [
          'barcode',
          'well_location',
          'key',
          'value',
          'units',
          'assay_type',
          'assay_version',
        ]

        expect(replicate.json()).toEqual({
          barcode: replicate.plateBarcode(),
          well_location: replicate.id(),
          key: replicate.options.key,
          value: replicate.adjustedMean(),
          units: replicate.options.units,
          assay_type: replicate.options.assay.type,
          assay_version: replicate.options.assay.version,
        })
      })

      it('can have a custom barcode source', () => {
        replicate.options.barcodeSource = 'id'
        replicate.options.fields = [
          'barcode',
          'key',
          'value',
          'units',
          'cv',
          'assay_type',
          'assay_version',
        ]
        expect(replicate.json()).toEqual({
          barcode: replicate.id(),
          key: replicate.options.key,
          value: replicate.adjustedMean(),
          units: replicate.options.units,
          cv: replicate.cv(),
          assay_type: replicate.options.assay.type,
          assay_version: replicate.options.assay.version,
        })
      })
    })

    describe('active wells', () => {
      let replicate

      beforeEach(() => {
        replicate = Replicate({ wells: [well1, well2, well3] })
      })

      it('will only include wells which are set to active', () => {
        expect(replicate.activeWells().length).toEqual(3)

        well1.active = false
        expect(replicate.activeWells().length).toEqual(2)
      })

      it('will only include wells which have a valid concentration', () => {
        well1.concentration = 'n.a'
        expect(replicate.activeWells().length).toEqual(2)

        well1.concentration = ''
        expect(replicate.activeWells().length).toEqual(2)
      })
    })

    describe('conversion', () => {
      it('with no options added', () => {
        replicate = Replicate({ wells: [well1, well2, well3] })
        expect(replicate.adjustedMean()).toEqual(replicate.mean())
      })

      it('with an option', () => {
        replicate = Replicate({
          wells: [well1, well2, well3],
          options: {
            conversionExpression: '(ORIGINAL_VALUE * 2.59)',
          },
        })
        expect(replicate.adjustedMean()).toBeGreaterThan(replicate.mean())
      })
    })

    describe('cv threshold', () => {
      let well4, well5, well6

      beforeEach(() => {
        well4 = new cmp({
          propsData: {
            row: 'A',
            column: '1',
            content: 'Sample X1',
            id: 'A1',
            concentration: '0.685',
          },
        })
        well5 = new cmp({
          propsData: {
            row: 'A',
            column: '2',
            content: 'Sample X1',
            id: 'A1',
            concentration: '0.960',
          },
        })
        well6 = new cmp({
          propsData: {
            row: 'A',
            column: '3',
            content: 'Sample X1',
            id: 'A1',
            concentration: '0.660',
          },
        })
        replicate = Replicate({
          wells: [well4, well5, well6],
          options: { cvThreshold: 20 },
        })
      })

      it('will have a cv threshold', () => {
        expect(replicate.cvThreshold).toEqual(20.0)
      })

      it('will indicate whether the replicate needs to be inspected', () => {
        expect(replicate.needsInspection()).toBeTruthy()
      })

      it('will indicate whether replicate needs to be inspected at the threshold', () => {
        well5 = new cmp({
          propsData: {
            row: 'A',
            column: '2',
            content: 'Sample X1',
            id: 'A1',
            concentration: '0.935',
          },
        })
        replicate = Replicate({ wells: [well4, well5, well6] })
        expect(replicate.needsInspection()).toBeTruthy()
      })
    })

    describe('adding wells individually', () => {
      beforeEach(() => {
        replicate = Replicate()
        replicate.add(well1)
        replicate.add(well2)
        replicate.add(well3)
      })

      it('will have three wells', () => {
        expect(replicate.wells).toHaveLength(3)
      })

      it('will create stats', () => {
        expect(typeof replicate.mean()).toEqual('number')
        expect(typeof replicate.standardDeviation()).toEqual('number')
        expect(typeof replicate.cv()).toEqual('number')
      })
    })
  })

  describe('Replicates', () => {
    let well4, well5, well6
    let replicate1, replicate2, replicateList, options

    beforeEach(() => {
      options = {
        conversionFactor: 2.59,
        units: 'nM',
        key: 'Molarity',
        assay: { type: 'Plate Reader', version: 'v1.0' },
        outlier: { type: 'cv', threshold: 15 },
        fields: ['a', 'b', 'c'],
        cvThreshold: 5,
        decimalPlaces: 16,
      }
      replicate1 = Replicate({ wells: [well1, well2, well3], options })

      well4 = new cmp({
        propsData: {
          row: 'A',
          column: '3',
          content: 'Sample X9',
          id: 'A2',
          concentration: '5.6167645657484545',
        },
      })
      well5 = new cmp({
        propsData: {
          row: 'A',
          column: '4',
          content: 'Sample X9',
          id: 'A2',
          concentration: '5.34143756346534856',
        },
      })
      well6 = new cmp({
        propsData: {
          row: 'A',
          column: '5',
          content: 'Sample X9',
          id: 'A2',
          concentration: '5.05425432343423423',
        },
      })

      replicate2 = Replicate({ wells: [well4, well5, well6], options })

      replicateList = ReplicateList(options)
      replicateList.add(well1)
      replicateList.add(well2)
      replicateList.add(well3)
      replicateList.add(well4)
      replicateList.add(well5)
      replicateList.add(well6)
    })

    it('will have the correct number of replicates', () => {
      expect(Array.from(replicateList.keys())).toEqual(['A1', 'A2'])
    })

    it('will have the correct values', () => {
      expect(replicateList.values().length).toEqual(2)
    })

    it('each replicate will have correct stats', () => {
      const firstReplicate = replicateList.find('A1')
      expect(firstReplicate.mean()).toEqual(replicate1.mean())
      expect(firstReplicate.standardDeviation()).toEqual(
        replicate1.standardDeviation()
      )
      expect(firstReplicate.cv()).toEqual(replicate1.cv())
    })

    it('will add the replicate to the well', () => {
      expect(well1.replicate.wells).toEqual(replicate1.wells)
      expect(well6.replicate.wells).toEqual(replicate2.wells)
    })

    it('can pass options to each replicate', () => {
      const replicate = replicateList.find('A1')
      expect(replicate.options).toEqual({ ...defaultOptions, ...options })
    })

    it('will have the correct number of decimal places', () => {
      expect(replicate2.mean().toString().split('.')[1].length).toEqual(15)
      expect(
        replicate2.standardDeviation().toString().split('.')[1].length
      ).toEqual(16)
      expect(replicate2.cv().toString().split('.')[1].length).toEqual(15)
    })
  })

  describe('#outliers', () => {
    let options, replicate

    beforeEach(() => {
      options = {
        conversionFactor: 2.59,
        units: 'nM',
        key: 'Molarity',
        assay: { type: 'Plate Reader', version: 'v1.0' },
        outlier: { type: 'cv', threshold: 20 },
        cvThreshold: 5,
      }
    })

    it('cv', () => {
      // well2 is an outlier
      well1 = new cmp({
        propsData: {
          row: 'A',
          column: '1',
          content: 'Sample X1',
          id: 'A1',
          concentration: '0.685',
        },
      })
      well2 = new cmp({
        propsData: {
          row: 'A',
          column: '2',
          content: 'Sample X1',
          id: 'A1',
          concentration: '0.960',
        },
      })
      well3 = new cmp({
        propsData: {
          row: 'A',
          column: '3',
          content: 'Sample X1',
          id: 'A1',
          concentration: '0.660',
        },
      })
      replicate = Replicate({ wells: [well1, well2, well3], options })

      replicate.outliers()
      expect(well1.outlier).toBeTruthy()
      expect(well2.outlier).toBeTruthy()
      expect(well3.outlier).toBeTruthy()

      well2.active = false
      replicate.outliers()
      expect(well1.outlier).toBeFalsy()
      expect(well2.outlier).toBeFalsy()
      expect(well3.outlier).toBeFalsy()
    })

    it('mad', () => {
      // well3 is an outlier
      options.outlier = { type: 'mad', threshold: 3.5 }
      well1 = new cmp({
        propsData: {
          row: 'A',
          column: '1',
          content: 'Sample X1',
          id: 'A1',
          concentration: '12241500',
        },
      })
      well2 = new cmp({
        propsData: {
          row: 'A',
          column: '2',
          content: 'Sample X1',
          id: 'A1',
          concentration: '12495300',
        },
      })
      well3 = new cmp({
        propsData: {
          row: 'B',
          column: '1',
          content: 'Sample X1',
          id: 'A1',
          concentration: '11008300',
        },
      })
      well4 = new cmp({
        propsData: {
          row: 'B',
          column: '2',
          content: 'Sample X1',
          id: 'A1',
          concentration: '12240200',
        },
      })
      replicate = Replicate({ wells: [well1, well2, well3, well4], options })

      replicate.outliers()
      expect(well1.outlier).toBeFalsy()
      expect(well2.outlier).toBeFalsy()
      expect(well3.outlier).toBeTruthy()
      expect(well4.outlier).toBeFalsy()

      well3.active = false
      well2.active = false
      replicate.outliers()
      expect(well1.outlier).toBeFalsy()
      expect(well2.outlier).toBeFalsy()
      expect(well3.outlier).toBeFalsy()
      expect(well4.outlier).toBeFalsy()
    })
  })

  describe('NullReplicate', () => {
    it('needs Inspection will always return false', () => {
      expect(NullReplicate.needsInspection()).toBeFalsy()
    })
  })
})
