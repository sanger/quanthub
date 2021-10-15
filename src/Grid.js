/**
 * I'm currently in the place of refactoring Grid into a plain JS object
 * This is where it will be housed. Currently this is simply wrapping the vue
 * component so that we can refactor gradually.
 *
 * A Grid is a method of getting the wells into the correct place.
 * The Grid is created based on the number of columns and number of rows
 * Each column is assigned a number and each row is assigned a letter
 * Each row is built separately and contains a simple object which contains
 * the row and column identifier.
 * When you add a cell the basic object is replaced.
 * The only stipulation is that it needs a row and column - advantage is that it could support any type of object.
 */

const buildRows = (numberOfRows, columns) => {
  let rows = {}
  for (let i = 1; i <= numberOfRows; i++) {
    let rowId = String.fromCharCode(64 + i)
    rows[rowId] = buildCells(rowId, columns)
  }
  return rows
}

const buildCells = (rowId, columns) => {
  let cells = {}
  for (let column of columns) {
    cells[column] = { row: rowId, column: String(column), type: 'Empty' }
  }
  return cells
}

const grid = ({
  quantType = 'libraryPlateReader',
  lotNumber = '',
  numberOfColumns = 24,
  numberOfRows = 16,
} = {}) => {
  const columns = Array.from(Array(numberOfColumns), (e, i) => String(i + 1))
  const rows = buildRows(numberOfRows, columns)
  const add = (cell) => {
    rows[cell.row][cell.column] = cell
  }
  const addAll = (cells) => {
    for (let cell of cells) {
      add(cell)
    }
  }

  return {
    columns,
    rows,
    quantType,
    lotNumber,
    numberOfColumns,
    numberOfRows,
    msg: 'Grid',
    addAll,
    add,
    find(row, column) {
      return rows[row][column]
    },
    json: {
      quantType,
      lotNumber,
      columns,
      rows,
    },
  }
}
export default grid
