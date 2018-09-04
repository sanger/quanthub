import Vue from 'vue'
import { SequencescapePlateList as Plates } from '@/SequencescapePlates'
import Plate from '@/components/Plate'

describe('Plates.vue', () => {

  let plate, cmp, plates

  beforeEach(() => {
    cmp = Vue.extend(Plate)
    plate = new cmp({propsData: {id:'plate1'}})
    plates = new Plates()
    plates.add(plate)
  })

  it('will find an existing plate', () => {
    expect(plates).toHaveLength(1)
    expect(plates.find(plate.id)).toEqual(plate)
  })

  it('will return an empty plate if it does not exist', () => {
    plate = plates.find('plate2')
    expect(plate.id).toEqual('empty')

    plate = plates.find('')
    expect(plate.id).toEqual('empty')

  })

})
