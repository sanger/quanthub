<template>
  <div class="w-4/5 mt-4 w-100 space-x-4">
    <QuanthubMessage ref="alert"></QuanthubMessage>
    <form class="m-0" method="post" action="#" @submit.prevent="execute">
      <div class="grid grid-cols-2 divide-x pb-2">
        <label for="printer">Select a Printer</label>
        <custom-select
          id="printer-list"
          :model-value="printerName"
          name="printer-list"
          :options="printerList"
          :data-attribute="printerName"
          @update:modelValue="printerSelected"
        >
        </custom-select>

        <div class="error">{{ errors.printerName }}</div>
      </div>
      <div class="grid grid-cols-2 divide-x pb-2">
        <label for="barcode">Scan your plate barcode</label>
        <textarea
          id="barcodes"
          v-model="barcodes"
          name="barcodes"
          rows="10"
          cols="10"
          class="block rounded border file:border-0 p-2"
        ></textarea>
        <div class="error">{{ errors.barcode }}</div>
      </div>
      <div class="items-center">
        <custom-button id="print" name="submit" type="submit" theme="create">
          Print
        </custom-button>
      </div>
    </form>
  </div>
</template>

<script>
import Model from '@/api/PrintMyBarcode'
import QuanthubMessage from '@/components/QuanthubMessage.vue'
import PrinterList from '@/config/PrinterList'
import CustomButton from './shared/CustomButton.vue'

export default {
  name: 'PrintJob',
  components: {
    QuanthubMessage,
    CustomButton,
  },
  props: {
    labelTemplateId: {
      type: String,
      default: import.meta.env.VITE_LABEL_TEMPLATE_ID,
    },
  },
  data() {
    return {
      msg: 'PrintJob',
      barcodes: '',
      printerName: PrinterList[0],
      date: new Date(),
      model: {},
      errors: {},
      printerList: PrinterList,
    }
  },
  computed: {
    today() {
      return `${this.date.getDate().toString().padStart(2, '0')}-${
        this.months[this.date.getMonth()]
      }-${this.date.getFullYear()}`
    },
    labels() {
      const self = this
      return this.barcodes
        .split('\n')
        .filter(Boolean)
        .map((barcode) => {
          return {
            main_label: {
              top_left: self.today,
              bottom_left: barcode.concat('-QC'),
              barcode: barcode.concat('-QC'),
            },
          }
        })
    },
    attributes() {
      return {
        labelTemplateId: this.labelTemplateId,
        printerName: this.printerName,
        labels: {
          body: this.labels,
        },
      }
    },
    months() {
      return [
        'JAN',
        'FEB',
        'MAR',
        'APR',
        'MAY',
        'JUN',
        'JUL',
        'AUG',
        'SEP',
        'OCT',
        'NOV',
        'DEC',
      ]
    },
  },
  methods: {
    printerSelected(value) {
      this.printerName = value
    },
    execute() {
      if (this.valid()) {
        this.model = new Model(this.attributes)
        this.model.save().then((success) => {
          if (success) {
            this.$refs.alert.show('barcode successfully printed', 'success')
          } else {
            /*eslint no-console: ["error", { allow: ["error"] }] */
            console.error(this.model.errors)
            this.$refs.alert.show('barcode printing failed', 'danger')
          }
        })
      }
    },
    valid() {
      this.errors = {}
      if (!this.barcodes) {
        this.errors['barcodes'] = 'must be completed'
      }
      if (!this.printerName) {
        this.errors['printerName'] = 'must be completed'
      }
      return Object.keys(this.errors).length === 0
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
form {
  width: 80%;
  margin: 10% auto;
}
.error {
  color: red;
}
</style>
