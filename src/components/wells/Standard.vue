<template>
  <td class="well standard" >
    {{ concentration }}
  </td>
</template>

<script>

import WellProperties from '@/mixins/WellProperties'

export default {
  name: 'standard-well',
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
      default: 'Standard'
    },
    plateBarcode: {
      default: ''
    }
  },
  data () {
    return {
      msg: 'Standard Well'
    }
  },
  computed: {
    location () {
      return this.row.concat(this.column)
    },
    json () {
      return {
        row: this.row,
        column: this.column,
        type: this.type,
        concentration: this.concentration
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

  .standard {
    color: white;
    background-color: $well-blue;
  }
</style>
