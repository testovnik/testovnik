import Vue from "vue"
import Router from "vue-router"
import LandingPageUnregistered from "./components/LandingPageUnregistered.vue"

Vue.use(Router)

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: LandingPageUnregistered,
    },
  ],
})
