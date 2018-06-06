<script>

export default {
  name: 'Grid',
  props: {
    quantType: {
      type: String,
      default: 'plateReader'
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
        cells[column] = {row: rowId, column: String(column)}
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
