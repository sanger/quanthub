<script>

import parse from 'csv-parse/lib/sync'
import Grid from '@/components/Grid.vue'
import Vue from 'vue'

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
        metadataRows: 3,
        delimiter: ',',
        columns: ['row', 'column', 'content', 'id', 'concentration']
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
      let rows = this.raw.split(/\r?\n/).slice(0, this.options.metadataRows)
      let metadata = {}
      let split

      for (let row of rows) {
        for (let cell of row.split(',')) {
          if (cell !== '') {
            split = cell.split(': ')
            metadata[split[0]] = split[1]
          }
        }
      }
      return metadata
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
          this.grid.addAll(parse(this.raw, this.options))
          resolve('File successfully uploaded')
        }
        reader.readAsText(file)
      })
    }
  }
}
</script>
