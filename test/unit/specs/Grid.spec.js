import Vue from 'vue'
import Grid from '@/components/Grid'
import { PlateReader } from '@/lib/QuantTypes'

describe('Grid.vue', () => {

  let cmp, grid

  beforeEach(() => {
    cmp = Vue.extend(Grid)
    grid = new cmp({})
  })

  it('has a message', () => {
    expect(grid.msg).toEqual('Grid')
  })

  it('has a property for number of columns', () => {
    expect(grid.numberOfColumns).toBeDefined()
  })

  it('has a property for number of rows', () => {
    expect(grid.numberOfRows).toBeDefined()
  })

  it('has a property for quantType', () => {
    expect(grid.quantType).toBeDefined()
  })

  describe('creation', () => {

    let cols, rows, keys

    beforeEach(() => {
      grid = new cmp({propsData: { numberOfColumns: 10, numberOfRows: 20, quantType: 'someQuantType'}})
    })

    it('sets the quantType property', () => {
      expect(grid.quantType).toEqual('someQuantType')
    })

    it('builds some columns', () => {
      expect(grid.columns).toHaveLength(grid.numberOfColumns)
      expect(grid.columns[0]).toEqual('1')
      expect(grid.columns[grid.numberOfColumns - 1]).toEqual(String(grid.numberOfColumns))
    })

    it('builds some rows', () => {
      rows = grid.rows
      keys = Object.keys(rows)
      expect(keys).toHaveLength(grid.numberOfRows)
      expect(keys[0]).toEqual('A')
      expect(keys[grid.numberOfRows - 1]).toEqual('T')
    })

    it('builds cells within each row', () => {
      let row = grid.rows.A
      expect(Object.keys(row)).toHaveLength(grid.numberOfColumns)
      row = grid.rows.T
      expect(Object.keys(row)).toHaveLength(grid.numberOfColumns)
    })

    it('adds a row and column to each cell', () => {
      let row = grid.rows.A
      expect(row['1'].row).toEqual('A')
      expect(row['1'].column).toEqual('1')
      expect(row['10'].row).toEqual('A')
      expect(row['10'].column).toEqual('10')
    })

    it('produces some json', () => {
      let json = grid.json
      expect(json.quantType).toEqual(grid.quantType)
      expect(json.columns).toEqual(grid.columns)
      expect(json.rows).toEqual(grid.rows)
    })

  })

  describe('updating', () => {

    let wells

    beforeEach(() => {
      grid = new cmp({propsData: { numberOfColumns: 5, numberOfRows: 10}})
      wells = [ { row: 'A', column: '1', id: 'A1', concentration: '0.69', type: 'Sample' },
                { row: 'E', column: '3', id: 'E3', concentration: '2.677', type: 'Sample' },
                { row: 'J', column: '5', id: 'J5', concentration: '0.665', type: 'Sample' }
              ]
    })

    it('allows a new cell to be added', () => {
      grid.add(wells[0])
      expect(grid.find('A', '1')).toEqual(wells[0])
    })

    it('allows a number of cells to be added', () => {
      grid.addAll(wells)
      expect(grid.find('A', '1')).toEqual(wells[0])
      expect(grid.find('E', '3')).toEqual(wells[1])
      expect(grid.find('J', '5')).toEqual(wells[2])
    })

  })
  
})