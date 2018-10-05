<template>
  <tr class="plate-row">
    <th>{{ id }}</th>
    <component v-for="(well, key, index) in wells" v-bind="well" :is="well.type" v-bind:plateBarcode="plateBarcode" :key="key.concat(index)"></component>
  </tr>
</template>

<script>

import Control from '@/components/wells/Control'
import Sample from '@/components/wells/Sample'
import Standard from '@/components/wells/Standard'
import Blank from '@/components/wells/Blank'
import Empty from '@/components/wells/Empty'

// A row does nothing more than hold a group of wells.
// It has an id which is the location e.g. A1
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
    plateBarcode: {
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
  methods: {
  },
  components: {
    Sample,
    Control,
    Standard,
    Blank,
    Empty
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
