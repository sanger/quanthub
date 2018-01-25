<template>
  <div class="plate">
    <h1>{{ msg }}</h1>
    <div class="col-md-12">
      <table class="table table-bordered">
        <thead>
          <th >&nbsp;</th>
          <th v-for="column in columns">{{ column }}</th>
          <tr v-for="row in rows">
            <td>{{ row }}</td>
            <well v-for="column in columns" v-bind:row="row" v-bind:column="column" :key="row.concat(column)"></well>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

import Well from '../components/Well.vue'

export default {
  name: 'Plate',
  data () {
    return {
      msg: 'Plate',
      columns: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P']
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
</style>
