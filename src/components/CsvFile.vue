<script>

import parse from 'csv-parse/lib/sync'
import Grid from '@/components/Grid.vue'
import Vue from 'vue'

export default {
  name: 'CsvFile',
  props: {
    opts: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      msg: 'CsvFile',
      defaultOptions: {
        rowDelimiter: ['\r\n', '\r', '\n'],
        from: 12,
        metadataRows: 7,
        columns: ['row', 'column', 'content', 'id', 'concentration']
      },
      csv: '',
      Cmp: Vue.extend(Grid),
      grid: {}
    }
  },
  components: {
    Grid
  },
  computed: {
    options () {
      return Object.assign(this.defaultOptions, this.opts)
    },
    json () {
      return this.grid.json
    },
    metadata () {
      let rows = this.csv.split(/\r?\n/).slice(0, this.options.metadataRows)
      let metadata = {}
      let split

      for (let row of rows) {
        split = row.split(',')[0].split(': ')
        metadata[split[0]] = split[1]
      }
      return metadata
    }
  },
  methods: {
    upload (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          this.csv = reader.result
          this.grid = new this.Cmp()
          this.grid.addAll(parse(this.csv, this.options))
          resolve('File successfully uploaded')
        }
        reader.readAsText(file)
      })
    }
  }
}
</script>
