<template>
  <div>
    <QuantFile
      ref="quantFileRef"
      :quant="quantType"
      :filename="filenameFiltered"
    ></QuantFile>
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
          <quanthub-select
            id="quant-type"
            :model-value="quantType"
            :options="quantTypeSelectOptions"
            placeholder="Please select a quant type ..."
            :data-attribute="quantType"
            @update:modelValue="updateSelected"
          >
          </quanthub-select>
        </div>
        <div class="wrapper">
          <input
            id="file-input"
            ref="fileInput"
            type="file"
            name="file-input"
            style="display: none"
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
            <quanthub-button type="button" theme="create" @click="browseFiles">
              Browse
            </quanthub-button>
            <quanthub-button theme="create" name="submit" type="submit">
              Upload
            </quanthub-button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
// Uploads a file. Parse options dependent on quantType
import QuantFile from '@/components/QuantFile.vue'
import quantTypes from '@/config/quantTypes'
import QuanthubMessage from '@/components/QuanthubMessage.vue'
import QuanthubSelect from '@/components/shared/QuanthubSelect.vue'
import QuanthubButton from '@/components/shared/QuanthubButton.vue'

export default {
  name: 'Upload',
  components: {
    QuanthubMessage,
    QuanthubSelect,
    QuanthubButton,
    QuantFile,
  },
  props: {},
  data() {
    return {
      msg: 'Upload',
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
                sCurExtension.length,
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
          'warning',
        )
        return false
      }
      if (!this.validFiletype()) {
        this.$refs.alert.show(
          `Please select a csv file before uploading!`,
          'warning',
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
      const quantFile = this.$refs.quantFileRef
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
