<script>

import parse from 'csv-parse/lib/sync'
import Grid from '@/components/Grid.vue'
import Vue from 'vue'
import * as Cells from '@/lib/QuantTypes'

export default {
  name: 'QuantFile',
  props: {
    
    opts: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      msg: 'QuantFile',
      defaultOptions: {
        rowDelimiter: ['\r\n', '\r', '\n'],
        from: 16,
        delimiter: ',',
        columns: ['row', 'column', 'content', 'id', 'concentration'],
        metadata: {
          rows: 3,
          delimiter: ',',
          idColumn: 'ID1'
        }
      },
      raw: '',
      Cmp: Vue.extend(Grid),
      grid: {}
    }
  },
  components: {
  },
  computed: {
    options () {
      return Object.assign(this.defaultOptions, this.opts)
    },
    json () {
      return this.grid.json
    },
    metadata () {
      let rows = this.raw.split(/\r?\n/).slice(0, this.options.metadata.rows)
      let metadata = {}
      let split

      for (let row of rows) {
        for (let cell of row.split(this.options.metadata.delimiter)) {
          if (cell !== '') {
            split = cell.split(': ')
            metadata[split[0]] = split[1]
          }
        }
      }
      return metadata
    },
    id () {
      return this.metadata[this.options.metadata.idColumn]
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
          this.grid = new this.Cmp()
          this.grid.addAll(parse(this.raw, this.options).map(cell => new Cells.PlateReader(cell).json))
          resolve('File successfully uploaded')
        }
        reader.readAsText(file)
      })
    }
  }
}
</script>
