<template>
  <div>
    <QuanthubMessage ref="alert"></QuanthubMessage>
    <form
      enctype="multipart/form-data"
      method="post"
      action="#"
      @submit.prevent="upload"
    >
      <div class="wrapper">
        <label for="quantType">Select a Quant Type: </label>
        <div class="w-full pb-2">
          <custom-select
            id="quant-type"
            :model-value="quantType"
            :options="quantTypeSelectOptions"
            placeholder="Please select a quant type ..."
            :data-attribute="quantType"
            @update:modelValue="updateSelected"
          >
          </custom-select>
        </div>
        <div class="wrapper">
          <input
            id="file-input"
            ref="fileInput"
            type="file"
            name="file-input"
            @change.prevent="addFilenames"
          />
          <input
            ref="browseFiles"
            type="text"
            disabled
            class="block rounded border file:border-0 p-2 w-4/5"
            placeholder="Upload File..."
          />
          <div class="space-x-2 flex flex-row px-4">
            <custom-button type="button" theme="create" @click="browseFiles">
              Browse
            </custom-button>
            <custom-button theme="create" name="submit" type="submit">
              Upload
            </custom-button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
// Uploads a file. Parse options dependent on quantType
import Vue from 'vue'
import QuantFile from '@/components/QuantFile.vue'
import quantTypes from '@/config/quantTypes'
import QuanthubMessage from '@/components/QuanthubMessage.vue'
import CustomSelect from '@/components/shared/CustomSelect.vue'
import CustomButton from '@/components/shared/CustomButton.vue'

export default {
  name: 'Upload',
  components: {
    QuanthubMessage,
    CustomSelect,
    CustomButton,
  },
  props: {},
  data() {
    return {
      msg: 'Upload',
      Cmp: Vue.extend(QuantFile),
      quantType: null,
      quantTypes: quantTypes,
      filename: null,
      validFileExtensions: ['.csv', '.txt'],
    }
  },
  computed: {
    filenameFiltered() {
      return this.filename ? this.filename.replace(/^.*[\\]/, '') : null
    },
    quantTypeSelectOptions() {
      return Object.entries(this.quantTypes).map(([key, option]) => {
        return {
          value: key,
          text: option.name,
        }
      })
    },
  },
  methods: {
    updateSelected(value) {
      this.quantType = value
    },
    validFiletype() {
      var typeValid = false
      var sFilename = this.filenameFiltered
      if (sFilename && sFilename.length > 0) {
        for (var j = 0; j < this.validFileExtensions.length; j++) {
          var sCurExtension = this.validFileExtensions[j]
          if (
            sFilename
              .substr(
                sFilename.length - sCurExtension.length,
                sCurExtension.length
              )
              .toLowerCase() == sCurExtension.toLowerCase()
          ) {
            typeValid = true
            break
          }
        }
      }
      return typeValid
    },
    formIsValid() {
      if (!this.quantType) {
        this.$refs.alert.show(
          `Please select a quant type and file before uploading!`,
          'warning'
        )
        return false
      }
      if (!this.validFiletype()) {
        this.$refs.alert.show(
          `Please select a csv file before uploading!`,
          'warning'
        )
        return false
      }
      return true
    },
    // create a quantFile based on the quantType
    // if the upload is successful it is saved to local storage
    // The user is then redirected to the plate page
    // where the file is retrieved from local storage.
    async upload() {
      if (!this.formIsValid()) {
        return
      }

      const file = document.getElementById('file-input').files[0]
      const quantFile = new this.Cmp({
        propsData: { quant: this.quantType, filename: this.filenameFiltered },
      })
      quantFile
        .upload(file)
        .then(() => {
          localStorage.setItem(quantFile.id, JSON.stringify(quantFile.json))
          this.$router.push({ path: `/plate/${quantFile.id}` })
        })
        .catch((error) => {
          this.handleUploadError(error)
        })
    },
    browseFiles() {
      this.$refs.fileInput.click()
    },
    addFilenames() {
      /*eslint no-console: */
      this.filename = this.$refs.fileInput.value
      this.$refs.browseFiles.value = this.filenameFiltered
    },
    handleUploadError(error) {
      var msg =
        'File upload rejected, please check the file and then retry, reason: '
      switch (typeof error) {
        case 'object':
          this.handleObjectError(error, msg)
          break
        case 'string':
          msg += `Error message: ${error}`
          break
        default:
          msg += `Unrecognised error type: ${error}`
      }
      this.$refs.alert.show(msg, 'danger')
      /*eslint no-console: ["error", { allow: ["error"] }] */
      console.error('file upload rejected:', error)
    },
    handleObjectError(error, msg) {
      switch (error.name) {
        case 'QuotaExceededError':
          msg = 'Local storage is full up, please clear and then retry'
          break
        case 'TypeError':
          msg += 'Formatting of file incorrect'
          break
        default:
          msg += `Exception message: ${error.message}`
      }
      return msg
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input[type='file'] {
  display: none;
}
</style>
