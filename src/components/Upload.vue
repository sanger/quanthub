<template>
  <div class="upload">
    <input name="myFile" type="file">
  </div>
</template>

<script>

import parse from 'csv-parse/lib/sync'
import Well from '@/components/Well.vue'
import Vue from 'vue'
import fs from 'fs'

export default {
  name: 'Upload',
  props: {
    csv: {
      default: ''
    },
    opts: {
      type: Object,
      default: () => {}
    },
    wells: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      msg: 'Upload',
      defaultOptions: {
        rowDelimiter: '\n',
        from: 12,
        metadataRows: 7,
        columns: ['row', 'column', 'content', 'id', 'concentration', 'inspect']
      },
      Cmp: Vue.extend(Well),
      dir: 'static/'
    }
  },
  computed: {
    options () {
      return Object.assign(this.defaultOptions, this.opts)
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
    },
    path () {
      return this.dir.concat(this.metadata.ID1 + '.json')
    }
  },
  components: {
    Well
  },
  methods: {
    parseData () {
      this.wells = parse(this.csv, this.options).map(well => new this.Cmp({propsData: well}))
    },
    sort () {
      return this.wells.sort(function (a, b) { return a.compare(b) })
    },
    toJson () {
      return { wells: this.sort().map(well => well.toJson()) }
    },
    toFile () {
      // TODO: needs to be asynchronous
      fs.writeFileSync(this.path, JSON.stringify(this.toJson()))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
th {
  background-color: #e1e0df;
}
</style>
