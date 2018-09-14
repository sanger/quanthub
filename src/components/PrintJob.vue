<template>
  <div class="print-job">
    <alert ref='alert'></alert>
    <form method="post" action="#" v-on:submit.prevent="execute">
      <div class="form-group">
        <div class="form-group">
          <label for="printer">Select a Printer:</label>
            <select id="printer" class="form-control" name="printer" v-model="printerName">
              <option v-for="printer in printerList" v-bind:key="printer" v-bind:value="printer">{{printer}}</option>
            </select>
        </div>
        <div class="input-group">
          <label for="barcode">Scan your barcode:</label>
          <input name="barcode" id="barcode" v-model="barcode">
            <span class="input-group-btn">
              <button name="submit" id="print" class="btn btn-success" type="submit">
                Print
              </button>
            </span>
        </div>
      </div>
    </form>
  </div>
</template>

<script>

import Model from '@/api/PrintMyBarcode'
import Alert from '@/components/Alert'

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
    Alert
  },
  methods: {
    execute () {
      this.model = new Model(this.attributes)
      this.model.save().then(success => {
        if(success) {
          this.$refs.alert.show('barcode successfully printed','success')
        } else {
          console.error(this.model.errors)
          this.$refs.alert.show('barcode printing failed','danger')
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>