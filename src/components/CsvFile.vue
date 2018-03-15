<script>

import parse from 'csv-parse/lib/sync'
import Well from '@/components/Well.vue'
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
        rowDelimiter: '\n',
        from: 12,
        metadataRows: 7,
        columns: ['row', 'column', 'content', 'id', 'concentration', 'inspect']
      },
      csv: '',
      wells: [],
      Cmp: Vue.extend(Well)
    }
  },
  components: {
    Well
  },
  computed: {
    options () {
      return Object.assign(this.defaultOptions, this.opts)
    },
    sorted () {
      return this.wells.slice(0).sort(function (a, b) { return a.compare(b) })
    },
    json () {
      return this.sorted.map(well => well.toJson())
    },
    metadata () {
      let rows = this.csv.split('\n').slice(0, this.options.metadataRows)
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
          this.wells = parse(this.csv, this.options).map(well => new this.Cmp({propsData: well}))
          resolve('File successfully uploaded')
        }
        reader.readAsText(file)
      })
    }
  }
}
</script>
