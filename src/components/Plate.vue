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
        <h3 >{{ msg }}: {{ id }}</h3>
        <div>
          <button name="save" id="save" class="btn btn-primary" v-on:click.prevent="save">
            Save
          </button>
        </div>
        <div>&nbsp;</div>
        <div>
          <button name="export" id="export" class="btn btn-primary" v-on:click.prevent="exportToSequencescape">
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

import Row from '@/components/Row.vue'
import Grid from '@/components/Grid.vue'
import {TriplicateList as Triplicates} from '@/lib/Triplicates'
import Vue from 'vue'
import axios from 'axios'

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
      store: this.$Store,
      notice: '',
      uuid: '',
      triplicates: new Triplicates(),
      alert: '',
      alertType: '',
      dismissSecs: 10,
      dismissCountDown: 0
    }
  },
  computed: {
    columns () {
      return this.grid.columns
    },
    rows () {
      return this.grid.rows
    },
    metadata () {
      return {uuid: this.uuid, assay_type: 'Plate Reader', assay_version: 'v1.0'}
    },
    json () {
      return this.triplicates.keys.map(key => Object.assign(this.triplicates.find(key).json, this.metadata))
    },
    jsonApiData () {
      return {data: {data: {attributes: this.json}}}
    },
    requestOptions () {
      return {url: '/qc_results', method: 'post', headers: {'Content-Type': 'application/vnd.api+json'}, baseURL: process.env.SEQUENCESCAPE_BASE_URL}
    },
    request () {
      return Object.assign(this.requestOptions, this.jsonApiData)
    }
  },
  components: {
    Row
  },
  created () {
    try {
      this.fetchData()
      if (this.store !== undefined) {
        this.store.sequencescapePlates.add(this)
      }
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    fetchData () {
      let json = localStorage.getItem(this.id)
      if (json !== null) {
        this.grid = JSON.parse(json)
      }
    },
    // This may seem counter intuitive but is necessary to update local storage
    // The wells could be totally different if it is a new plate
    toGrid () {
      let Cmp = Vue.extend(Grid)
      let grid = new Cmp()
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
    save (event) {
      localStorage.setItem(this.id, JSON.stringify(this.toGrid()))
      this.showAlert('Plate saved to local storage', 'success')
    },
    exportToSequencescape (event) {
      axios.get(`${process.env.QUANTESSENTIAL_BASE_URL}/quants/${this.id}/input.txt`)
        .then(response => {
          this.uuid = response.data
          return axios(this.request)
        })
        .then(response => {
          this.showAlert('QC Results for plate has been successfully exported to Sequencescape', 'success')
        })
        .catch(error => {
          this.showAlert('QC Results for plate could not be exported', 'danger')
          console.log(error)
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
