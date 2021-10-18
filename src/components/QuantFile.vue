<script>
import parse from 'csv-parse/lib/sync'
import Grid from '@/Grid'
import QuantType from '@/QuantType'
import WellMap from '@/config/wellMap'

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
      grid: {},
      quantType: {},
      barcodeSuffix: '-' + Math.random().toString(16).substr(2, 6),
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
      if (!this.quantType.hasMetadata) return
      let rows = this.raw.split(/\r?\n/).slice(0, this.quantType.metadata.rows)
      let metadata = {}

      for (let row of rows) {
        for (let cell of row.split(this.quantType.metadata.delimiter)) {
          if (cell !== '') {
            const [key, value] = cell.split(': ')
            metadata[key] = value
          }
        }
      }
      return metadata
    },
    id() {
      if (this.quantType.hasMetadata) {
        // handles barcodes of type ABC-QC and ABC_QC
        return this.metadata[this.quantType.metadata.idColumn].split(/[-,_]/)[0]
      } else if (this.quantType.hasFileNameSpecs) {
        // Use the file name specs to establish a unique barcode
        return this.barcodeFromFileName
      } else {
        // Fall back to getting the id directly from the filename
        // handles barcodes of type ABC-QC and ABC_QC
        return this.filename.split('_')[1].split('-')[0]
      }
    },
    barcodeFromFileName() {
      const fileNameMatch = this.filename.match(
        this.quantType.fileNameSpecs.pattern
      )
      if (!fileNameMatch) {
        return null
      }

      const groups = fileNameMatch.groups
      const barcode = this.quantType.fileNameSpecs.barcodeFormat.replace(
        /{(.+?)}/g,
        function (match, key) {
          return typeof groups[key] != 'undefined' ? groups[key] : match
        }
      )

      return barcode + this.barcodeSuffix
    },
  },
  methods: {
    buildWell(cell) {
      return this.quantType.WellFactory(cell, WellMap[this.quantType.key])
    },
    canonicaliseLineEndings(content) {
      // \r\r\n is a non standard windows line ending which causes all sorts of problems.
      return content.replace(/\r\r\n/g, '\n')
    },
    fileNameError() {
      if (
        this.quantType.hasFileNameSpecs &&
        this.barcodeFromFileName === null
      ) {
        return this.quantType.fileNameSpecs.errorDescription
      }

      return ''
    },
    upload(file) {
      // A new file reader object gets the raw data.
      // The file is parsed by the quant type options and
      // a factory is used to ensure standardisation of the data
      // for when it is added to the grid.
      return new Promise((resolve, reject) => {
        const fileNameError = this.fileNameError()
        if (fileNameError.length > 0) {
          reject(fileNameError)
          return
        }
        const reader = new FileReader()
        reader.onload = () => {
          try {
            this.raw = this.canonicaliseLineEndings(reader.result)
            this.grid = Grid({
              quantType: this.quant,
              ...(this.quantType.grid || {}),
            })
            // skip_empty_lines needs to be true otherwise an error is thrown
            this.grid.addAll(
              parse(this.raw, {
                ...this.quantType.parse,
                skip_empty_lines: true,
              }).map(this.buildWell)
            )
          } catch (error) {
            reject(`Failed to parse: ${error.message}`)
            return
          }
          resolve('File successfully uploaded')
        }
        reader.readAsText(file)
      })
    },
  },
  created() {
    this.quantType = QuantType(this.quant)
  },
}
</script>
