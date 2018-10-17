<template>
  <td class="well empty" >
    {{ concentration }}
  </td>
</template>

<script>

import WellProperties from '@/mixins/WellProperties'

export default {
  name: 'empty-well',
  mixins: [WellProperties],
  props: {
    type: {
      default: 'Empty'
    }
  },
  data () {
    return {
      msg: 'Empty Well'
    }
  },
  computed: {
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

  .empty {
    color: white;
  }
</style>
