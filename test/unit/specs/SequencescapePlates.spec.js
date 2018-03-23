import Vue from 'vue'
import { SequencescapePlateList as Plates, Plate } from '@/lib/SequencescapePlates'
import {TriplicateList as Triplicates} from '@/lib/Triplicates'
import Well from '@/components/Well'
import { mount } from '@vue/test-utils'
import axios from 'axios'

jest.mock('axios')

describe('Plates.vue', () => {

  let plate, well, cmp

  beforeEach(() => {
    plate = new Plate('plate1')
    cmp = Vue.extend(Well)
    well = new cmp({propsData: {row:'A',column:'1',content:'Sample X1',id:'A1',concentration:'3.014'}})
    
  })

  describe('Plate', () => {

    it ('will have an id', () => {
      expect(plate.id).toEqual('plate1')
    })

    it ('will return a uuid', () => {
      const resp = {data: '409a47b6-b407-11e7-abfd-68b599768938'}
      axios.get.mockResolvedValue(resp)
      return plate.uuid.then(uuid => expect(uuid).toEqual(resp.data))
    })

    it ('will have some triplicates', () =>{
      expect(plate.triplicates).toBeDefined()
      plate.triplicates.add(well)
      expect(plate.triplicates).toHaveLength(1)
    })
  })

  describe('Plates', () => {

    let plates

    beforeEach(() => {
      plates = new Plates()
      plates.add('plate1')
    })

    it('will find a existing plate', () => {
      expect(plates).toHaveLength(1)
      expect(plates.find(plate.id)).toEqual(plate)
    })

    it('adding an existing plate will reset it', () => {
      plates.find('plate1').triplicates.add(well)
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
