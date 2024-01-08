<template>
  <div>
    <upload></upload>
    <div class="plates space-x-2 pt-2">
      <custom-button
        id="clear_local_storage_button"
        type="button"
        theme="create"
        @click="clearLocalStorage"
      >
        {{ clearLocalStorageTxt }}
      </custom-button>
      <em>{{ localStorageUsed }}</em>

      <PageHeading level="3" show-border>{{ msg }}</PageHeading>
      <router-link
        v-for="plate in plates"
        :key="plate"
        :to="`/plate/${plate}`"
        class="plate"
        tag="div"
      >
        <div class="text-left">
          <a
            class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
            >{{ plate }}</a
          >
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import Upload from '@/components/Upload.vue'
import PageHeading from '@/components/PageHeading.vue'

export default {
  name: 'Plates',
  components: {
    Upload,
    PageHeading,
  },
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
          Object.prototype.hasOwnProperty.call(localStorage, key) &&
          key !== 'loglevel:webpack-dev-server'
      )
    },
    localStorageUsed() {
      // localStorage is not reactive, so to trigger a recomputation we use a data counter that is
      this.localStorageClearedCounter

      var allStrings = ''
      for (var key in window.localStorage) {
        if (Object.prototype.hasOwnProperty.call(window.localStorage, key)) {
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
