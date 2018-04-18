import Vue from 'vue'
import { SequencescapePlateList as Plates, Plate } from '@/lib/SequencescapePlates'
import {TriplicateList as Triplicates} from '@/lib/Triplicates'
import Well from '@/components/Well'
import { mount } from '@vue/test-utils'
import axios from 'axios'

jest.mock('axios')

describe('Plates.vue', () => {

  let plate, well1, well2, cmp

  beforeEach(() => {
    plate = new Plate('plate1')
    cmp = Vue.extend(Well)
    well1 = new cmp({propsData: {row:'A',column:'1',content:'Sample X1',id:'A1',concentration:'3.014'}})
    well2 = new cmp({propsData: {row:'B',column:'1',content:'Sample X1',id:'B1',concentration:'3.014'}})
  })

  describe('Plate', () => {

    let response

    beforeEach(() => {
      response = {data: '409a47b6-b407-11e7-abfd-68b599768938'}
      axios.get.mockResolvedValue(response)
      plate.triplicates.add(well1).add(well2)
    })

    it('will have an id', () => {
      expect(plate.id).toEqual('plate1')
    })

    it('will return a uuid', () => {
      return plate.uuid.then(uuid => expect(uuid).toEqual(response.data))
    })

    it('will have some triplicates', () =>{
      expect(plate.triplicates).toBeDefined()
      expect(plate.triplicates).toHaveLength(2)
    })

    it('returns some json for export', () => {
      expect(plate.json).toHaveLength(2)
      let json = plate.json[0]
      json.uuid.then(uuid => expect(uuid).toEqual(response.data))
      expect(json.assay_type).toEqual('Plate Reader')
      expect(json.assay_version).toEqual('v1.0')
    })
  })

  describe('Export to Sequencescape', () => {

    beforeEach(() => {
      plate.triplicates.add(well1).add(well2)
    })

    it('produces data in the correct format', () => {
      expect(plate.jsonApiData).toEqual({data: {attributes: plate.json}})
    })

    it('produces the correct request options and data', () => {
      expect(plate.requestOptions).toEqual({url: '/qc_results', method: 'post', headers: {'content-type': 'application/vnd.api+json'}, baseURL: process.env.SEQUENCESCAPE_BASE_URL})
    })

    it('success', async() => {
      axios.mockResolvedValue('QC Results for plate has been successfully exported to Sequencescape')
      let result = await plate.export()
      expect(result).toEqual('QC Results for plate has been successfully exported to Sequencescape')
      expect(axios).toBeCalledWith(plate.request)
    })

    it('failure', async() => {
      axios.mockRejectedValue('QC Results for plate could not be exported')
      let result = await plate.export()
      expect(result).toEqual('QC Results for plate could not be exported')
    })
  })

  describe('Plates', () => {

    let plates

    beforeEach(() => {
      plates = new Plates()
      plates.add('plate1')
    })

    it('will find an existing plate', () => {
      expect(plates).toHaveLength(1)
      expect(plates.find(plate.id)).toEqual(plate)
    })

    it('adding an existing plate will reset it', () => {
      plates.find('plate1').triplicates.add(well1)
      plates.add('plate1')
      expect(plates).toHaveLength(1)
      expect(plates.find('plate1').triplicates).toHaveLength(0)
    })

    describe('empty', () => {

      it('will be returned if plate does not exist', () => {
        plate = plates.find('plate2')
        expect(plate.id).toEqual('empty')

        plate = plates.find('')
        expect(plate.id).toEqual('empty')
      })
    })

  })

})
