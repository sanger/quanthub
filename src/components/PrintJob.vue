<template>
  <div class="w-3/5 mx-auto">
    <div class="w-full mt-4 gap-4 px-4 bg-gray-100 shadow-md rounded-md">
      <QuanthubMessage ref="alert"></QuanthubMessage>
      <form method="post" action="#" @submit.prevent="execute">
        <div>
          <div
            class="max-w-7xl mx-auto py-2 text-black text-left text-xl font-bold tracking-tight leading-relaxed border-b-2 border-sp"
          >
            <label for="printer-list">Select a Printer</label>
          </div>
          <div class="py-2">
            <quanthub-select
              id="printer-list"
              v-model="printerName"
              name="printer-list"
              :options="printerOptions"
              :data-attribute="printerName"
            >
            </quanthub-select>
            <div class="printer-error text-left text-sm text-failure">
              {{ printerError }}
            </div>
          </div>
        </div>
        <div>
          <div
            class="max-w-7xl mx-auto py-2 text-black text-left text-xl font-bold tracking-tight leading-relaxed border-b-2 border-sp"
          >
            <label for="barcodes">Scan your barcode</label>
          </div>
          <div class="py-2">
            <textarea
              id="barcodes"
              v-model="barcodes"
              name="barcodes"
              placeholder="Please scan the barcodes"
              rows="10"
              cols="10"
              class="rounded border w-full p-2"
            ></textarea>
            <div class="barcode-error text-left text-sm text-failure">
              {{ barcodeError }}
            </div>
          </div>
        </div>
        <div class="flex flex-row w-full pt-2 pb-4 gap-x-4">
          <quanthub-button
            id="reset"
            type="reset"
            theme="resetWhite"
            @click="reset"
          >
            Reset
          </quanthub-button>
          <quanthub-button
            id="print"
            name="submit"
            type="submit"
            theme="create"
            :full-width="true"
          >
            Print
          </quanthub-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { createPrintJob } from '@/api/PrintMyBarcode'
import QuanthubMessage from '@/components/QuanthubMessage.vue'
import QuanthubButton from '@/components/shared/QuanthubButton.vue'
import QuanthubSelect from '@/components/shared/QuanthubSelect.vue'
import PrinterList from '@/config/PrinterList'

export default {
  name: 'PrintJob',
  components: {
    QuanthubMessage,
    QuanthubButton,
    QuanthubSelect,
  },
  data() {
    return {
      barcodes: '',
      printerName: PrinterList[0].name,
      barcodeError: '',
      printerError: '',
    }
  },
  computed: {
    printerOptions() {
      return PrinterList.map((printer) => ({
        text: `${printer.name} : ${this.titleCase(printer.type)}`,
        value: printer.name,
      }))
    },
    printer() {
      return PrinterList.find((printer) => printer.name === this.printerName)
    },
  },
  methods: {
    titleCase(str) {
      return str
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    },
    formattedBarcodes() {
      return this.barcodes
        .split('\n')
        .filter(Boolean)
        .map((barcode) => barcode.concat('-QC'))
    },
    showAlert(message, type) {
      this.$refs.alert.show(message, type)
    },
    execute() {
      if (!this.valid()) return

      createPrintJob({
        printer: this.printer,
        barcodes: this.formattedBarcodes(),
      }).then((response) => {
        if (!response.ok) {
          response.json().then((data) => {
            const message = data.errors
              .map((error) => `${error.source.pointer} ${error.detail}`)
              .join(', ')
            this.showAlert('Barcode printing failed: ' + message, 'danger')
          })
        } else {
          this.showAlert('Barcode printing succeeded', 'success')
        }
        return response
      })
    },
    valid() {
      this.barcodeError = !this.barcodes
        ? 'There must be at least one barcode'
        : ''
      this.printerError = !this.printerName ? 'Please select a printer' : ''

      return !this.printerError && !this.barcodeError
    },
    reset() {
      this.barcodes = ''
      this.printerName = PrinterList[0].name
      this.barcodeError = ''
      this.printerError = ''
    },
  },
}
</script>
