<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="signup-form-container">
        <form>
          <input class="input-textarea" type="text" placeholder="E-mail" />
          <input class="input-textarea" type="text" placeholder="Passsword" />
          <input
            v-if="isCurrentPathSignUp"
            class="input-textarea"
            type="text"
            placeholder="Confirm password"
          />
          <div class="signup-form-buttons">
            <button class="signup-form-button active-theme">{{primaryButton}}</button>
            <router-link :to="targetPath">
              <button class="signup-form-button">{{secondaryButton}}</button>
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "./Navbar";

export default {
  name: "SignUpPage",
  components: { Navbar },
  data() {
    return {};
  },

  computed: {
    isCurrentPathSignUp() {
      return this.$route.path == "/signup";
    },
    primaryButton() {
      return this.isCurrentPathSignUp ? "Register" : "Log in";
    },
    secondaryButton() {
      return this.isCurrentPathSignUp ? "Login" : "Register";
    },
    targetPath() {
      return this.isCurrentPathSignUp ? "/login" : "/signup";
    }
  }
};
</script>

<style lang="sass" scoped>
.container
  display: flex
  align-items: center
  justify-content: center
  font-family: $roboto-mono
  background: $background 0% 0%
  height: calc(100vh - 65px)
  width: 100%

.signup-form-container
  width: 200px
  max-width: 50%

.input-textarea
  width: 100%
  border: 0px
  box-shadow: 0px 4px 5px -5px $shadow
  border-bottom: 2px solid $dark-gray
  padding-bottom: 3px
  margin-bottom: 30px
  display: inline-block
  font-family: $roboto-mono
  opacity: 1
  outline: none
  background: transparent
  font-size: 14

.signup-form-buttons
  text-align: center
  display: flex

.signup-form-button
  font-family: $roboto-mono
  box-shadow: 0px 3px 6px $shadow
  border-radius: 4px
  text-align: center
  width: 93px
  height: 37px
  margin: 3px
  opacity: 1

.active-theme
  background: $light-gray
</style>