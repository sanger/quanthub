import { describe, expect, it, beforeEach } from 'vitest'
import Grid from '@/Grid'

describe('Grid.vue', () => {
  let grid

  beforeEach(() => {
    grid = Grid()
  })

  it('has a property for quantType', () => {
    expect(grid.json.quantType).toBeDefined()
  })

  describe('creation', () => {
    let rows, keys

    const options = {
      numberOfColumns: 10,
      numberOfRows: 20,
      quantType: 'someQuantType',
      lotNumber: 'LOT1234567',
    }

    beforeEach(() => {
      grid = Grid(options)
    })

    it('sets the quantType property', () => {
      expect(grid.json.quantType).toEqual('someQuantType')
    })

    it('sets the lotNumber property', () => {
      expect(grid.json.lotNumber).toEqual('LOT1234567')
    })

    it('builds some columns', () => {
      expect(grid.json.columns).toHaveLength(options.numberOfColumns)
      expect(grid.json.columns[0]).toEqual('1')
      expect(grid.json.columns[options.numberOfColumns - 1]).toEqual(
        String(options.numberOfColumns)
      )
    })

    it('builds some rows', () => {
      rows = grid.json.rows
      keys = Object.keys(rows)
      expect(keys).toHaveLength(options.numberOfRows)
      expect(keys[0]).toEqual('A')
      expect(keys[options.numberOfRows - 1]).toEqual('T')
    })

    it('builds cells within each row', () => {
      let row = grid.json.rows.A
      expect(Object.keys(row)).toHaveLength(options.numberOfColumns)
      row = grid.json.rows.T
      expect(Object.keys(row)).toHaveLength(options.numberOfColumns)
    })

    it('adds a row, column and type to each cell', () => {
      const row = grid.json.rows.A
      expect(row['1'].row).toEqual('A')
      expect(row['1'].column).toEqual('1')
      expect(row['1'].type).toEqual('Empty')
      expect(row['10'].row).toEqual('A')
      expect(row['10'].column).toEqual('10')
      expect(row['10'].type).toEqual('Empty')
    })

    it('produces some json', () => {
      const json = grid.json
      expect(json.quantType).toEqual(grid.json.quantType)
      expect(json.lotNumber).toEqual(grid.json.lotNumber)
      expect(json.columns).toEqual(grid.json.columns)
      expect(json.rows).toEqual(grid.json.rows)
    })
  })

  describe('updating', () => {
    let wells
    const options = { numberOfColumns: 5, numberOfRows: 10 }

    beforeEach(() => {
      grid = Grid(options)
      wells = [
        {
          row: 'A',
          column: '1',
          id: 'A1',
          concentration: '0.69',
          type: 'Sample',
        },
        {
          row: 'E',
          column: '3',
          id: 'E3',
          concentration: '2.677',
          type: 'Sample',
        },
        {
          row: 'J',
          column: '5',
          id: 'J5',
          concentration: '0.665',
          type: 'Sample',
        },
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
