<!-- A simple NavBar. Ready for expansion. -->
<template>
  <div class="nav-bar">
    <b-navbar
      class="navbar-default bg-dark"
      toggleable="md"
      type="dark"
      variant="info"
    >
      <b-navbar-brand href="/">QuantHub</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <router-link tag="b-nav-item" to="/">
          <a>Upload a new plate</a>
        </router-link>
        <router-link tag="b-nav-item" to="print_job">
          <a>Print a barcode</a>
        </router-link>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
}
</script>
