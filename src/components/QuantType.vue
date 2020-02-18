<script>

import math from 'mathjs'
import * as WellFactories from '@/QuantTypeWellFactories'
import quantTypes from '@/config/quantTypes'

// Related to the different QuantTypes in configuration.
// The data structure indicates the structure of how
// the quant types should be in the configuration file.
// It needs to be a component as the conversion factor needs
// be calculated.
export default {
  name: 'QuantType',
  props: ['quantType'],
  data () {
    return {
      key: 'quantType',
      name: 'Quant Type',
      wellType: 'QuantType',
      parse: {
        delimiter: ',',
        from: 16,
        rowDelimiter: ['\r\n', '\r', '\n'],
        columns: ['column1', 'column2', 'column3', 'column4', 'column5']
      },
      metadata: {rows: 1, idColumn: 'id', delimiter: ','},
      conversion: {factors: {}, expression: 1, decimalPlaces: 3},
      qcResults: {
        key: 'Concentration',
        units: 'ng',
        assay: {type: 'Quant Type', version: 'v1.0'},
        outlier: {type: 'standard', threshold: '1'}
      }
    }
  },
  components: {
  },
  // Take the conversion expression and then inject the value for each
  // factor into the placeholder.
  // This produces a string expression which can be evaluated.
  // This conversion factor is then used to create the adjusted average
  // in replicates. It is evaluated upfront which increases efficiency.
  computed: {
    conversionFactor () {
      let factors = this.conversion.factors
      return math.eval(Object.keys(factors).reduce((factor, key) => {
        return factor.replace(key, factors[key])
      }, this.conversion.expression)).toFixed(this.decimalPlaces)
    },
    decimalPlaces () {
      return this.$data.conversion.decimalPlaces
    },
    // A constant which relates to a factory for conversion of well
    // to the correct format.
    WellFactory () {
      return WellFactories[this.wellType]
    },
    replicateOptions () {
      return { conversionFactor: this.conversionFactor, ...this.qcResults }
      // return Object.assign(this.qcResults, {conversionFactor: this.conversionFactor, cvThreshold: this.cvThreshold})
    }
  },
  methods: {
    replaceData () {
      Object.assign(this.$data, quantTypes[this.quantType])
    },
    hasMetadata () {
      return (Object.keys(this.$data.metadata).length > 0)
    }
  },
  created () {
    if (this.quantType !== undefined) {
      this.replaceData()
    }
  }
}
</script>
