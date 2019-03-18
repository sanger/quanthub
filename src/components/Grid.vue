
<script>

// Grid.vue
// A Grid is a method of getting the wells into the correct place.
// The Grid is created based on the number of columns and number of rows
// Each column is assigned a number and each row is assigned a letter
// Each row is built separately and contains a simple object which contains
// the row and column identifier.
// When you add a cell the basic object is replaced.
// The only stipulation is that it needs a row and column - advantage is that it could support any type of object.
export default {
  name: 'Grid',
  props: {
    quantType: {
      type: String,
      default: 'libraryPlateReader'
    },
    lotNumber: {
      type: String,
      default: ''
    },
    numberOfColumns: {
      type: Number,
      default: 24
    },
    numberOfRows: {
      type: Number,
      default: 16
    }
  },
  data () {
    return {
      msg: 'Grid'
    }
  },
  computed: {
    columns () {
      return Array.from(Array(this.numberOfColumns), (e, i) => String(i + 1))
    },
    rows () {
      return this.buildRows()
    },
    json () {
      return {
        quantType: this.quantType,
        lotNumber: this.lotNumber,
        columns: this.columns,
        rows: this.rows
      }
    }
  },
  components: {
  },
  methods: {
    buildRows () {
      let rows = {}
      for (let i = 1; i <= this.numberOfRows; i++) {
        let rowId = String.fromCharCode(64 + i)
        rows[rowId] = this.buildCells(rowId)
      }
      return rows
    },
    buildCells (rowId) {
      let cells = {}
      for (let column of this.columns) {
        cells[column] = {row: rowId, column: String(column), type: 'Empty'}
      }
      return cells
    },
    add (cell) {
      this.rows[cell.row][cell.column] = cell
    },
    addAll (cells) {
      for (let cell of cells) {
        this.add(cell)
      }
    },
    find (row, column) {
      return this.rows[row][column]
    }
  }
}
</script>
