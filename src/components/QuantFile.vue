<script>
import parse from 'csv-parse/lib/sync'
import Grid from '@/components/Grid'
import QuantType from '@/components/QuantType'
import WellMap from '@/config/wellMap'
import Vue from 'vue'

// Handles the upload of the file - can be csv or text
// A quant type is passed in which determines the upload options e.g. file type.
export default {
  name: 'QuantFile',
  props: {
    quant: {
      type: String,
      default: 'libraryPlateReader',
    },
    filename: {
      type: String,
    },
  },
  data() {
    return {
      msg: 'QuantFile',
      raw: '',
      GridCmp: Vue.extend(Grid),
      grid: {},
      QuantTypeCmp: Vue.extend(QuantType),
      quantType: {},
    }
  },
  components: {},
  computed: {
    json() {
      return this.grid.json
    },
    // takes the raw file and extracts the rows where the metadata is.
    // for each row split it and extract each row of metadata into a JSON object.
    // only the id is used at this stage.
    metadata() {
      if (!this.quantType.hasMetadata()) return
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
    id() {
      if (this.quantType.hasMetadata()) {
        // handles barcodes of type ABC-QC and ABC_QC
        return this.metadata[this.quantType.metadata.idColumn].split(/[-,_]/)[0]
      } else {
        return this.parsedFilename
      }
    },
    parsedFilename() {
      // handles filenames containing barcodes of type ABC-QC and ABC_QC
      return this.filename.split('_')[1].split('-')[0]
    },
  },
  methods: {
    upload(file) {
      // A new file reader object gets the raw data.
      // The file is parsed by the quant type options and
      // a factory is used to ensure standardisation of the data
      // for when it is added to the grid.
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          // \r\r\n is a non standard windows line ending which causes all sorts of problems.
          // TODO: move it out into a constant.
          try {
            this.raw = reader.result.replace(/\r\r\n/g, '\n')
            this.grid = new this.GridCmp({
              propsData: { quantType: this.quant },
            })
            // skip_empty_lines needs to be true otherwise an error is thrown
            this.grid.addAll(
              parse(this.raw, {
                ...this.quantType.parse,
                skip_empty_lines: true,
              }).map(
                (cell) =>
                  new this.quantType.WellFactory(
                    cell,
                    WellMap[this.quantType.key]
                  ).json
              )
            )
          } catch (error) {
            reject(`Failed to parse: ${error.message}`)
          }
          resolve('File successfully uploaded')
        }
        reader.readAsText(file)
      })
    },
  },
  created() {
    this.quantType = new this.QuantTypeCmp({
      propsData: { quantType: this.quant },
    })
  },
}
</script>
