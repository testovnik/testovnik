<template>
  <div>
    <div class="navbar container">
      <div class="logo-box container">
        <a href="/">
          <img class="logo" src="@/assets/Logo_png.png" alt="Testovnik Logo" />
        </a>
      </div>
      <div class="search-bar container" v-if="searchBoxDisplay">
        <input type="text" class="input-textarea" placeholder="Search for quizzes..." />
        <button type="button" class="search-button" alt="search icon">
          <img class="search-button-icon" src="../assets/search-24px.svg" />
        </button>
      </div>
      <div class="router-links container">
        <template v-if="isAuthenticated">
          <router-link to="createquiz" class="router-link">Create</router-link>
          <router-link to="profile" class="router-link" v-html="getUserName"></router-link>
          <a class="router-link" v-on:click="logout">Log out</a>
        </template>
        <template v-else>
          <router-link to="signup" class="router-link">Register</router-link>
          <router-link to="login" class="router-link">Log in</router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { AUTH_LOGOUT } from "../store/auth";
import { mapGetters } from "vuex";

export default {
  name: "Navbar",
  computed: {
    ...mapGetters(["isAuthenticated"]),
    getUserName() {
      return "@" + localStorage.getItem("username");
    },
    searchBoxDisplay() {
      return (
        this.$route.path !== "/signup" &&
        this.$route.path !== "/login" &&
        this.$route.path !== "/"
      );
    }
  },
  methods: {
    logout() {
      this.$store.dispatch(AUTH_LOGOUT);
      this.$router.push({ name: "home" });
    }
  }
};
</script>

<style lang="sass" scoped>
.container
  flex: 1
  display: flex
  flex-direction: row
  justify-content: center
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

.is-path-active
  border-bottom: 2px solid $dark-gray

.search-bar
  justify-content: center
  border-bottom: 2px solid $dark-gray
  box-shadow: 0px 4px 5px -5px $shadow
  margin-bottom: 10px
  align-content: center
  // requires styling

.search-bar input
  padding: 10px
  font-family: $roboto-mono
  box-shadow: 0
  border: none
  opacity: 0.70
  outline: none
  background: transparent
  font-size: 16px
  width: 100%

.search-button
  background: transparent
  outline: none
  box-shadow: 0
  border: none
  cursor: pointer
  opacity: 0.70
</style>
