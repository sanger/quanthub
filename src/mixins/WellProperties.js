import Vue from 'vue'

const WellProperties = {
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
    },
    type: {
      default: 'Base'
    }
  },
  computed: {
    location () {
      return this.row.concat(this.column)
    },
    json () {
      return {
        row: this.row,
        column: this.column,
        type: this.type,
        concentration: this.concentration
      }
    }
  },
  created () {
    console.log(Vue.config.optionMergeStrategies.json)
  }
}

export default WellProperties