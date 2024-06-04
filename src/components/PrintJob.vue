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
              data-attribute="printer-select"
            >
            </quanthub-select>
            <div class="text-left text-sm text-failure">
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
              data-attribute="barcode-input"
            ></textarea>
            <div class="text-left text-sm text-failure">
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
            data-attribute="print-button"
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
import { filterPrintersByEnvironment } from '@/lib/PrinterHelpers'

export default {
  name: 'PrintJob',
  components: {
    QuanthubMessage,
    QuanthubButton,
    QuanthubSelect,
  },
  data() {
    const environment = process.env.NODE_ENV
    const printers = filterPrintersByEnvironment({
      printers: PrinterList.printers,
      environment,
    })

    return {
      barcodes: '',
      printers,
      printerName: printers[0],
      barcodeError: '',
      printerError: '',
    }
  },
  computed: {
    printerOptions() {
      return this.printers.map((printer) => ({
        text: printer,
        value: printer,
      }))
    },
    printer() {
      return this.printers.find((printer) => printer === this.printerName)
    },
  },
  methods: {
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
      })
        .then((response) => {
          if (!response.ok) {
            response.json().then((data) => {
              const message = data.errors
                .map((error) => `${error.source.pointer} ${error.detail}`)
                .join(', ')
              this.showAlert('Printing command failed: ' + message, 'danger')
            })
          } else {
            this.showAlert('Printing command sent', 'success')
          }
          return response
        })
        .catch((error) => {
          this.showAlert('Printing command failed: ' + error.message, 'danger')
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
      this.printerName = this.printers[0]
      this.barcodeError = ''
      this.printerError = ''
    },
  },
}
</script>
