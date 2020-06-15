<template>
  <div>
    <div class="container">
      <img
        class="doodle"
        src="@/assets/component.png"
        alt="Artwork by https://absurd.design/illustrations.html"
      />
      <div class="input-box">
        <input type="text" class="input-textarea" placeholder="Search for quizzes..." />
        <button type="button" class="search-button" alt="search icon" @click="search">
          <img class="search-button-icon" src="../assets/search-24px.svg" />
        </button>
      </div>
      <Footer />
    </div>
  </div>
</template>

<script>
import Footer from './Footer'
export default {
  name: 'LandingPage',
  components: {
    Footer
  },
  methods: {
    search () {
      this.$router.push({ name: 'search' })
    }
  }
}
</script>

<style lang="sass" scoped>
.container
  display: flex
  align-items: center
  flex-direction: column
  font-family: $roboto-mono
  background: $background 0% 0% no-repeat padding-box
  height: calc(100vh - 65px)
  width: 100%

.input-box
  border-bottom: 2px solid $dark-gray
  box-shadow: 0px 4px 5px -5px $shadow
  margin-bottom: 30px

.input-textarea
  padding: 20px
  font-family: $roboto-mono
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
