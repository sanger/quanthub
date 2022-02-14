<template>
  <td
    class="well sample"
    v-bind:class="{ inactive: !active, inspect: outlier, warning: warning }"
    v-on:click="setActive"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
  >
    {{ id }}
    <br />
    {{ concentration }}
  </td>
</template>

<script>
import { NullReplicate } from '@/Replicates'
import WellProperties from '@/mixins/WellProperties'

export default {
  name: 'sample-well',
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
  data() {
    return {
      msg: 'Sample Well',
      store: this.$Store,
      replicate: NullReplicate,
      active: true,
      outlier: false,
      warning: false,
      warningMessage: '',
    }
  },
  computed: {
    location() {
      return this.row.concat(this.column)
    },
  },
  methods: {
    setActive() {
      this.active = !this.active
      this.replicate.outliers()
    },
    onMouseOver() {
      if (this.warningMessage) {
        // This event bubbles up through Row to Plate, to show the warning message on the page.
        this.$emit('showWarningMessage', this.warningMessage)
      }
    },
    onMouseLeave() {
      if (this.warningMessage) {
        // This event bubbles up through Row to Plate, to hide any warning messages on the page.
        this.$emit('hideWarningMessage')
      }
    },
  },
  mounted() {
    // prevents errors if store is not defined. Is there a better way ...
    if (this.store !== undefined) {
      this.store.qcAssayList.addReplicate(this)
      this.replicate.outliers()

      const qcAssay = this.store.qcAssayList.find(this.plateBarcode)
      // pull out settings defined in the quantTypes.json config
      if (qcAssay && qcAssay.quantType && qcAssay.quantType.qcResults) {
        const qcResults = qcAssay.quantType.qcResults

        if (qcResults.warningThreshold) {
          if (this.concentration < qcResults.warningThreshold.value) {
            this.warning = true
            this.warningMessage = qcResults.warningThreshold.message
          }
        }
      }
    }
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
</style>
