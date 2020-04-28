import Vue from "vue"
import Router from "vue-router"
import LandingPage from "./components/LandingPage.vue"
import SignUpPage from "./components/SignUpPage"

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
    },
    {
      path: "/login",
      name: "login",
      component: SignUpPage,
    },
  ],
})
