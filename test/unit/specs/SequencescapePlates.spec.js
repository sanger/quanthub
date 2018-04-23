import Vue from 'vue'
import { SequencescapePlateList as Plates, Plate } from '@/lib/SequencescapePlates'
import {TriplicateList as Triplicates} from '@/lib/Triplicates'
import Well from '@/components/Well'
import { mount } from '@vue/test-utils'
import axios from 'axios'

jest.mock('axios')

describe('Plates.vue', () => {

  let plate, well1, well2, cmp, id, uuid

  beforeEach(() => {
    id = 'plate1'
    uuid = '409a47b6-b407-11e7-abfd-68b599768938'
    plate = new Plate(id)
    cmp = Vue.extend(Well)
    well1 = new cmp({propsData: {row:'A',column:'1',content:'Sample X1',id:'A1',concentration:'3.014'}})
    well2 = new cmp({propsData: {row:'B',column:'1',content:'Sample X1',id:'B1',concentration:'3.014'}})
  })

  describe('Plate', () => {

    let response

    beforeEach(() => {
      plate.triplicates.add(well1).add(well2)
      plate.uuid = uuid
    })

    it('will have an id', () => {
      expect(plate.id).toEqual(id)
    })

    it('can have a uuid', () => {
      plate.uuid = uuid
      expect(plate.uuid).toEqual(uuid)
    })

    it('will have some triplicates', () =>{
      expect(plate.triplicates).toBeDefined()
      expect(plate.triplicates).toHaveLength(2)
    })

    it('returns some json for export', () => {
      expect(plate.json).toHaveLength(2)
      let json = plate.json[0]
      expect(json.uuid).toEqual(uuid)
      expect(json.assay_type).toEqual('Plate Reader')
      expect(json.assay_version).toEqual('v1.0')
    })

    it('returns some request options for export', () => {
      plate.triplicates.add(well1).add(well2)
      expect(plate.jsonApiData).toEqual({data: {attributes: plate.json}})
      expect(plate.requestOptions).toEqual({url: '/qc_results', method: 'post', headers: {'Content-Type': 'application/vnd.api+json'}, baseURL: process.env.SEQUENCESCAPE_BASE_URL})
    })

  })

  describe('Plates', () => {

    let plates

    beforeEach(() => {
      plates = new Plates()
      plates.add(id)
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
