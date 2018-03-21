import Vue from 'vue'
import Plates from '@/components/Plates'
import { mount } from '@vue/test-utils'
import plateReader from '../../data/plate_reader'
import Grid from '@/components/Grid'

describe('Plates.vue', () => {

  let cmp, vm, plate, plates, grid

  beforeEach(() => {

    localStorage.clear()

    grid = Vue.extend(Grid)

    plate = new(grid)
    plate.addAll(plateReader.wells)
    localStorage.setItem('plate1', JSON.stringify(plate.json))
    localStorage.setItem('plate2', JSON.stringify(plate.json))
    localStorage.setItem('plate3', JSON.stringify(plate.json))

    cmp = mount(Plates, {})
    plates = cmp.vm
  })

  it('will have a msg', () => {
    expect(plates.msg).toEqual('Plates')
  })

  it('will include plates which are part of local storage', () => {
    let items = plates.$el.querySelectorAll('a')
    expect(items).toHaveLength(3)
    expect(items[0].textContent).toEqual('plate1')
  })

})
