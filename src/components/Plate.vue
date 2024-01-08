<template>
  <div class="plate space-y-2">
    <div>
      <QuanthubMessage ref="alert"></QuanthubMessage>
      <QuanthubModal
        :visible="exporting"
        size="sm"
        title="Exporting to Sequencescape..."
      >
        <LoadingSpinner
          v-show="exporting"
          class="w-1/2 mx-auto items-center justify-center w-32 h-32"
        ></LoadingSpinner>
      </QuanthubModal>
      <PageHeading level="3" show-border>{{ msg }}: {{ barcode }}</PageHeading>
      <div class="flex flex-row space-x-2 justify-center">
        <div class="wrapper space-x-2">
          <label class="spacer items-center" for="lotNumber"
            >Standards Lot Number:</label
          >
          <input
            id="lotNumber"
            v-model="lotNumber"
            type="text"
            class="block rounded border p-2"
          />

          <custom-button id="save" name="save" theme="create" @click="save">
            Save
          </custom-button>
          <custom-button
            id="export"
            name="export"
            theme="create"
            :disabled="exporting"
            @click="exportToSequencescape"
          >
            Export
          </custom-button>
        </div>
      </div>
    </div>
    <div class="col-md-12">
      <table class="table">
        <thead>
          <th>&nbsp;</th>
          <th
            v-for="column in columns"
            :key="column"
            class="border-solid border-2 border-gray-200"
          >
            {{ column }}
          </th>
        </thead>
        <tbody>
          <row
            v-for="(row, key, index) in rows"
            :id="key"
            :key="key.concat(index)"
            :wells="row"
            :plate-barcode="barcode"
            class="border-solid border-2 border-gray-200"
          ></row>
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
// Once the plate is received from local storage a set of replicates is created. The plate id is cascaded down so that the well can add a replicate
// The assumption is made that the data exists in local storage from when it was uploaded.
// The QuantType is assigned from local storage and a QuantType component is created.

import Row from '@/components/Row.vue'
import Grid from '@/Grid'
import QuantType from '@/QuantType'
import QuanthubMessage from '@/components/QuanthubMessage.vue'
import QuanthubModal from '@/components/shared/QuanthubModal.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import PageHeading from '@/components/PageHeading.vue'
import { ReplicateList as Replicates } from '@/Replicates'
import axios from 'axios'

export default {
  name: 'Plate',
  components: {
    Row,
    LoadingSpinner,
    QuanthubMessage,
    QuanthubModal,
    PageHeading,
  },
  props: {
    barcode: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      msg: 'Plate',
      grid: {},
      quantType: {},
      store: this.$Store,
      notice: '',
      uuid: '',
      replicates: {},
      exporting: false,
      lotNumber: '',
    }
  },
  computed: {
    columns() {
      return this.grid.columns
    },
    rows() {
      return this.grid.rows
    },
    // We can't assign the uuid up front because it is pulled from quantessential.
    // This will go away once we merge quanthub and quantessential.
    json() {
      return {
        lot_number: this.lotNumber,
        qc_results: this.replicates
          .values()
          .map((replicate) => replicate.json()),
      }
    },
    jsonApiData() {
      return { data: { data: { attributes: this.json } } }
    },
    requestOptions() {
      return {
        url: '/qc_assays',
        method: 'post',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'X-Sequencescape-Client-Id': import.meta.env
            .VITE_SEQUENCESCAPE_API_KEY,
        },
        baseURL: import.meta.env.VITE_SEQUENCESCAPE_BASE_URL,
      }
    },
    request() {
      return Object.assign(this.requestOptions, this.jsonApiData)
    },
  },
  created() {
    try {
      this.fetchData()
      if (this.store !== undefined) {
        this.store.qcAssayList.add(this)
      }
    } catch (error) {
      /*eslint no-console: ["error", { allow: ["error"] }] */
      console.error(error)
    }
  },
  methods: {
    fetchData() {
      const json = localStorage.getItem(this.barcode)
      if (json !== null) {
        const parsedJSON = JSON.parse(json)
        this.grid = parsedJSON
        this.lotNumber = parsedJSON.lotNumber
        this.quantType = QuantType(this.grid.quantType)
      } else {
        this.quantType = QuantType()
      }
      this.replicates = Replicates(this.quantType.replicateOptions)
    },
    // This may seem counter intuitive but is necessary to update local storage
    // The wells could be totally different if it is a new plate
    toGrid() {
      // Some children are *not* rows, so we fall back to an empty
      // array to support them. Still not entirely sold on this
      // approach.
      const cells = this.$children.flatMap((row) => row.json || [])
      const { json } = Grid(
        {
          quantType: this.grid.quantType,
          lotNumber: this.lotNumber,
        },
        cells
      )

      return json
    },
    // save the plate to local storage by recreating the grid
    save() {
      localStorage.setItem(this.barcode, JSON.stringify(this.toGrid()))
      this.$refs.alert.show('Plate saved to local storage', 'success')
    },
    // build a request based on the replicate data.
    // A post request is the sent to sequencescape to populate the qc_results table.
    // TODO: can we move this to an ORM
    exportToSequencescape() {
      this.exporting = true
      axios(this.request)
        .then(() => {
          this.exporting = false
          this.$refs.alert.show(
            'QC Results for plate has been successfully exported to Sequencescape',
            'success'
          )
        })
        .catch((error) => {
          this.exporting = false
          this.$refs.alert.show(
            'QC Results for plate could not be exported',
            'danger'
          )
          /*eslint no-console: ["error", { allow: ["error"] }] */
          console.error(error)
        })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>
