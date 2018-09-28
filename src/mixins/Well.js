const Well = {
  props: {
    row: {
      default: ''
    },
    column: {
      default: ''
    },
    concentration: {
      default: ''
    },
    plateBarcode: {
      default: ''
    }
  },
  computed: {
    location () {
      return this.row.concat(this.column)
    }
  }
}

export default Well