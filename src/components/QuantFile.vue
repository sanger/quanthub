<script>

import parse from 'csv-parse/lib/sync'
import Grid from '@/components/Grid.vue'
import QuantType from '@/components/QuantType.vue'
import Vue from 'vue'

export default {
  name: 'QuantFile',
  props: {
    quant: {
      type: String,
      default: 'libraryPlateReader'
    },
    opts: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      msg: 'QuantFile',
      raw: '',
      GridCmp: Vue.extend(Grid),
      grid: {},
      QuantTypeCmp: Vue.extend(QuantType),
      quantType: {}
    }
  },
  components: {
  },
  computed: {
    json () {
      return this.grid.json
    },
    metadata () {
      let rows = this.raw.split(/\r?\n/).slice(0, this.quantType.metadata.rows)
      let metadata = {}
      let split

      for (let row of rows) {
        for (let cell of row.split(this.quantType.metadata.delimiter)) {
          if (cell !== '') {
            split = cell.split(': ')
            metadata[split[0]] = split[1]
          }
        }
      }
      return metadata
    },
    id () {
      return this.metadata[this.quantType.metadata.idColumn]
    }
  },
  methods: {
    upload (file) {
      // TODO: need to handle errors.
      // can't seem to get onerror to work.
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          this.raw = reader.result
          this.grid = new this.GridCmp({propsData: {quantType: this.quant}})
          this.grid.addAll(parse(this.raw, this.quantType.parse).map(cell => new this.quantType.Cell(cell).json))
          resolve('File successfully uploaded')
        }
        reader.readAsText(file)
      })
    }
  },
  created () {
    this.quantType = new this.QuantTypeCmp({propsData: {quantType: this.quant}})
  }
}
</script>
