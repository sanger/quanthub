<template>
  <td class="well empty">
    {{ concentration }}
  </td>
</template>

<script>
import WellProperties from '@/mixins/WellProperties'

export default {
  name: 'EmptyWell',
  mixins: [WellProperties],
  props: {
    type: {
      default: 'Empty',
    },
  },
  data() {
    return {
      msg: 'Empty Well',
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>
