<template>
  <td class="well control">
    {{ concentration }}
  </td>
</template>

<script>
import WellProperties from '@/mixins/WellProperties'

export default {
  name: 'ControlWell',
  mixins: [WellProperties],
  props: {
    type: {
      default: 'Control',
    },
  },
  data() {
    return {
      msg: 'Control Well',
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>
