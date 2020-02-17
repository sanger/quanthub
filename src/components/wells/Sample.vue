<template>
  <td class="well sample" v-bind:class="{inactive: !active, inspect: needsInspection()}"  v-on:click="test()">
    {{ id }}
    <br />
    {{ concentration }}
    {{ active }}
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
    extraFields: {
      default () {
        return {
          'id': 'id',
          'active': 'active'
        }
      }
    }
  },
  data () {
    return {
      msg: 'Sample Well',
      store: this.$Store,
      replicate: NullReplicate,
      active: true,
      outlier: false
    }
  },
  computed: {
    location () {
      return this.row.concat(this.column)
    }
  },
  methods: {
    needsInspection () {
      // return this.replicate.needsInspection()
      return this.outlier
    },
    test () {
      this.active = !this.active
      this.replicate.outliers()
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
