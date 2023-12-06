<template>
  <div class="flex flex-col min-h-screen">
    <!-- TODO: move this into a header component -->
    <div class="relative bg-gradient-to-tr from-sdb to-sdb-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          class="flex justify-between items-center py-4 md:justify-start md:space-x-10"
        >
          <div class="flex flex-row gap-x-2">
            <div class="text-white text-2xl">Quanthub</div>
            <PageLink name="Upload a new plate" link="/" view-type="2" />
            <PageLink name="Print a barcode" link="/print_job" view-type="2" />
          </div>
        </div>
      </div>
    </div>

    <PageHeading level="1" shadow>{{ pipeline }} {{ page }}</PageHeading>
    <div class="flex flex-col mb-auto px-4 pt-4 pb-10">
      <router-view class="text-center" />
    </div>

    <PageFooter></PageFooter>
  </div>
</template>

<script>
import PageFooter from '@/components/PageFooter.vue'
import PageLink from '@/components/PageLink.vue'
import PageHeading from '@/components/PageHeading.vue'
// import NavBar from '@/components/NavBar.vue'

export default {
  name: 'App',
  components: {
    PageFooter,
    PageLink,
    PageHeading,
    // NavBar,
  },
}
</script>

<style lang="scss">
@import 'src/assets/stylesheets/colors.scss';
@import '~bootstrap/scss/bootstrap';

#app {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
nav {
  margin-bottom: 5px;
}
#nav {
  margin-bottom: 5px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
    &.router-link-active {
      color: #42b983;
    }
  }
}
a {
  color: black;
  &:hover {
    text-decoration: none;
    color: black;
  }
}
</style>
