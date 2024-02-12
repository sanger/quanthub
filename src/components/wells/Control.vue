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
