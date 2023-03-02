import Plate from '@/components/Plate'
import Grid from '@/Grid'
import plateReader from '../data/plate_reader'
import Store from '@/Store'
import axios from 'axios'
import flushPromises from 'flush-promises'
import { mount, localVue, createContainer } from './testHelper'

jest.mock('axios')

// TODO: we need to test outputs rather than implementation e.g. checking alert prop
// rather than element
describe('Plate.vue', () => {
  let cmp, grid, plate, $Store, barcode

  const numberOfColumns = 24
  const numberOfRows = 16
  const quantType = 'myNewQuantType'

  beforeEach(() => {
    $Store = Store
    barcode = 'DN1234567'
    grid = Grid({ quantType, numberOfColumns, numberOfRows })

    grid.addAll(Object.values(plateReader.wells))
    localStorage.setItem(barcode, JSON.stringify(grid.json))
    cmp = mount(Plate, {
      propsData: { barcode: barcode },
      mocks: { $Store },
      localVue,
      attachTo: createContainer(),
    })
    plate = cmp.vm
  })

  afterEach(() => {
    cmp.destroy()
  })

  it('will have have some columns', () => {
    const columns = plate.$el.querySelector('thead').querySelectorAll('th')
    expect(columns).toHaveLength(numberOfColumns + 1)
    expect(columns[1].textContent).toEqual(grid.json.columns[0])
    expect(columns[numberOfColumns].textContent).toEqual(
      grid.json.columns[numberOfColumns - 1]
    )
  })

  it('will have the correct number of rows', () => {
    expect(
      plate.$el.querySelector('table').querySelectorAll('.plate-row')
    ).toHaveLength(numberOfRows)
  })

  it('can have a barcode', () => {
    expect(
      plate.$el.querySelector('.row').querySelector('h3').textContent
    ).toEqual('Plate: ' + barcode)
  })

  it('will create a sequencescape plate in the store', () => {
    expect($Store.qcAssayList.find(barcode).barcode).toEqual(barcode)
  })

  it('will create a new grid for saving', () => {
    const newGrid = plate.toGrid()
    expect(newGrid.quantType).toEqual(quantType)
    expect(newGrid.columns).toEqual(grid.json.columns)
    expect(Object.keys(newGrid.rows)).toHaveLength(
      Object.keys(newGrid.rows).length
    )
  })

  it('will have a quantType', () => {
    expect(plate.quantType).toBeDefined()
    expect(plate.quantType.key).toBeDefined()
    expect(plate.quantType.replicateOptions).toBeDefined()
  })

  it('allows the user to enter a lot number', () => {
    const input = cmp.find('input[type="text"]')
    input.setValue('LOT1234567')
    expect(plate.lotNumber).toEqual('LOT1234567')
  })

  describe('saving', () => {
    beforeEach(() => {
      cmp.setData({ lotNumber: 'LOT1234567' })
      localStorage.clear()
    })

    it('will update local storage with updated data', () => {
      const well = plateReader.wells[0]
      plate.$el.querySelector('td').click()
      cmp.find('#save').trigger('click')
      const json = JSON.parse(localStorage.getItem(barcode))
      expect(json.lotNumber).toEqual('LOT1234567')
      expect(Object.keys(json.rows)).toHaveLength(numberOfRows)
      expect(json.rows[well.row][well.column].active).toBeFalsy()
      expect(plate.$refs.alert.message).toEqual('Plate saved to local storage')
    })

    afterEach(() => {
      localStorage.clear()
    })
  })

  describe('exporting', () => {
    beforeEach(() => {
      cmp.setData({ lotNumber: 'LOT1234567' })
    })

    it('has some json', () => {
      const json = plate.json
      expect(json.lot_number).toEqual('LOT1234567')
      expect(json.qc_results).toHaveLength(plate.replicates.size())
    })

    it('returns some request options for export', () => {
      expect(plate.jsonApiData).toEqual({
        data: { data: { attributes: plate.json } },
      })
      expect(plate.requestOptions).toEqual({
        url: '/qc_assays',
        method: 'post',
        headers: { 'Content-Type': 'application/vnd.api+json' },
        baseURL: process.env.VUE_APP_SEQUENCESCAPE_BASE_URL,
      })
    })

    it('success', async () => {
      axios.mockResolvedValue({ data: { status: 201 } })
      cmp.find('#export').trigger('click')
      await flushPromises()
      expect(plate.$refs.alert.message).toEqual(
        'QC Results for plate has been successfully exported to Sequencescape'
      )
      expect(axios).toBeCalledWith(plate.request)
    })

    it('failure', async () => {
      axios.mockRejectedValue({ data: { status: 422 } })
      cmp.find('#export').trigger('click')
      await flushPromises()
      expect(plate.$refs.alert.message).toEqual(
        'QC Results for plate could not be exported'
      )
    })
  })
})
