<template>
  <div class="plate">
    <div>
      <b-alert  :show="dismissCountDown"
                dismissible
                :dismiss-after-seconds="5"
                :variant="alertType"
                @dismissed="dismissCountdown=0"
                @dismiss-count-down="countDownChanged">
        <h4 class="text-center">{{alert}}</h4>
      </b-alert>
      <div class="container-fluid row">
        <b-modal v-model="exporting" :hide-footer=true :hide-header=true :no-close-on-backdrop=true>
          <spinner size="huge" message="Exporting..."></spinner>
        </b-modal>
        <h3 >{{ msg }}: {{ id }}</h3>
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
           <row v-for="(row, key, index) in rows" v-bind:id="key" v-bind:wells="row" v-bind:plateId="id" v-bind:key="key.concat(index)"></row>
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

import Row from '@/components/Row.vue'
import Grid from '@/components/Grid.vue'
import QuantType from '@/components/QuantType.vue'
import {TriplicateList as Triplicates} from '@/Triplicates'
import Vue from 'vue'
import axios from 'axios'
import Spinner from 'vue-simple-spinner'

export default {
  name: 'Plate',
  props: {
    id: {
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
      alert: '',
      alertType: '',
      dismissSecs: 10,
      dismissCountDown: 0,
      exporting: false
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
    metadata () {
      return {uuid: this.uuid}
    },
    json () {
      return this.triplicates.values.map(triplicate => Object.assign(triplicate.json, this.metadata))
    },
    jsonApiData () {
      return {data: {data: {attributes: this.json}}}
    },
    requestOptions () {
      return {url: '/qc_results', method: 'post', headers: {'Content-Type': 'application/vnd.api+json'}, baseURL: process.env.VUE_APP_SEQUENCESCAPE_BASE_URL}
    },
    request () {
      return Object.assign(this.requestOptions, this.jsonApiData)
    }
  },
  components: {
    Row,
    Spinner
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
      let json = localStorage.getItem(this.id)
      let Cmp = Vue.extend(QuantType)

      if (json !== null) {
        this.grid = JSON.parse(json)
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
      let grid = new Cmp({propsData: {quantType: this.grid.quantType}})
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
      localStorage.setItem(this.id, JSON.stringify(this.toGrid()))
      this.showAlert('Plate saved to local storage', 'success')
    },
    // send a get request to quantessential to return the barcode.
    // build a request based on the triplicate data.
    // A post request is the sent to sequencescape to populate the qc_results table.
    exportToSequencescape () {
      this.exporting = true
      axios.get(`${process.env.VUE_APP_QUANTESSENTIAL_BASE_URL}/quants/${this.id}/input.txt`)
        .then(response => {
          this.uuid = response.data
          return axios(this.request)
        })
        .then(() => {
          this.exporting = false
          this.showAlert('QC Results for plate has been successfully exported to Sequencescape', 'success')
        })
        .catch(error => {
          this.exporting = false
          this.showAlert('QC Results for plate could not be exported', 'danger')
          /*eslint no-console: ["error", { allow: ["error"] }] */
          console.error(error)
        })
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
<style lang="scss" scoped>
</style>
