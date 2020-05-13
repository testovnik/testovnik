<template>
  <div>
    <Navbar />
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
import Navbar from "./Navbar";
import { AUTH_LOGIN_REQUEST, AUTH_REGISTER_REQUEST } from "../store/auth";

export default {
  name: "SignUpPage",
  components: { Navbar },
  data() {
    return {
      username: "",
      email: "",
      password: "",
      confirmpassword: ""
    };
  },

  computed: {
    isCurrentNameSignUp() {
      return this.$route.path === "/signup";
    },
    primaryButton() {
      return this.isCurrentNameSignUp ? "Register" : "Log in";
    },
    secondaryButton() {
      return this.isCurrentNameSignUp ? "Login" : "Register";
    },
    targetPath() {
      return this.isCurrentNameSignUp ? "/login" : "/signup";
    },
    errors() {
      return this.$store.getters.errors
        ? this.$store.getters.errors.join("\n")
        : "";
    }
  },
  methods: {
    login() {
      const { email, password } = this;
      this.$store
        .dispatch(AUTH_LOGIN_REQUEST, {
          email,
          password
        })
        .then(() => {
          if (this.$store.getters.authStatus === "success") {
            this.$router.push({ name: "profile" });
          } else {
            alert(this.errors);
          }
        });
    },
    register() {
      const { username, email, password, confirmpassword } = this;
      if (password === confirmpassword) {
        this.$store
          .dispatch(AUTH_REGISTER_REQUEST, {
            username,
            email,
            password
          })
          .then(() => {
            if (this.$store.getters.authStatus === "success") {
              this.$router.push({ name: "login" });
              alert("successful");
            } else {
              alert(this.errors);
            }
          });
      } else {
        alert("Passwords are not identical");
      }
    },
    doAction() {
      if (this.isCurrentNameSignUp) {
        this.register();
      } else {
        this.login();
      }
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

.error-log
  color: red
  font-weight: bold
// needs better styling
</style>