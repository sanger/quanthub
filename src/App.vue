<template>
  <div class="flex flex-col min-h-screen">
    <!-- TODO: move this into a header component -->
    <div class="relative bg-linear-to-r from-sdb to-sdb-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          class="flex justify-between items-center py-4 md:justify-start md:space-x-10"
        >
          <div class="flex flex-row gap-x-2">
            <a href="/"
              ><img
                src="@/assets/logo-32x32.png"
                alt="Quanthub Logo"
                class="h-8 w-auto"
            /></a>
            <a href="/"><div class="text-white text-2xl">Quanthub</div></a>
            <PageLink name="Upload a new plate" link="/" view-type="2" />
            <PageLink name="Print a barcode" link="/print_job" view-type="2" />
          </div>
        </div>
      </div>
    </div>

    <PageHeading level="1" shadow>{{ page }}</PageHeading>
    <div class="flex flex-col mb-auto px-4 pt-4 pb-10">
      <router-view class="text-center" />
    </div>
    <PageFooter></PageFooter>
  </div>
</template>

<script>
import PageFooter from '@/components/PageFooter.vue'
import PageHeading from '@/components/PageHeading.vue'
import PageLink from '@/components/PageLink.vue'

export default {
  name: 'App',
  components: {
    PageFooter,
    PageLink,
    PageHeading,
  },
  computed: {
    mergedRoute() {
      return Object.assign({}, ...this.$route.matched.map(({ meta }) => meta))
    },
    page() {
      return this.mergedRoute.page
    },
  },
}
</script>
