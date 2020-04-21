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
        <input
          type="text"
          class="input-textarea"
          placeholder="Search for quizess"
        />
        <button type="button" class="search-button" alt="search icon">
          <img class="search-button-icon" src="../assets/search-24px.svg" />
        </button>
      </div>
      <Footer />
    </div>
  </div>
</template>

<script>
import Navbar from "./Navbar"
import Footer from "./Footer"
export default {
  name: "LandingPageUnregistered",
  components: {
    Navbar,
    Footer,
  },
}
</script>

<style lang="sass" scoped>
//not working, no idea why
// * ::before ::after
//   margin: 0
//   padding: 0

.container
  display: flex
  align-items: center
  flex-direction: column
  font-family: Roboto Mono
  background: $background 0% 0% no-repeat padding-box
  min-height: 100vh
  height: 100%
  min-width: 100vh
  width: 100%

.input-box
  border-bottom: 2px solid $dark-gray
  box-shadow: 0px 4px 5px -5px $shadow
  margin-bottom: 30px

.input-textarea
  padding: 20px
  font-family: Roboto Mono
  box-shadow: 0
  border: none
  opacity: 0.51
  outline: none
  background: transparent
  font-size: 16px
  min-width: 615px


.search-button
  height: 24px
  width: 24px
  padding: 0px
  background: transparent
  outline: none
  box-shadow: 0
  border: none
  cursor: pointer
</style>
