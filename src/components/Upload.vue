<template>
  <div class="upload">
    <h3 v-html='notice'></h3>
    <div>{{ message }}</div>
    <form enctype="multipart/form-data" method="post" action="#" v-on:submit="upload">
      <input id="plateReader" name="plateReader" type="file" >
      <button name="submit" type="submit">Upload</button>
    </form>
  </div>
</template>

<script>

import parse from 'csv-parse/lib/sync'
import Well from '@/components/Well.vue'
import Vue from 'vue'

export default {
  name: 'Upload',
  props: {
    opts: {
      type: Object,
      default: () => {}
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
      csv: '',
      wells: [],
      file: {}
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
    upload (event) {
      event.preventDefault()
      this.notice = 'File successfully uploaded.'
    },
    uploadFile () {
      this.getFile()
        .then((result) => {
          this.csv = result
          this.parseData()
        })
        .catch((error) => {
          console.log('rejected:', error)
        })
    },
    getFile () {
      return new Promise((resolve, reject) => {
        // const file = document.getElementById('plateReader').files[0]
        const reader = new FileReader()
        reader.onload = () => {
          resolve(reader.result)
        }
        reader.readAsText(this.file)
      })
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
