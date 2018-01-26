import Vue from 'vue'
import * as PlateReader from '@/lib/PlateReader'
import data from '../../data/plate_reader.json'

describe('PlateReader.js', () => {

  it('returns unique ids', () => {
      let arr = [{'id': '1'}, {'id': '2'}, {'id': '3'}, {'id': ''}, {'id': '2'}, {'id': '1'}]
      expect(PlateReader.uniqueIds(arr)).toEqual(['1','2','3'])
  })

  describe('Well', () => {

    let well

    beforeEach(() => {
      well = new PlateReader.Well('A', '1', 'Sample X1', 'B1', '5.174', true)
    })

    it('has a row', () => {
      expect(well.row).toEqual('A')
    })

    it('has a column', () => {
      expect(well.column).toEqual(1)
    })

    it('has some content', () => {
      expect(well.content).toEqual('Sample X1')
    })

    it('has an id', () => {
      expect(well.id).toEqual('B1')
    })

    it('has a concentration', () => {
      expect(well.concentration).toEqual(5.174)
    })

    it ('has a type', () => {
      expect(well.type).toEqual('Sample')
    })

    it('has a location', () => {
      expect(well.location).toEqual('A1')
    })

    it('can be identified as active or inactive', () => {
      expect(well.active).toBeTruthy()
      well.active = false
      expect(well.active).toBeFalsy()
    })
  })

  describe('Triplicate', () => {

    let well1, well2, well3, triplicate

    beforeEach(() => {
      well1 = new PlateReader.Well('A','1','Sample X1','A1','3.014')
      well2 = new PlateReader.Well('A','2','Sample X1','A1','3.163')
      well3 = new PlateReader.Well('B','1','Sample X1','A1','2.836')
    })

    describe('creating all wells up front', () => {

      beforeEach(() => {
        triplicate = new PlateReader.Triplicate([well1, well2, well3])
      })

      it ('will have three wells', () => {
        expect(triplicate.wells).toEqual([well1, well2, well3])
      })

      it('will set an average', () => {
        expect(triplicate.average).toEqual('3.004')
      })

      it('will set a standard deviation', () => {
        // average = 3.004
        // (3.014 - 3.004)squared = 0.0001
        // (3.163 - 3.004)squared = 0.025281
        // (2.836 - 3.004)squared = 0.028224
        // (0.0001 + 0.025281 + 0.028224) / 3 = 0.018
        // sqrt (0.018) = 0.134164078649987

        expect(triplicate.standardDeviation).toEqual('0.134')
      })

      it('will set a cv', () => {
        // (0.134/3.004) * 100 = 4.46
        expect(triplicate.cv).toEqual('4.461')

      })

      it('can retrieve active wells', () => {
        well3.active = false
        expect(triplicate.activeWells()).toHaveLength(2)
      })

      it('will recalculate statistics correctly if a well is rendered inactive', () => {
        well3.active = false

        // average = 3.088
        // (3.014 - 3.088)squared = 0.005
        // (3.163 - 3.088)squared = 0.006
        // (0.005 + 0.006) / 2 = 0.006
        // std = sqrt (0.006) = 0.077
        // cv = (0.077/3.088 * 100) = 2.494
        expect(triplicate.average).toEqual('3.088')
        expect(triplicate.standardDeviation).toEqual('0.077')
        expect(triplicate.cv).toEqual('2.494')

      })

    })

    describe('adding wells individually', () => {
      beforeEach(() => {
        triplicate = new PlateReader.Triplicate()
        triplicate.add(well1)
        triplicate.add(well2)
        triplicate.add(well3)
      })

      it ('will have three wells', () => {
        expect(triplicate.wells).toHaveLength(3)
      })

      it ('will create stats', () => {
        expect(triplicate.average).toEqual('3.004')
        expect(triplicate.standardDeviation).toEqual('0.134')
        expect(triplicate.cv).toEqual('4.461')
      })
    })

    describe('when it is empty', () => {
      beforeEach(() => {
        triplicate = new PlateReader.Triplicate()
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
  })

  describe('Triplicates', () => {

    let well1, well2, well3
    let well4, well5, well6
    let triplicate1, triplicate2, triplicates

    beforeEach(() => {
      well1 = new PlateReader.Well('A','1','Sample X1','A1','3.014')
      well2 = new PlateReader.Well('A','2','Sample X1','A1','3.163')
      well3 = new PlateReader.Well('B','1','Sample X1','A1','2.836')
      triplicate1 = new PlateReader.Triplicate([well1, well2, well3])

      well4 = new PlateReader.Well('A','3','Sample X9','A2','5.616')
      well5 = new PlateReader.Well('A','4','Sample X9','A2','5.341')
      well6 = new PlateReader.Well('B','3','Sample X9','A2','5.054')

      triplicate2 = new PlateReader.Triplicate([well4, well5, well6])

      triplicates = new PlateReader.Triplicates()
      triplicates.add(well1).add(well2).add(well3).add(well4).add(well5).add(well6)

    })

    it('will have the correct number of triplicates', () => {
      expect(triplicates.keys()).toEqual(['A1', 'A2'])
    })

    it('each triplicate will have correct stats', () => {
      let firstTriplicate = triplicates.find('A1')
      expect(firstTriplicate.average).toEqual(triplicate1.average)
      expect(firstTriplicate.standardDeviation).toEqual(triplicate1.standardDeviation)
      expect(firstTriplicate.cv).toEqual(triplicate1.cv)
    })

  })

  describe('Plate', () => {

    let plate

    beforeEach(() => {
      plate = new PlateReader.Plate(data.wells)
    })

    it('loads the wells', () => {
      expect(plate.wells).toHaveLength(data.wells.length)
      expect(plate.wells[0].content).toEqual(data.wells[0].content)
      expect(plate.wells[data.wells.length - 1].content).toEqual(data.wells[data.wells.length - 1].content)
    })

    it('creates the triplicates', () => {
      expect(plate.triplicates.keys()).toHaveLength(PlateReader.uniqueIds(data.wells).length)
    })

    it('triplicate will have some statistics', () => {
      let triplicate = plate.triplicates.first()
      expect(triplicate.average).toBeDefined()
      expect(triplicate.standardDeviation).toBeDefined()
      expect(triplicate.cv).toBeDefined()
    })

    // it('creates the rows', () => {
      
    // })

  })
})