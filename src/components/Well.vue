<template>
  <td class='well'>
    
  </td>
</template>

<script>
export default {
  name: 'Well',
  props: ['row', 'column'],
  data () {
    return {
      msg: 'Well'
    }
  },
  computed: {
    location () {
      return this.row.concat(this.column)
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
</style>
