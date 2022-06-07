<script>
import parse from 'csv-parse/lib/sync'
import Grid from '@/Grid'
import QuantType from '@/QuantType'
import WellMap from '@/config/wellMap'

// \r\r\n is a non standard windows line ending which causes all sorts of problems.
// It appears to arise when the exchange server modifies attached files
const corruptLineEndRegExp = /\r\r\n/g

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
      json: {},
      quantType: {},
      barcodeSuffix: '-' + Math.random().toString(16).substr(2, 6),
    }
  },
  components: {},
  computed: {
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
        return this.parsedFilename
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
        (_, key) => groups[key]
      )

      return `${barcode}${
        this.quantType.fileNameSpecs.barcodeSuffix ? this.barcodeSuffix : ''
      }`
    },
    parsedFilename() {
      // handles barcodes of type ABC-QC and ABC_QC
      return this.filename.split('_')[1].replace(/[_-]QC$/, '')
    },
  },
  methods: {
    buildWell(cell) {
      return this.quantType.WellFactory(cell, WellMap[this.quantType.key])
    },
    validateFileName() {
      if (
        this.quantType.hasFileNameSpecs &&
        this.barcodeFromFileName === null
      ) {
        return {
          valid: false,
          message: this.quantType.fileNameSpecs.errorDescription,
        }
      }

      return { valid: true }
    },
    parseRaw() {
      // skip_empty_lines needs to be true otherwise an error is thrown
      return parse(this.raw, {
        ...this.quantType.parse,
        skip_empty_lines: true,
      }).map(this.buildWell)
    },
    upload(file) {
      // A new file reader object gets the raw data.
      // The file is parsed by the quant type options and
      // a factory is used to ensure standardisation of the data
      // for when it is added to the grid.
      return new Promise((resolve, reject) => {
        const { valid, message } = this.validateFileName()
        if (!valid) {
          reject(message)
          return
        }
        const reader = new FileReader()
        reader.onload = () => {
          try {
            this.raw = reader.result.replace(corruptLineEndRegExp, '\n')

            const { json } = Grid(
              {
                quantType: this.quant,
                ...(this.quantType.grid || {}),
              },
              this.parseRaw()
            )
            this.json = json
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
