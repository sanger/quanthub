<script>

import math from 'mathjs'
import * as Cells from '@/lib/QuantTypes'
import quantTypes from '../../config/quantTypes'

export default {
  name: 'QuantType',
  props: ['quantType'],
  data () {
    return {
      key: 'quantType',
      name: 'Quant Type',
      cellType: 'QuantType',
      parse: {
        delimiter: ',',
        from: 16,
        rowDelimiter: ['\r\n', '\r', '\n'],
        columns: ['column1', 'column2', 'column3', 'column4', 'column5']
      },
      metadata: {rows: 1, idColumn: 'id', delimiter: ','},
      conversion: {factors: {}, expression: 1},
      qcResults: {
        key: 'Concentration',
        units: 'ng',
        assay: {type: 'Quant Type', version: 'v1.0'}
      }
    }
  },
  components: {
  },
  computed: {
    conversionFactor () {
      let factors = this.conversion.factors
      return math.eval(Object.keys(factors).reduce((factor, key) => {
        return factor.replace(key, factors[key])
      }, this.conversion.expression)).toFixed(3)
    },
    Cell () {
      return Cells[this.cellType]
    },
    triplicateOptions () {
      return Object.assign(this.qcResults, {conversionFactor: this.conversionFactor})
    }
  },
  methods: {
    replaceData () {
      Object.assign(this.$data, quantTypes[this.quantType])
    }
  },
  created () {
    if (this.quantType !== undefined) {
      this.replaceData()
    }
  }
}
</script>
