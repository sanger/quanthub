import QcAssayList from '@/QcAssays'

const plate = { barcode: 'DN1234567' }

describe('QcAssays.js', () => {
  it('will find an existing plate', () => {
    const qcAssayList = QcAssayList()
    qcAssayList.add(plate)
    expect(qcAssayList.size()).toEqual(1)
    expect(qcAssayList.find(plate.barcode)).toEqual(plate)
  })

  it('will return an empty plate if it does not exist', () => {
    const qcAssayList = QcAssayList()
    qcAssayList.add(plate)
    expect(qcAssayList.find('DN2345678').barcode).toEqual('empty')
    expect(qcAssayList.find('').barcode).toEqual('empty')
  })
})
