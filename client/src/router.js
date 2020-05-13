import Vue from "vue"
import Router from "vue-router"
import LandingPage from "./components/LandingPage.vue"
import SignUpPage from "./components/SignUpPage"
import Profile from "./components/Profile"
import store from "./store/store"

Vue.use(Router)

export default new Router({
  mode: "history",
  linkExactActiveClass: "is-path-active",

  routes: [
    {
      path: "/",
      name: "home",
      component: LandingPage,
    },
    {
      path: "/signup",
      name: "signup",
      component: SignUpPage,
      beforeEnter(to, from, next) {
        if (store.getters.isAuthenticated) {
          next({name: "home"})
        } else {
          next()
        }
      }
    },
    {
      path: "/login",
      name: "login",
      component: SignUpPage,
      beforeEnter(to, from, next) {
        if (store.getters.isAuthenticated) {
          next({name: "home"})
        } else {
          next()
        }
      }
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      beforeEnter(to, from, next) {
        if (store.getters.isAuthenticated) {
          next()
        } else {
          next({name: "login"})
        }
      }
    },
  ],
})
