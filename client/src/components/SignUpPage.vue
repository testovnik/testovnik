<template>
  <div>
    <div class="container">
      <div class="signup-form-container">
        <form>
          <input
            v-if="isCurrentNameSignUp"
            class="input-textarea"
            type="text"
            placeholder="Username"
            v-model="username"
          />
          <input class="input-textarea" type="text" placeholder="E-mail" v-model="email" />
          <input class="input-textarea" type="password" placeholder="Password" v-model="password" />
          <input
            v-if="isCurrentNameSignUp"
            class="input-textarea"
            type="password"
            placeholder="Confirm password"
            v-model="confirmpassword"
          />
          <div class="signup-form-buttons">
            <button
              class="signup-form-button active-theme"
              v-on:click.prevent="doAction"
            >{{primaryButton}}</button>
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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SignUpPage',
  data () {
    return {
      username: '',
      email: '',
      password: '',
      confirmpassword: ''
    }
  },

  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'errors']),
    isCurrentNameSignUp () {
      return this.$route.path === '/signup'
    },
    primaryButton () {
      return this.isCurrentNameSignUp ? 'Register' : 'Log in'
    },
    secondaryButton () {
      return this.isCurrentNameSignUp ? 'Login' : 'Register'
    },
    targetPath () {
      return this.isCurrentNameSignUp ? '/login' : '/signup'
    },
    errorMessage () {
      return this.errors
        ? this.errors.join('<br/>')
        : ''
    }
  },
  methods: {
    ...mapActions('auth', ['login', 'register']),
    doAction () {
      const { email, password } = this
      if (this.isCurrentNameSignUp) {
        const { confirmpassword, username } = this
        if (username || password === confirmpassword) this.register({ email, password, username })
      } else {
        this.login({ email, password })
      }
    }
  },
  watch: {
    isAuthenticated (val) {
      if (val) {
        this.$root.$toast.success('Success')
        this.$router.push({ name: 'home' })
      }
    },
    errorMessage (val) {
      if (val && val.length) this.$root.$toast.error(this.errorMessage)
    }
  }
}
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
  border-bottom: 1px solid $dark-gray
  padding-bottom: 3px
  margin-bottom: 30px
  display: inline-block
  font-family: $roboto-mono
  opacity: 1
  outline: none
  background: transparent
  font-size: 14px
  padding: 10px 5px

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
  outline: none
  border: none
  cursor: pointer

.active-theme
  background: $light-gray

.error-log
  color: red
  font-weight: bold
// needs better styling
</style>
