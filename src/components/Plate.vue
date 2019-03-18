<template>
  <div class="plate">
    <div>
      <alert ref='alert'></alert>
      <div class="container-fluid row">
        <b-modal v-model="exporting" :hide-footer=true :hide-header=true :no-close-on-backdrop=true>
          <spinner size="huge" message="Exporting..."></spinner>
        </b-modal>
        <h3 >{{ msg }}: {{ barcode }}</h3>
        <div class="spacer">
          <label class="spacer" for="lotNumber">Standards Lot Number:</label>
          <input type="text" v-model="lotNumber" id="lotNumber" />
        </div>
        <div>
          <button name="save" id="save" class="btn btn-success" v-on:click.prevent="save">
            Save
          </button>
        </div>
        <div>&nbsp;</div>
        <div>
          <button name="export" id="export" class="btn btn-success" v-on:click.prevent="exportToSequencescape" :disabled="exporting">
            Export
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-12">
      <table class="table table-bordered">
        <thead>
          <th>&nbsp;</th>
          <th v-for="column in columns" v-bind:key="column">{{ column }}</th>
        </thead>
        <tbody>
           <row v-for="(row, key, index) in rows" v-bind:id="key" v-bind:wells="row" v-bind:plateBarcode="barcode" v-bind:key="key.concat(index)"></row>
        </tbody>
      </table>
    </div>
</div>
</template>

<script>

// A plate signifies the plate on the machine that does the quanting - not the plate that is being processed.
// The plate structure is defined by the grid
// Plate is made up of rows which are part of the grid which contains the wells.
// When a plate is created it is added to the store as a sequencescape plate.
// Once the plate is received from local storage a set of triplicates is created. The plate id is cascaded down so that the well can add a triplicate
// The assumption is made that the data exists in local storage from when it was uploaded.
// The QuantType is assigned from local storage and a QuantType component is created.

import Row from '@/components/Row'
import Grid from '@/components/Grid'
import QuantType from '@/components/QuantType'
import Alert from '@/components/Alert'
import {TriplicateList as Triplicates} from '@/Triplicates'
import Vue from 'vue'
import axios from 'axios'
import Spinner from 'vue-simple-spinner'

export default {
  name: 'Plate',
  props: {
    barcode: {
      type: String
    }
  },
  data () {
    return {
      msg: 'Plate',
      grid: {},
      quantType: {},
      store: this.$Store,
      notice: '',
      uuid: '',
      triplicates: {},
      exporting: false,
      lotNumber: ''
    }
  },
  computed: {
    columns () {
      return this.grid.columns
    },
    rows () {
      return this.grid.rows
    },
    // We can't assign the uuid up front because it is pulled from quantessential.
    // This will go away once we merge quanthub and quantessential.
    json () {
      return { lot_number: this.lotNumber, qc_results: this.triplicates.values.map(triplicate => triplicate.json) }
    },
    jsonApiData () {
      return {data: {data: {attributes: this.json}}}
    },
    requestOptions () {
      return {url: '/qc_assays', method: 'post', headers: {'Content-Type': 'application/vnd.api+json'}, baseURL: process.env.VUE_APP_SEQUENCESCAPE_BASE_URL}
    },
    request () {
      return Object.assign(this.requestOptions, this.jsonApiData)
    }
  },
  components: {
    Row,
    Spinner,
    Alert
  },
  created () {
    try {
      this.fetchData()
      if (this.store !== undefined) {
        this.store.sequencescapePlates.add(this)
      }
    } catch (error) {
      /*eslint no-console: ["error", { allow: ["error"] }] */
      console.error(error)
    }
  },
  methods: {
    fetchData () {
      let json = localStorage.getItem(this.barcode)
      let Cmp = Vue.extend(QuantType)

      if (json !== null) {
        let parsedJSON = JSON.parse(json)
        this.grid = parsedJSON
        this.lotNumber = parsedJSON.lotNumber
        this.quantType = new Cmp({propsData: { quantType: this.grid.quantType }})
      } else {
        this.quantType = new Cmp()
      }
      this.triplicates = new Triplicates(this.quantType.triplicateOptions)
    },
    // This may seem counter intuitive but is necessary to update local storage
    // The wells could be totally different if it is a new plate
    toGrid () {
      let Cmp = Vue.extend(Grid)
      let grid = new Cmp({propsData: {quantType: this.grid.quantType, lotNumber: this.lotNumber}})
      for (let child of this.$children) {
        // because we now have a b-alert it also exists as a child
        // we need to exclude it as it will throw an error as it
        // does not respond to json
        // TODO: should we be using _componentTag
        if (child.$options._componentTag === 'row') {
          grid.addAll(child.json)
        }
      }
      return grid.json
    },
    // save the plate to local storage by recreating the grid
    save () {
      localStorage.setItem(this.barcode, JSON.stringify(this.toGrid()))
      this.$refs.alert.show('Plate saved to local storage', 'success')
    },
    // build a request based on the triplicate data.
    // A post request is the sent to sequencescape to populate the qc_results table.
    // TODO: can we move this to an ORM
    exportToSequencescape () {
      this.exporting = true
      axios(this.request)
        .then(() => {
          this.exporting = false
          this.$refs.alert.show('QC Results for plate has been successfully exported to Sequencescape', 'success')
        })
        .catch(error => {
          this.exporting = false
          this.$refs.alert.show('QC Results for plate could not be exported', 'danger')
          /*eslint no-console: ["error", { allow: ["error"] }] */
          console.error(error)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
