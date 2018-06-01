<script>

import * as Cells from '@/lib/QuantTypes'

export default {
  name: 'QuantType',
  props: {
    _cell: {
      type: String,
      required: true
    },
    conversion: {
      type: Object,
      default () {
        return { factors: {}, expression: 1 }
      }
    },
  },
  data () {
    return {
      msg: 'QuantType'
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
      return eval(`Cells.${this._cell}`)
    }
  },
  methods: {
  }
}
</script>
