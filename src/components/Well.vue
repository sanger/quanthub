<template>
  <td class="well" v-bind:class="classObject" v-on:click="active = !active">
    {{ id }}
    <br/>
    {{ concentration }}
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
    }
  },
  data () {
    return {
      msg: 'Well',
      store: this.$Store,
      triplicate: {}
    }
  },
  computed: {
    location () {
      return this.row.concat(this.column)
    },
    classObject () {
      if (!this.active && this.hasConcentration() && this.isSample()) {
        return {
          inactive: true
        }
      } else {
        return {
          standard: this.isStandard(),
          control: this.isControl(),
          inspect: this.needsInspection()
        }
      }
    }
  },
  methods: {
    isStandard () {
      return this.type === 'Standard'
    },
    isSample () {
      return this.type === 'Sample'
    },
    isControl () {
      return this.type === 'Control'
    },
    hasConcentration () {
      return this.concentration !== ''
    },
    needsInspection () {
      return parseFloat(this.triplicate.cv) > 20
    }
  },
  created () {
    if (this.isSample()) {
      this.store.triplicates.add(this)
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
.standard {
  background-color: blue;
  color: white;
}
.control {
  background-color: green;
  color: white;
}
.inspect {
  background-color: red;
  color: white;
}
</style>
