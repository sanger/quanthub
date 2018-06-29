<template>
  <td class="well" v-bind:class="classObject" v-on:click="setActive">
    {{ id }}
    <br/>
    {{ concentration }}
  </td>
</template>

<script>

import { NullTriplicate } from '@/lib/Triplicates'

// A well can be one of 3 different types which will determine its behaviour:
// - Sample ~ part of a triplicate. Can be active or inactive and may need inspection
// - Standard/Control ~ always inactive. Indentified by colours.
export default {
  name: 'Well',
  props: {
    row: {
      default: ''
    },
    column: {
      default: ''
    },
    id: {
      default: ''
    },
    concentration: {
      default: ''
    },
    active: {
      default: true,
      type: Boolean
    },
    type: {
      default: ''
    },
    plateId: {
      default: ''
    }
  },
  data () {
    return {
      msg: 'Well',
      store: this.$Store,
      triplicate: NullTriplicate,
      isActive: this.active
    }
  },
  computed: {
    // The class is defined by the well type
    classObject () {
      if (!this.isActive && this.hasConcentration() && this.isSample()) {
        return {
          inactive: true
        }
      } else {
        return {
          sample: this.isSample(),
          standard: this.isStandard(),
          control: this.isControl(),
          inspect: this.needsInspection()
        }
      }
    },
    location () {
      return this.row.concat(this.column)
    },
    json () {
      return {
        row: this.row,
        column: this.column,
        type: this.type,
        id: this.id,
        concentration: this.concentration,
        active: this.isActive
      }
    }
  },
  // TODO: Constantize well types.
  methods: {
    isStandard () {
      return this.type === 'Standard'
    },
    isSample () {
      return this.type === 'Sample'
    },
    isControl () {
      return this.type === 'Control'
    },
    hasConcentration () {
      return this.concentration !== ''
    },
    needsInspection () {
      return this.triplicate.needsInspection()
    },
    setActive () {
      this.isActive = !this.isActive
    }
  },
  mounted () {
    // prevents errors if store is not defined. Is there a better way ...
    if (this.store !== undefined) {
      if (this.isSample()) {
        this.store.sequencescapePlates.addTriplicate(this)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

  @import "src/assets/stylesheets/colors.scss";

  .table {
    td, th {
      min-width: 75px;
      min-height: 50px;
      font-size: 12px;
    }
  }

  .inactive {
    background-color: gray;
    color: white;
  }

  .standard, .control, .inspect {
    color: white;
  }

  .standard {
    background-color: $well-blue;
  }

  .control {
    background-color: $well-green;
  }

  .inspect {
    background-color: $well-red;
  }
</style>
