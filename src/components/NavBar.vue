<!-- A simple NavBar. Ready for expansion. -->
<template>
  <div class="nav-bar">
    <b-navbar class="navbar-default bg-dark" toggleable="md" type="dark" variant="info">
      <b-navbar-brand href="/">QuantHub</b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="/">Upload a new plate</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>

export default {
  name: 'NavBar'
}
</script>
