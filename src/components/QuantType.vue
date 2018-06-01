<script>

import * as Cells from '@/lib/QuantTypes'
import quantTypes from '../../config/quantTypes'

export default {
  name: 'QuantType',
  props: ['quantType'],
  data () {
    return {
      key: "quantType",
      name: "Quant Type",
      cellType: "QuantType",
      parseOptions : {
        delimiter: ",",
        startRow: 16,
        columns: ['column1', 'column2', 'column3', 'column4', 'column5'],
        metadata: { rows: 1, idColumn: 'id', delimiter: ','},
      },
      conversion: { factors: {}, expression: 1 },
      qcResults: {
        key: "Molarity",
        units: "nM",
        assay: { type: "Quant Type", version: "v1.0"}
      }
    }
  },
  components: {
  },
  computed: {
    conversionFactor () {
      let factors = this.conversion.factors
      return eval(Object.keys(factors).reduce((factor, key) => {
        return factor.replace(key, factors[key])
      }, this.conversion.expression)).toFixed(3)
    },
    cell () {
      return eval(`Cells.${this.cellType}`)
    }
  },
  methods: {
    replaceData () {
      Object.assign(this.$data, quantTypes[this.quantType])
    }
  },
  created () {
    if(this.quantType !== undefined) {
      this.replaceData()
    }
  }
}
</script>
