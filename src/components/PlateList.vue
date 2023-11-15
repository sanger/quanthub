<template>
  <div class="container-fluid">
    <upload></upload>
    <div class="plates">
      <b-container fluid>
        <b-row align-h="start">
          <b-col cols="1">
            <h3>{{ msg }}</h3>
          </b-col>
          <b-col cols="2">
            <button
              id="clear_local_storage_button"
              type="button"
              class="btn btn-success"
              v-on:click="clearLocalStorage"
            >
              {{ clearLocalStorageTxt }}
            </button>
          </b-col>
          <b-col cols="3">
            <em>{{ localStorageUsed }}</em>
          </b-col>
        </b-row>
        <b-col>
          <router-link
            v-for="plate in plates"
            :to="`/plate/${plate}`"
            :key="plate"
            class="plate"
            tag="div"
          >
            <b-row>
              <div>
                <a>{{ plate }}</a>
              </div>
            </b-row>
          </router-link>
        </b-col>
      </b-container>
    </div>
  </div>
</template>

<script>
import Upload from '@/components/Upload'

export default {
  name: 'Plates',
  props: {},
  data() {
    return {
      msg: 'Plates',
      clearLocalStorageTxt: 'Clear Local Storage',
      localStorageClearedCounter: 0,
    }
  },
  computed: {
    plates() {
      // localStorage is not reactive, so to trigger a recomputation we use a data counter that is
      this.localStorageClearedCounter

      // loglevel:webpack-dev-server is a local storage item added during dev.
      // need to find a way to remove it by environment.
      return Object.keys(localStorage).filter(
        (key) =>
          Object.prototype.hasOwnProperty.call(localStorage, 'key') &&
          key !== 'loglevel:webpack-dev-server'
      )
    },
    localStorageUsed() {
      // localStorage is not reactive, so to trigger a recomputation we use a data counter that is
      this.localStorageClearedCounter

      var allStrings = ''
      for (var key in window.localStorage) {
        if (Object.prototype.hasOwnProperty.call(window.localStorage, 'key')) {
          allStrings += window.localStorage[key]
        }
      }
      return `Local Storage used (of 5 MB) = ${
        allStrings
          ? Math.round((3 + (allStrings.length * 16) / (8 * 1024)) * 100) /
              100 +
            ' KB'
          : 'Empty (0 KB)'
      }`
    },
  },
  components: {
    Upload,
  },
  methods: {
    clearLocalStorage() {
      // Clear local storage and trigger refresh of plateslist
      localStorage.clear()
      this.localStorageClearedCounter += 1
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
