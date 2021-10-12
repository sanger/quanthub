
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
    },
    defaultFields: {
      type: Object,
      default () {
        return {
          'row' : 'row',
          'column': 'column',
          'concentration': 'concentration',
          'type': 'type'
        }
      }
    },
    extraFields: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    location () {
      return this.row.concat(this.column)
    },
    fields () {
      return {...this.defaultFields, ...this.extraFields}
    },
    json () {
      var self = this
      return Object.keys(this.fields).reduce((result, key) => {
        result[key] = self[this.fields[key]]
        return result
      }, {})
    }
  }
}

export default WellProperties
