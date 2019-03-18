<template>
  <td class="well blank" >
    {{ concentration }}
  </td>
</template>

<script>

import WellProperties from '@/mixins/WellProperties'

export default {
  name: 'blank-well',
  mixins: [WellProperties],
  props: {
    type: {
      default: 'Blank'
    }
  },
  data () {
    return {
      msg: 'Blank Well'
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

  .blank {
    color: white;
  }
</style>
