<template>
  <div class="plate">
    <h3>{{ msg }}: {{ id }}</h3>
    <div class="col-md-12">
      <table class="table table-bordered">
        <thead>
          <th>&nbsp;</th>
          <th v-for="column in columns" v-bind:key="column">{{ column }}</th>
        </thead>
        <tbody>
           <row v-for="(row, key, index) in rows" v-bind:id="key" v-bind:wells="row" v-bind:plateId="id" v-bind:key="key.concat(index)"></row>
        </tbody>
      </table>
    </div>
</div>
</template>

<script>

import Row from '@/components/Row.vue'

export default {
  name: 'Plate',
  props: {
    id: {
      type: String
    }
  },
  data () {
    return {
      msg: 'Plate',
      grid: {},
      store: this.$Store
    }
  },
  computed: {
    columns () {
      return this.grid.columns
    },
    rows () {
      return this.grid.rows
    }
  },
  components: {
    Row
  },
  created () {
    this.store.sequencescapePlates.add(this.id)
    try {
      this.fetchData()
    } catch (error) {
      console.log(error.name)
    }
  },
  methods: {
    fetchData () {
      let json = localStorage.getItem(this.id)
      if (json !== null) {
        this.grid = JSON.parse(json)
      }
    }
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
