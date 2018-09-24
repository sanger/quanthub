import Vue from 'vue'
import Well from '@/components/Well'
import {TriplicateList as Triplicates, Triplicate, NullTriplicate} from '@/Triplicates'

describe('Triplicates.vue', () => {

  let cmp, well1, well2, well3

  beforeEach(() => {
    cmp = Vue.extend(Well)
    well1 = new cmp({propsData: {row:'A',column:'1',content:'Sample X1',id:'A1',concentration:'3.014', plateBarcode: 'DN1234567'}})
    well2 = new cmp({propsData: {row:'A',column:'2',content:'Sample X1',id:'A1',concentration:'3.163', plateBarcode: 'DN1234567'}})
    well3 = new cmp({propsData: {row:'B',column:'1',content:'Sample X1',id:'A1',concentration:'2.836', plateBarcode: 'DN1234567'}})
  })

  describe('Triplicate', () => {

    let triplicate

    describe('creating all wells up front', () => {

      beforeEach(() => {
        triplicate = new Triplicate([well1, well2, well3], {cvThreshold: 20})
      })

      it('will have three wells', () => {
        expect(triplicate.wells).toEqual([well1, well2, well3])
      })

      it('will set an average', () => {
        expect(triplicate.average).toEqual('3.004')
      })

      it('must have some options', () => {
        expect(triplicate.options.key).toBeDefined()
        expect(triplicate.options.units).toBeDefined()
        expect(triplicate.options.conversionFactor).toBeDefined()
      }) 

      it('will set a standard deviation', () => {
        // average = 3.004
        // (3.014 - 3.004)squared = 0.0001
        // (3.163 - 3.004)squared = 0.025281
        // (2.836 - 3.004)squared = 0.028224
        // (0.0001 + 0.025281 + 0.028224) / 3 = 0.027
        // sqrt (0.018) = 0.163714690849661

        expect(triplicate.standardDeviation).toEqual('0.164')
      })

      it('will have an id', () => {
        expect(triplicate.id).toEqual(well1.id)
      })

      it('will have a plate barcode', () => {
        expect(triplicate.plateBarcode).toEqual('DN1234567')
      })
      
      it('will set a cv', () => {
        // (0.164/3.004) * 100 = 5.459
        expect(triplicate.cv).toEqual('5.459')
        expect(triplicate.needsInspection()).toBeFalsy()
      })

      it('can retrieve active wells', () => {
        well3.isActive = false
        expect(triplicate.activeWells).toHaveLength(2)
      })

      it('will recalculate statistics correctly if a well is rendered inactive', () => {
        well3.isActive = false

        // average = 3.088
        // nM = 7.998
        // (3.014 - 3.088)squared = 0.005
        // (3.163 - 3.088)squared = 0.006
        // (0.005 + 0.006) / 1 = 0.011
        // std = sqrt (0.011) = 0.105
        // cv = (0.105/3.088 * 100) = 3.400
        expect(triplicate.average).toEqual('3.088')
        expect(triplicate.standardDeviation).toEqual('0.105')
        expect(triplicate.cv).toEqual('3.400')
      })

      it('will return some json for exporting purposes', () => {
        expect(triplicate.json).toEqual({
          barcode: triplicate.plateBarcode,
          well_location: triplicate.id, 
          key: triplicate.options.key, 
          value: triplicate.adjustedAverage, 
          units: triplicate.options.units, 
          cv: triplicate.cv, assay_type: 
          triplicate.options.assay.type, 
          assay_version: triplicate.options.assay.version
        })
      })

    })

    describe('conversion', () => {

      it('just works with no options added', () => {
        triplicate = new Triplicate([well1, well2, well3])
        expect(triplicate.adjustedAverage).toEqual(triplicate.average)
      })

      it('works with option as a number', () => {
        triplicate = new Triplicate([well1, well2, well3], {conversionFactor: 2.590})
        expect(triplicate.adjustedAverage).toEqual('7.780')
      })

      it('works with option as an expression', () => {
        triplicate = new Triplicate([well1, well2, well3], {conversionFactor: ((1000000 / 660) * (1 / 585))})
        expect(triplicate.adjustedAverage).toEqual('7.780')
      })
    })

    describe('cv threshold', () => {

      let well4, well5, well6
      
      beforeEach(() => {
        well4 = new cmp({propsData: { row: 'A', column: '1', content:'Sample X1', id: 'A1', concentration: '0.685'}})
        well5 = new cmp({propsData: { row: 'A', column: '2', content:'Sample X1', id: 'A1', concentration: '0.960'}})
        well6 = new cmp({propsData: { row: 'A', column: '3', content:'Sample X1', id: 'A1', concentration: '0.660'}})
        triplicate = new Triplicate([well4, well5, well6], {cvThreshold: 20})
      })

      it('will have a cv threshold', () => {
        expect(triplicate.cvThreshold).toEqual(20.000)
      })

      it('will indicate whether the triplicate needs to be inspected', () => {
        expect(triplicate.needsInspection()).toBeTruthy()
      })

      it('will indicate whether triplicate needs to be inspected at the threshold', () => {
        well5 = new cmp({propsData: { row: 'A', column: '2', content:'Sample X1', id: 'A1', concentration: '0.935'}})
        triplicate = new Triplicate([well4, well5, well6], {cvThreshold: 20})
        expect(triplicate.needsInspection()).toBeTruthy()
      })
    })

    describe('adding wells individually', () => {
      beforeEach(() => {
        triplicate = new Triplicate()
        triplicate.add(well1)
        triplicate.add(well2)
        triplicate.add(well3)
      })

      it ('will have three wells', () => {
        expect(triplicate.wells).toHaveLength(3)
      })

      it ('will create stats', () => {
        expect(triplicate.average).toEqual('3.004')
        expect(triplicate.standardDeviation).toEqual('0.164')
        expect(triplicate.cv).toEqual('5.459')
      })
    })

    describe('when it is empty', () => {
      beforeEach(() => {
        triplicate = new Triplicate()
      })

      it('will indicate it is empty', () => {
        expect(triplicate.empty()).toBeTruthy()
      })

      it('will produce stats without error', () => {
        expect(triplicate.average).toEqual('0')
        expect(triplicate.standardDeviation).toEqual('0')
        expect(triplicate.cv).toEqual('0')
      })
    })

    describe('when a well has an invalid value', () => {
      beforeEach(() => {
        well2.concentration = 'n.a.'
        well3.concentration = 'n.a.'
        triplicate = new Triplicate([well1, well2, well3])
      })

      it('will exclude those values from the triplicate', () => {
        expect(triplicate.average).toEqual(well1.concentration)
      })
    })

    describe('when there is only one value', () => {
      beforeEach(() => {
        triplicate = new Triplicate([well1])
      })

      it('standard deviation will be 0', () => {
        expect(triplicate.standardDeviation).toEqual('0')
      })

      it('cv will be 0', () => {
        expect(triplicate.cv).toEqual('0')
      })
    })

    describe('when the values are really small', () => {
      beforeEach(() => {
        well1.concentration = '0.0000142'
        well2.concentration = '0.0000142'
        well3.concentration = '0.0000142'
        triplicate = new Triplicate([well1, well2, well3])
      })

      it('standard deviation will be 0', () => {
        expect(triplicate.standardDeviation).toEqual('0.000')
      })

      it('cv will be 0', () => {
        expect(triplicate.cv).toEqual('0')
      })
    })

    describe('when all 3 values are n.a.', () => {
      beforeEach(() => {
        well1.concentration = 'n.a.'
        well2.concentration = 'n.a.'
        well3.concentration = 'n.a.'
        triplicate = new Triplicate([well1, well2, well3])
      })

      it('standard deviation will be 0', () => {
        expect(triplicate.standardDeviation).toEqual('0')
      })

      it('cv will be 0', () => {
        expect(triplicate.cv).toEqual('0')
      })

      it('still has an id', () => {
        expect(triplicate.id).toEqual(well1.id)
      })
    })
  })

  describe('Triplicates', () => {

    let well4, well5, well6
    let triplicate1, triplicate2, triplicates, options

    beforeEach(() => {
      options = {conversionFactor: 2.590, units: 'nM', key: 'Molarity', assay: {type: "Plate Reader", version: "v1.0"}, cvThreshold: 5}
      triplicate1 = new Triplicate([well1, well2, well3], options)

      well4 = new cmp({propsData: {row:'A',column:'3',content:'Sample X9',id:'A2',concentration:'5.616'}})
      well5 = new cmp({propsData: {row:'A',column:'4',content:'Sample X9',id:'A2',concentration:'5.341'}})
      well6 = new cmp({propsData: {row:'A',column:'5',content:'Sample X9',id:'A2',concentration:'5.054'}})

      triplicate2 = new Triplicate([well4, well5, well6], options)

      triplicates = new Triplicates(options)
      triplicates.add(well1).add(well2).add(well3).add(well4).add(well5).add(well6)

    })

    it('will have the correct number of triplicates', () => {
      expect(Array.from(triplicates.keys)).toEqual(['A1', 'A2'])
    })

    it('each triplicate will have correct stats', () => {
      let firstTriplicate = triplicates.find('A1')
      expect(firstTriplicate.average).toEqual(triplicate1.average)
      expect(firstTriplicate.standardDeviation).toEqual(triplicate1.standardDeviation)
      expect(firstTriplicate.cv).toEqual(triplicate1.cv)
    })

    it('will add the triplicate to the well', () => {
      expect(well1.triplicate).toEqual(triplicate1)
      expect(well6.triplicate).toEqual(triplicate2)
    })

    it('can pass options to each triplicate', () => {
      let triplicate = triplicates.find('A1')
      expect(triplicate.options).toEqual(options)
    })

  })

  describe('NullTriplicate', () => {
    it('size will always return 0', () => {
      expect(NullTriplicate.size).toEqual(0)
    })

    it('needs Inspection will always return false', () => {
      expect(NullTriplicate.needsInspection()).toBeFalsy()
    })
  })
})
