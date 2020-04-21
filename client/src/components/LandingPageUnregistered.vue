<template>
  <div>
    <Navbar />
    <div class="container">
      <img
        class="doodle"
        src="@/assets/component.png"
        alt="Artwork by https://absurd.design/illustrations.html"
      />
      <div class="input-box">
        <input type="text" class="input-text" placeholder="Search for quizess" />
        <img class="search-button" src="@/assets/search-24px.svg" alt="search icon" />
      </div>

      <Footer />
    </div>
  </div>
</template>

<script>
import Navbar from "./Navbar";
import Footer from "./Footer";
export default {
  name: "LandingPageUnregistered",
  components: {
    Navbar,
    Footer
  }
};
</script>

<style lang="sass" scoped>
.container
  flex: 1
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column
  font-family: Roboto Mono
  background: $background 0% 0% no-repeat padding-box
  min-height: 100vh
  height: 100%

.input-box
  flex: 1
  flex-direction: row

.input-text
  padding: 20px
  margin-bottom: 30px
  font-family: Roboto Mono
  box-shadow: 0
  border: none
  border-bottom: 2px solid $dark-gray
  opacity: 0.51
  outline: none
  background: transparent
  font-size: 16px

.search-button
  height: 24px
  width: 24px
  border: none
  background: none
  cursor: pointer
</style>
