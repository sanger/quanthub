<template>
  <td class="well blank">
    {{ concentration }}
  </td>
</template>

<script>
import WellProperties from '@/mixins/WellProperties'

export default {
  name: 'BlankWell',
  mixins: [WellProperties],
  props: {
    type: {
      default: 'Blank',
    },
  },
  data() {
    return {
      msg: 'Blank Well',
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped></style>
