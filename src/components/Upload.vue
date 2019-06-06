<template>
  <div class="upload container-fluid">
    <form enctype="multipart/form-data" method="post" action="#" v-on:submit.prevent="upload">
      <div class="form-group">
        <div class="form-group">
          <label for="quantType">Select a Quant Type:</label>
          <select id="quant-type" class="form-control" name="quantType" v-model="quantType">
              <option :value="null" selected disabled>Please select a quant type ...</option>
              <option v-for="(option, key) in quantTypes" v-bind:key="key" v-bind:value="key">{{option.name}}</option>
          </select>
        </div>
        <input type="file" name="file-input" id="file-input" ref="fileInput" class="file" v-on:change.prevent="addFilenames">
        <div class="input-group">
          <input class="form-control" type="text" disabled placeholder="Upload File..." ref="browseFiles">
          <span class="input-group-btn">
            <button class="btn btn-success spacer" v-on:click.prevent="browseFiles" type="button">Browse</button>
            <button name="submit" class="btn btn-success" type="submit">Upload</button>
          </span>
        </div>
      </div>
    </form>
  </div>
</template>

<script>

// Uploads a file. Parse options dependent on quantType
import Vue from 'vue'
import QuantFile from '@/components/QuantFile'
import quantTypes from '@/config/quantTypes'

export default {
  name: 'Upload',
  props: {
  },
  data () {
    return {
      msg: 'Upload',
      Cmp: Vue.extend(QuantFile),
      quantType: null,
      quantTypes: quantTypes
    }
  },
  computed: {
    filename () {
      return this.$refs.fileInput.value.replace(/^.*[\\]/, '')
    }
  },
  components: {
    QuantFile
  },
  methods: {
    // create a quantFile based on the quantType
    // if the upload is successful it is saved to local storage
    // The user is then redirected to the plate page
    // where the file is retrieved from local storage.
    upload () {
      const file = document.getElementById('file-input').files[0]
      let quantFile = new this.Cmp({propsData: {quant: this.quantType, filename: this.filename}})
      quantFile.upload(file)
        .then(() => {
          localStorage.setItem(quantFile.id, JSON.stringify(quantFile.json))
          this.$router.push({ path: `/plate/${quantFile.id}` })
        })
        .catch((error) => {
          /*eslint no-console: ["error", { allow: ["error"] }] */
          console.error('rejected:', error)
        })
    },
    browseFiles () {
      this.$refs.fileInput.click()
    },
    addFilenames () {
      this.$refs.browseFiles.value = this.filename
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
