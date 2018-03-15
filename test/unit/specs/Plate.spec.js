import Vue from 'vue'
import Plate from '@/components/Plate'
import plateReader from '../../data/plate_reader'
import Store from '@/lib/Store'
import { mount } from '@vue/test-utils'

describe('Plate.vue', () => {

  let cmp, vm, wells, plate, rowSize, $Store, id

  beforeEach(() => {
    $Store = Store
    rowSize = 5
    id = 'plate1'
    cmp = mount(Plate, {mocks: { $Store }, propsData: {rowSize: rowSize}})
    cmp.setData({id: id, wells: plateReader.wells})
    plate = cmp.vm
  })

  it('must have number of columns', () => {
   expect(plate.rowSize).toEqual(rowSize)
  })

  it('must have some wells', () => {
    expect(plate.wells).toEqual(plateReader.wells)
  })

  it('will have have some columns', () => {
    let columns = plate.$el.querySelector('thead').querySelectorAll('th')
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

  it('can have an id', () => {
    expect(plate.$el.querySelector('h3').textContent).toEqual('Plate: ' + id)
  })
})

