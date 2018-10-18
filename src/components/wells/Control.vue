<template>
  <td class="well control" >
    {{ concentration }}
  </td>
</template>

<script>

import WellProperties from '@/mixins/WellProperties'

export default {
  name: 'control-well',
  mixins: [WellProperties],
  props: {
    type: {
      default: 'Control'
    }
  },
  data () {
    return {
      msg: 'Control Well'
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

  .control {
    color: white;
    background-color: $well-green;
  }
</style>
