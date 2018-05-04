<template>
  <tr class="plate-row">
    <th>{{ id }}</th>
    <well v-for="(well, key, index) in wells" v-bind="well" v-bind:plateId="plateId" :key="key.concat(index)"></well>
  </tr>
</template>

<script>

import Well from '@/components/Well.vue'

export default {
  name: 'Row',
  props: {
    id: {
      type: String,
      default: ''
    },
    wells: {
      type: Object,
      default: () => {}
    },
    plateId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      msg: 'Well'
    }
  },
  computed: {
    json () {
      return this.$children.map(well => well.json)
    }
  },
  components: {
    Well
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
