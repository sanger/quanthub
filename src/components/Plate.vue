<!-- TODO:  It seems that empty wells do not appear so the plate is compacted
            which is not the correct behaviour. -->

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
           <row v-for="(row, index) in rows" v-bind:id="index" v-bind:wells="row" v-bind:key="index"></row>
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
    rowSize: {
      type: Number,
      default: 24
    },
    id: {
      type: String
    }
  },
  data () {
    return {
      msg: 'Plate',
      wells: []
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
  },
  created () {
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
        this.wells = JSON.parse(json).wells
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
