import Vue from 'vue'
import Plate from '@/components/Plate'
import Grid from '@/components/Grid'
import plateReader from '../../data/plate_reader'
import Store from '@/lib/Store'
import { mount } from '@vue/test-utils'

describe('Plate.vue', () => {

  let cmp, vm, grid, plate, $Store, id

  beforeEach(() => {
    $Store = Store
    id = 'plate1'
    grid = new(Vue.extend(Grid))
    grid.addAll(plateReader.wells)
    cmp = mount(Plate, {mocks: { $Store }})
    cmp.setData({id: id, grid: grid})
    plate = cmp.vm
  })

  it('will have a grid', () => {
    expect(plate.grid).toEqual(grid)
  })

  it('will have have some columns', () => {
    let columns = plate.$el.querySelector('thead').querySelectorAll('th')
    expect(columns).toHaveLength(grid.numberOfColumns + 1)
    expect(columns[1].textContent).toEqual(grid.columns[0])
    expect(columns[grid.numberOfColumns].textContent).toEqual(grid.columns[grid.numberOfColumns - 1])
  })

  it('will have the correct number of rows', () => {
    expect(plate.$el.querySelector('table').querySelectorAll('.plate-row')).toHaveLength(grid.numberOfRows)
  })

  it('can have an id', () => {
    expect(plate.$el.querySelector('h3').textContent).toEqual('Plate: ' + id)
  })
})
