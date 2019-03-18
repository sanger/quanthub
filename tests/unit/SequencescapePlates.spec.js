import Vue from 'vue'
import { SequencescapePlateList as Plates } from '@/SequencescapePlates'
import Plate from '@/components/Plate'

describe('Plates.vue', () => {

  let plate, cmp, plates

  beforeEach(() => {
    cmp = Vue.extend(Plate)
    plate = new cmp({propsData: {barcode:'DN1234567'}})
    plates = new Plates()
    plates.add(plate)
  })

  it('will find an existing plate', () => {
    expect(plates).toHaveLength(1)
    expect(plates.find(plate.barcode)).toEqual(plate)
  })

  it('will return an empty plate if it does not exist', () => {
    plate = plates.find('DN2345678')
    expect(plate.barcode).toEqual('empty')

    plate = plates.find('')
    expect(plate.barcode).toEqual('empty')

  })

})
