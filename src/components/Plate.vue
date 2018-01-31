<template>
  <div class="plate">
    <div>{{ msg }}</div>
    <div class="col-md-12">
      <table class="table table-bordered">
        <thead>
          <th>&nbsp;</th>
          <th v-for="column in columns" v-bind:key="column">{{ column }}</th>
        </thead>
        <tbody>
           <row v-for="(row, index) in rows" v-bind:id="index" v-bind:wells="row" v-bind:key="index"></row>
        </tbody>
      </table>
    </div>
</div>
</template>

<script>

import Row from '@/components/Row.vue'
import data from '@/data/plate_reader'

export default {
  name: 'Plate',
  props: {
    rowSize: {
      type: Number,
      default: 24
    },
    wells: {
      type: Array,
      default: () => data.wells
    }
  },
  data () {
    return {
      msg: 'Plate'
    }
  },
  computed: {
    columns () {
      return Array.from(Array(this.rowSize), (e, i) => i + 1)
    },
    rows () {
      let rows = []
      for (let i = 0; i < this.wells.length; i += this.rowSize) {
        rows.push(this.wells.slice(i, i + this.rowSize))
      }
      return rows
    }
  },
  components: {
    Row
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
