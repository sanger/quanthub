<template>
  <div class="plate">
    <div class="container-fluid">
      <div class="row">
        <h3>{{ msg }}: {{ id }}</h3>
        <div><button name="save" id="save" class="btn btn-primary" v-on:click.prevent="save">Save</button></div>
      </div>
    </div>
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
import Grid from '@/components/Grid.vue'
import Vue from 'vue'

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
    Row,
    Grid
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
    },
    // This may seem counter intuitive but is necessary to update local storage
    // The wells could be totally different if it is a new plate
    toGrid () {
      let Cmp = Vue.extend(Grid)
      let grid = new Cmp()
      for (let row of this.$children) {
        grid.addAll(row.json)
      }
      return grid.json
    },
    save (event) {
      localStorage.setItem(this.id, JSON.stringify(this.toGrid()))
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
h3 {
  margin-right: 20px;
}
</style>
