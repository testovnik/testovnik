<template>
  <div>
    <div class="navbar container">
      <router-link to="/">
        <img class="logo" src="@/assets/Logo_png.png" alt="Testovnik Logo" />
      </router-link>
      <div class="router-links container">
        <router-link to="signup" class="router-link">Register</router-link>
        <router-link to="login" class="router-link">Log in</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default { name: "Navbar" };
</script>

<style lang="sass" scoped>
.container
  flex: 1
  display: flex
  flex-direction: row
  font-family: $roboto-mono

.navbar
  height: 65px
  background: $light-gray 0% 0% no-repeat padding-box
  box-shadow: 0px 3px 6px $shadow
  opacity: 1

.logo
  margin-left: 60px
  margin-top: 20px
  max-height: 24px
  max-width: 139px

.router-links
  font-weight: 700
  text-align: center
  justify-content: flex-end
  font-size: 16px

  margin-top: 22px
  margin-right: 74px

.router-link
  margin-right: 29px
  text-decoration: none
  color: $dark-gray
</style>
