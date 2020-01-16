<template>
  <td class="well sample" v-bind:class="classObject"  v-on:click="setActive" >
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
      default: ''
    },
    column: {
      default: ''
    },
    concentration: {
      default: ''
    },
    type: {
      default: 'Sample'
    },
    id: {
      default: ''
    },
    plateBarcode: {
      default: ''
    },
    active: {
      default: true,
      type: Boolean
    },
    extraFields: {
      default () {
        return {
          'id': 'id',
          'active': 'isActive'
        }
      }
    }
  },
  data () {
    return {
      msg: 'Sample Well',
      isActive: this.active,
      store: this.$Store,
      replicate: NullReplicate
    }
  },
  computed: {
    location () {
      return this.row.concat(this.column)
    },
    classObject () {
      if (!this.isActive) {
        return {
          inactive: true
        }
      }
      else {
        return {
          inspect: this.needsInspection()
        }
      }
    }
  },
  methods: {
    setActive () {
      this.isActive = !this.isActive
    },
    needsInspection () {
      return this.replicate.needsInspection()
    }
  },
  mounted () {
    // prevents errors if store is not defined. Is there a better way ...
    if (this.store !== undefined) {
      this.store.sequencescapePlates.addReplicate(this)
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

  .inspect {
    color: white;
    background-color: $well-red;
  }

</style>
