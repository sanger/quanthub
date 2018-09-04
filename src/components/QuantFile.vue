<script>

import parse from 'csv-parse/lib/sync'
import Grid from '@/components/Grid.vue'
import QuantType from '@/components/QuantType.vue'
import Vue from 'vue'

// Handles the upload of the file - can be csv or text
// A quant type is passed in which determines the upload options e.g. file type.
export default {
  name: 'QuantFile',
  props: {
    quant: {
      type: String,
      default: 'libraryPlateReader'
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
    // takes the raw file and extracts the rows where the metadata is.
    // for each row split it and extract each row of metadata into a JSON object.
    // only the id is used at this stage.
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
      // A new file reader object gets the raw data.
      // The file is parsed by the quant type options and
      // a factory is used to ensure standardisation of the data
      // for when it is added to the grid.
      return new Promise((resolve, ) => {
        const reader = new FileReader()
        reader.onload = () => {
          // \r\r\n is a non standard windows line ending which causes all sorts of problems.
          // TODO: move it out into a constant.
          this.raw = reader.result.replace(/\r\r\n/g, '\n')
          this.grid = new this.GridCmp({propsData: {quantType: this.quant}})
          this.grid.addAll(parse(this.raw, this.quantType.parse).map(cell => new this.quantType.WellFactory(cell).json))
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
