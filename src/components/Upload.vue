<template>
  <div class="upload">
    <h3 v-html='notice'></h3>
    <div>{{ msg }}</div>
    <form enctype="multipart/form-data" method="post" action="#" v-on:submit="upload">
      <input id="plateReader" name="plateReader" type="file" >
      <button name="submit" type="submit">Upload</button>
    </form>
  </div>
</template>

<script>

import router from '@/router'
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
      event.preventDefault()
      const file = document.getElementById('plateReader').files[0]
      let csvFile = new this.Cmp()
      csvFile.upload(file)
        .then((result) => {
          localStorage.setItem(csvFile.metadata.ID1, JSON.stringify(csvFile.json))
          this.notice = result
          router.push({ path: `/plate/${csvFile.metadata.ID1}` })
        })
        .catch((error) => {
          console.log('rejected:', error)
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
