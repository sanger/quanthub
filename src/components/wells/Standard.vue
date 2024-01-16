<template>
  <td class="well standard">
    {{ concentration }}
  </td>
</template>

<script>
import WellProperties from '@/mixins/WellProperties'

export default {
  name: 'StandardWell',
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
      default: 'Standard',
    },
    plateBarcode: {
      default: '',
    },
  },
  data() {
    return {
      msg: 'Standard Well',
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>
