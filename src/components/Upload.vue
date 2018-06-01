<template>
  <div class="upload container-fluid">
    <form enctype="multipart/form-data" method="post" action="#" v-on:submit.prevent="upload">
      <div class="form-group">
        <input type="file" name="file-input" id="file-input" ref="fileInput" class="file" v-on:change.prevent="addFilenames">
        <div class="input-group">
          <input class="form-control" type="text" disabled placeholder="Upload File..." ref="browseFiles">
          <span class="input-group-btn">
            <button class="btn btn-success" v-on:click.prevent="browseFiles" type="button">Browse</button>
            <button name="submit" class="btn btn-success" type="submit">Upload</button>
          </span>
        </div>
      </div>
    </form>
  </div>
</template>

<script>

import Vue from 'vue'
import QuantFile from '@/components/QuantFile'

export default {
  name: 'Upload',
  props: {
  },
  data () {
    return {
      msg: 'Upload',
      notice: '',
      Cmp: Vue.extend(QuantFile)
    }
  },
  computed: {
  },
  components: {
    QuantFile
  },
  methods: {
    upload (event) {
      const file = document.getElementById('file-input').files[0]
      let quantFile = new this.Cmp()
      quantFile.upload(file)
        .then((result) => {
          localStorage.setItem(quantFile.id, JSON.stringify(quantFile.json))
          this.$router.push({ path: `/plate/${quantFile.id}` })
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
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    showAlert (alert, alertType) {
      this.alert = alert
      this.alertType = alertType
      this.dismissCountDown = this.dismissSecs
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
