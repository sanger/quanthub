<template>
  <div class="plate space-y-2">
    <div>
      <QuanthubMessage ref="alert"></QuanthubMessage>
      <QuanthubModal
        :visible="exporting"
        size="sm"
        title="Exporting to Sequencescape..."
      >
        <QuanthubSpinner
          v-show="exporting"
          class="w-1/2 mx-auto items-center justify-center w-32 h-32"
        ></QuanthubSpinner>
      </QuanthubModal>
      <div class="grid grid-cols-4 w-3/4">
        <h3 class="text-2xl">{{ msg }}: {{ barcode }}</h3>
        <label for="lotNumber">Standards Lot Number:</label>
        <input
          id="lotNumber"
          v-model="lotNumber"
          type="text"
          class="border-solid border-2"
        />
        <div class="text-left space-x-2 pl-2">
          <quanthub-button id="save" name="save" theme="create" @click="save">
            Save
          </quanthub-button>
          <quanthub-button
            id="export"
            name="export"
            theme="create"
            :disabled="exporting"
            @click="exportToSequencescape"
          >
            Export
          </quanthub-button>
        </div>
      </div>
    </div>
    <div class="col-md-12">
      <table class="table w-full">
        <thead>
          <th>&nbsp;</th>
          <!-- prettier-ignore -->
          <th v-for="column in columns" :key="column" class="border-solid border-2 border-gray-200">{{ column }}</th>
        </thead>
        <tbody>
          <row
            v-for="(row, key, index) in rows"
            :id="key"
            :key="key.concat(index)"
            :ref="setRowRef"
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
import Grid from '@/Grid'
import QuantType from '@/QuantType'
import { ReplicateList as Replicates } from '@/Replicates'
import QuanthubMessage from '@/components/QuanthubMessage.vue'
import Row from '@/components/Row.vue'
import QuanthubButton from '@/components/shared/QuanthubButton.vue'
import QuanthubModal from '@/components/shared/QuanthubModal.vue'
import QuanthubSpinner from '@/components/shared/QuanthubSpinner.vue'

export default {
  name: 'Plate',
  components: {
    Row,
    QuanthubSpinner,
    QuanthubButton,
    QuanthubMessage,
    QuanthubModal,
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
      rowRefs: [],
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
    setRowRef(el) {
      if (el) {
        this.rowRefs.push(el)
      }
    },
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
      const cells = this.rowRefs.flatMap((row) => row.json || [])
      const { json } = Grid(
        {
          quantType: this.grid.quantType,
          lotNumber: this.lotNumber,
        },
        cells,
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
    exportToSequencescape() {
      this.exporting = true
      fetch(`${import.meta.env.VITE_SEQUENCESCAPE_BASE_URL}/qc_assays`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'X-Sequencescape-Client-Id': import.meta.env
            .VITE_SEQUENCESCAPE_API_KEY,
        },
        body: JSON.stringify({ data: { attributes: this.json } }),
      })
        .then(async (response) => {
          // Handles sequencescape errors
          if (!response.ok) {
            this.exporting = false
            this.$refs.alert.show(
              'QC Results for plate could not be exported',
              'danger',
            )
            console.error(await response.json())
          } else {
            this.exporting = false
            this.$refs.alert.show(
              'QC Results for plate has been successfully exported to Sequencescape',
              'success',
            )
          }
        })
        // Handles network error
        .catch((error) => {
          this.exporting = false
          this.$refs.alert.show(
            'Error connecting to Sequencescape. Please try again.',
            'danger',
          )
          console.error(error)
        })
    },
  },
}
</script>
