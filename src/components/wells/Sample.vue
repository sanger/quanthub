<template>
  <td
    class="well sample"
    :class="{ inactive: !active, inspect: outlier }"
    @click="setActive"
  >
    {{ id }}
    <br />
    {{ concentration }}
    <br />
    <badge-label
      v-if="warning.message"
      class="warning"
      data-attribute="warning-message"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      {{ warning.shortMessage }}
    </badge-label>
    <span v-if="hover" class="tooltip-text">{{ warning.message }}</span>
  </td>
</template>

<script>
import { NullReplicate } from '@/Replicates'
import WellProperties from '@/mixins/WellProperties'

export default {
  name: 'SampleWell',
  mixins: [WellProperties],
  props: {
    row: {
      default: '',
    },
    column: {
      default: '',
    },
    concentration: {
      default: '',
    },
    type: {
      default: 'Sample',
    },
    id: {
      default: '',
    },
    plateBarcode: {
      default: '',
    },
    extraFields: {
      default() {
        return {
          id: 'id',
          active: 'active',
        }
      },
    },
  },
  emits: ['mouseover', 'mouseleave'],
  data() {
    return {
      msg: 'Sample Well',
      store: this.$Store,
      replicate: NullReplicate,
      active: true,
      outlier: false,
      warning: {},
      hover: false,
    }
  },
  computed: {
    location() {
      return this.row.concat(this.column)
    },
    // we only want to carry out calculations on concentrations that are a number
    parsedConcentration() {
      return parseFloat(this.concentration)
    },
  },
  mounted() {
    // prevents errors if store is not defined. Is there a better way ...
    if (this.store !== undefined) {
      this.store.qcAssayList.addReplicate(this)
      this.replicate.outliers()

      const qcAssay = this.store.qcAssayList.find(this.plateBarcode)
      // pull out settings defined in the quantTypes.json config
      // if we get more requests for this type of warning worth adding the quantType to the store
      if (qcAssay?.quantType?.qcResults) {
        const qcResults = qcAssay.quantType.qcResults

        if (qcResults.warningThreshold) {
          if (this.concentration < qcResults.warningThreshold.value) {
            this.warning = { ...qcResults.warningThreshold }
          }
        }
      }
    }
  },
  methods: {
    setActive() {
      this.active = !this.active
      this.replicate.outliers()
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'src/assets/stylesheets/colors.scss';

.table {
  td,
  th {
    min-width: 75px;
    min-height: 50px;
    font-size: 12px;
  }
}

.inactive {
  color: white;
  background-color: gray;
}

.inspect {
  color: white;
  background-color: $well-red;
}

.warning {
  color: white;
  background-color: $well-purple;
}

.tooltip-text {
  position: absolute;
  z-index: 2;
  width: 200px;
  color: white;
  font-size: 12px;
  background-color: black;
  border-radius: 10px;
  padding: 10px 15px 10px 15px;
}
</style>
