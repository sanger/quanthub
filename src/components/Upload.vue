<template>
  <div class="upload container-fluid">
    <form enctype="multipart/form-data" method="post" action="#" v-on:submit.prevent="upload">
      <div class="form-group">
        <input type="file" name="file-input" id="file-input" ref="fileInput" class="file" v-on:change.prevent="addFilenames">
        <div class="input-group">
          <input class="form-control" type="text" disabled placeholder="Upload File..." ref="browseFiles">
          <span class="input-group-btn">
            <button class="btn btn-primary" v-on:click.prevent="browseFiles" type="button">Browse</button>
            <button name="submit" class="btn btn-primary" type="submit">Upload</button>
          </span>
        </div>
      </div>
    </form>
  </div>
</template>

<script>

import Vue from 'vue'
import CsvFile from '@/components/CsvFile'

export default {
  name: 'Upload',
  props: {
  },

  data () {
    return {
      msg: 'Upload',
      notice: '',
      Cmp: Vue.extend(CsvFile)
    }
  },
  computed: {
  },
  components: {
    CsvFile
  },
  methods: {
    upload (event) {
      const file = document.getElementById('file-input').files[0]
      let csvFile = new this.Cmp()
      csvFile.upload(file)
        .then((result) => {
          localStorage.setItem(csvFile.metadata.ID1, JSON.stringify(csvFile.json))
          this.$router.push({ path: `/plate/${csvFile.metadata.ID1}` })
        })
        .catch((error) => {
          console.log('rejected:', error)
        })
    },
    browseFiles (event) {
      this.$refs.fileInput.click()
    },
    addFilenames (event) {
      this.$refs.browseFiles.value = this.$refs.fileInput.value.replace(/^.*[\\]/, '')
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
