<template>
  <td class="well" v-bind:class="classObject" v-on:click="active = !active">
    {{ id }}
    <br/>
    {{ concentration }}
    {{ active }}
  </td>
</template>

<script>
export default {
  name: 'Well',
  props: {
    row: {
      default: ''
    },
    column: {
      default: ''
    },
    type: {},
    id: {},
    concentration: {
      default: ''
    },
    active: {
      default: true,
      type: Boolean
    },
    triplicate: {
      default: () => {},
      type: Object
    }
  },
  data () {
    return {
      msg: 'Well'
    }
  },
  computed: {
    location () {
      return this.row.concat(this.column)
    },
    classObject () {
      if (!this.active) {
        return {
          inactive: true
        }
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
.table td, .table th {
  min-width: 75px;
  min-height: 50px;
  font-size: 12px;
}
.inactive {
  background-color: gray;
  color: white;
}
</style>
