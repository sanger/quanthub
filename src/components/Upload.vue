<template>
  <div class="upload row">
    <h3 v-html='notice'></h3>
    <form enctype="multipart/form-data" method="post" action="#" v-on:submit.prevent="upload">
      <label for="plate-reader">Upload a plate:</label>
      <input id="plate-reader" name="plate-reader" type="file" >
      <button name="submit" class="btn btn-primary" type="submit">Upload</button>
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
      const file = document.getElementById('plate-reader').files[0]
      let csvFile = new this.Cmp()
      csvFile.upload(file)
        .then((result) => {
          localStorage.setItem(csvFile.metadata.ID1, JSON.stringify(csvFile.json))
          this.notice = result
          this.$router.push({ path: `/plate/${csvFile.metadata.ID1}` })
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
