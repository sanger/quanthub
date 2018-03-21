<template>
  <div>
    <upload></upload>
    <div class="plates">
      <h3>{{ msg }}</h3>
      <ul>
         <router-link v-for="plate in plates" :to="`/plate/${plate}`" :key="plate" tag="li">
           <a>{{ plate }}</a>
         </router-link>
      </ul>
    </div>
  </div>
</template>

<script>

import Upload from '@/components/Upload.vue'

export default {
  name: 'Plates',
  props: {
  },
  data () {
    return {
      msg: 'Plates'
    }
  },
  computed: {
    plates () {
      // loglevel:webpack-dev-server is a local storage item added during dev.
      // need to find a way to remove it by environment.
      return Object.keys(localStorage).filter(key => localStorage.hasOwnProperty(key) && key !== 'loglevel:webpack-dev-server')
    }
  },
  components: {
    Upload
  },
  methods: {
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
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
