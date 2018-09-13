<template>
  <div class="print-job">
    <div>
      <label for="printer">Select a Printer:</label>
      <select id="printer" class="form-control" name="printer" v-model="printerName">
          <option v-for="printer in printerList" v-bind:key="printer" v-bind:value="printer">{{printer}}</option>
      </select>
    </div>
    <label for="barcode">Scan your barcode:</label>
    <input name="barcode" id="barcode" v-model="barcode">
    <span class="input-group-btn">
      <button name="print" id="print" class="btn btn-success" v-on:click.prevent="execute">
        Print
      </button>
    </span>
  </div>
</template>

<script>

import Model from '@/api/PrintMyBarcode'

export default {
  name: 'PrintJob',
  props: {
    labelTemplateId: {
      type: String,
      default: process.env.VUE_APP_LABEL_TEMPLATE_ID
    }
  },
  data () {
    return {
      msg: 'PrintJob',
      barcode: '',
      printerName: '',
      date: new Date(),
      alert: '',
      model: {},
      printerList: ['f225bc']
    }
  },
  computed: {
    today () {
      return `${this.date.getDate().toString().padStart(2,'0')}-${this.months[this.date.getMonth()]}-${this.date.getFullYear()}`
    },
    qcBarcode () {
      return this.barcode.concat('_QC')
    },
    attributes () {
      return {
        labelTemplateId: this.labelTemplateId,
        printerName: this.printerName,
        labels: {
          body: [
            {
              main_label: {
                top_left: this.today,
                bottom_left: this.qcBarcode,
                barcode: this.qcBarcode
              }
            }
          ]
        }
      }
    },
    months () {
      return ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'] 
    }
  },
  components: {
  },
  methods: {
    execute () {
      this.model = new Model(this.attributes)
      this.model.save().then(success => {
        if(success) {
          this.alert = 'barcode successfully printed'
        } else {
          console.error(this.model.errors)
          this.alert = 'barcode printing failed'
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>