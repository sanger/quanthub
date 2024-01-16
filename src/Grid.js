/**
 * A Grid is a method of getting the wells into the correct place.
 * The Grid is created based on the number of columns and number of rows
 * Each column is assigned a number and each row is assigned a letter
 * Each row is built separately and contains a simple object which contains
 * the row and column identifier.
 * When you add a cell the basic object is replaced.
 * The only stipulation is that it needs a row and column - advantage is that it could support any type of object.
 */

/**
 * Return the row name (eg. 'A') for the given rwo index (eg. 1)
 * Note: Begins at row 1, not 0
 *
 * @param {number} index - The index of the row (eg. 1 for row 'A')
 * @return {String} The name of the row
 */
const rowName = (index) => String.fromCharCode(64 + index)

/**
 * Return an object describing the rows makeup. Indexed by row name, with
 * values being objects indexed by column name.
 *
 * @param {number} numberOfRows - The number of rows on the plate
 * @param {Array} columns - Array of column names
 * @return {Object} Js object with row names as keys, and values being further
 *                  objects with column names as keys
 */
const buildRows = (numberOfRows, columns) => {
  const rows = {}
  for (let i = 1; i <= numberOfRows; i++) {
    const rowId = rowName(i)
    rows[rowId] = buildCells(rowId, columns)
  }
  return rows
}

/**
 * Return an object describing the row makeup. Indexed by column name, with
 * values being basic object describing the well.
 *
 * @param {String} row - The name of the row
 * @param {Array} columns - Array of column names
 * @return {Object} Js object describing the well
 */
const buildCells = (row, columns) => {
  return columns.reduce((result, column) => {
    return {
      ...result,
      [column]: { row, column, type: 'Empty' },
    }
  }, {})
}

/**
 * @typedef {import('./QuantTypeWellFactories.js').Well} Well
 */

/**
 * Return a grid representing the QC plate
 * and returns the result (eg. 60)
 *
 * @param {Object} obj - A configuration object
 * @param {string} obj.quantType - The name of the process being performed
 * @param {string} obj.lotNumber - Lot number associated with the QC process
 * @param {number} obj.numberOfColumns - The number of columns in the plate
 * @param {number} obj.numberOfRows - The number of rows in the plate
 * @param {Array} cells - Array of {@link Well}objects to populate the plate
 * @return {Object} Grid object representing the plate and its contents
 */
const grid = (
  {
    quantType = 'libraryPlateReader',
    lotNumber = '',
    numberOfColumns = 24,
    numberOfRows = 16,
  } = {},
  cells = [],
) => {
  const columns = Array.from(Array(numberOfColumns), (_v, i) => String(i + 1))
  const rows = buildRows(numberOfRows, columns)
  const add = (cell) => {
    rows[cell.row][cell.column] = cell
  }
  const addAll = (cells) => {
    for (const cell of cells) {
      add(cell)
    }
  }
  addAll(cells)

  return {
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
