import Vue from 'vue'
import QcAssayList from '@/QcAssays'
import Plate from '@/components/Plate'

describe('Plates.vue', () => {
  let plate, cmp, qcAssayList

  beforeEach(() => {
    cmp = Vue.extend(Plate)
    plate = new cmp({ propsData: { barcode: 'DN1234567' } })
    qcAssayList = QcAssayList()
    qcAssayList.add(plate)
  })

  it('will find an existing plate', () => {
    expect(qcAssayList.size()).toEqual(1)
    expect(qcAssayList.find(plate.barcode)).toEqual(plate)
  })

  it('will return an empty plate if it does not exist', () => {
    plate = qcAssayList.find('DN2345678')
    expect(plate.barcode).toEqual('empty')

    plate = qcAssayList.find('')
    expect(plate.barcode).toEqual('empty')
  })
})
