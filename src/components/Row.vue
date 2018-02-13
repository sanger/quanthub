<template>
  <tr class="plate-row">
    <th>{{ heading }}</th>
    <well v-for="(well, index) in wells" v-bind="well" :key="idToString.concat(index)"></well>
  </tr>
</template>

<script>

import Well from '@/components/Well.vue'

export default {
  name: 'Row',
  props: {
    id: {
      type: Number,
      default: 0
    },
    wells: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      msg: 'Well'
    }
  },
  computed: {
    heading () {
      return String.fromCharCode(65 + this.id)
    },
    idToString () {
      return this.id.toString()
    }
  },
  components: {
    Well
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
th {
  background-color: #e1e0df;
}
</style>
