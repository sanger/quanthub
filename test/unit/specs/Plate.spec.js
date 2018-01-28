import Vue from 'vue'
import Plate from '@/components/Plate'
import plateReader from '../../data/plate_reader'

describe('Plate.vue', () => {

  let cmp, wells, plate, rowSize

  beforeEach(() => {
    rowSize = 5
    cmp = Vue.extend(Plate)
    plate = new cmp({propsData: {rowSize: rowSize, wells: plateReader.wells}}).$mount()
  })

  it('must have number of columns', () => {
   expect(plate.rowSize).toEqual(rowSize)
  })

  it('must have some wells', () => {
    expect(plate.wells).toEqual(plateReader.wells)
  })

  it('will have have some columns', () => {
    let columns = plate.$el.querySelector('table').querySelectorAll('th')
    expect(columns).toHaveLength(6)
    expect(columns[1].textContent).toEqual('1')
    expect(columns[5].textContent).toEqual('5')
  })

  it('will have the correct number of rowws', () => {
    let numberOfWells = plateReader.wells.length
    let numberOfRows = (Math.floor(numberOfWells/rowSize) + (numberOfWells%rowSize > 0 ? 1 : 0))
    expect(plate.rows).toHaveLength(numberOfRows)
    expect(plate.$el.querySelector('table').querySelectorAll('.plate-row')).toHaveLength(numberOfRows)
  })
})

