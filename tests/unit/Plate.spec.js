import Vue from 'vue'
import Plate from '@/components/Plate'
import Grid from '@/components/Grid'
import plateReader from '../data/plate_reader'
import Store from '@/Store'
import { mount } from '@vue/test-utils'
import axios from 'axios'
import flushPromises from 'flush-promises'

jest.mock('axios')

// TODO: we need to test outputs rather than implementation e.g. checking alert prop
// rather than element
describe('Plate.vue', () => {

  let cmp, grid, plate, $Store, barcode

  beforeEach(() => {
    $Store = Store
    barcode = 'DN1234567'
    grid = new(Vue.extend(Grid))({ propsData: { quantType: 'myNewQuantType'}})
    grid.addAll(Object.values(plateReader.wells))
    localStorage.setItem(barcode, JSON.stringify(grid.json))
    // we need to stub b-alert and b-modal as they are not loaded on a mount.
    cmp = mount(Plate, {propsData: { barcode: barcode }, mocks: { $Store }, stubs: ['b-alert', 'b-modal']})
    plate = cmp.vm
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

  it('can have a barcode', () => {
    expect(plate.$el.querySelector('.row').querySelector('h3').textContent).toEqual('Plate: ' + barcode)
  })

  it('will create a sequencescape plate in the store', () => {
    expect($Store.sequencescapePlates.find(barcode).barcode).toEqual(barcode)
  })

  it('will create a new grid for saving', () => {
    let newGrid = plate.toGrid()
    expect(newGrid.quantType).toEqual(grid.quantType)
    expect(newGrid.columns).toEqual(grid.json.columns)
    expect(Object.keys(newGrid.rows)).toHaveLength(Object.keys(newGrid.rows).length)
  })

  it('will have a quantType', () => {
    expect(plate.quantType).toBeDefined()
    expect(plate.quantType.key).toBeDefined()
    expect(plate.quantType.triplicateOptions).toBeDefined()
  })

  describe('saving', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('will update local storage with updated data', () => {
      let well = plateReader.wells[0]
      plate.$el.querySelector('td').click()
      cmp.find('#save').trigger('click')
      let json = JSON.parse(localStorage.getItem(barcode))
      expect(Object.keys(json.rows)).toHaveLength(grid.numberOfRows)
      expect(json.rows[well.row][well.column].active).toBeFalsy()
      expect(plate.$refs.alert.message).toEqual('Plate saved to local storage')
    })

    afterEach(() => {
      localStorage.clear()
    })
  })

  describe('exporting', () => {

    it('has some json', () => {
      expect(plate.json).toHaveLength(plate.triplicates.size)
    })

    it('returns some request options for export', () => {
      expect(plate.jsonApiData).toEqual({data: { data: {attributes: plate.json}}})
      expect(plate.requestOptions).toEqual({url: '/qc_results', method: 'post', headers: {'Content-Type': 'application/vnd.api+json'}, baseURL: process.env.VUE_APP_SEQUENCESCAPE_BASE_URL})
    })

    it('success', async() => {
      axios.mockResolvedValue({ data: {status: 201}})
      cmp.find('#export').trigger('click')
      await flushPromises()
      expect(plate.$refs.alert.message).toEqual('QC Results for plate has been successfully exported to Sequencescape')
      expect(axios).toBeCalledWith(plate.request)
    })

    it('failure', async() => {
      axios.mockRejectedValue({ data: { status: 422}})
      cmp.find('#export').trigger('click')
      await flushPromises()
      expect(plate.$refs.alert.message).toEqual('QC Results for plate could not be exported')
    })
  })

})
