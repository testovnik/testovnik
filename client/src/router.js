import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from './components/LandingPage.vue'
import SignUpPage from './components/SignUpPage'
import Profile from './components/Profile'
import CreateQuiz from './components/CreateQuiz'
import CreateQuestion from './components/CreateQuestion'
import QuizPage from '@/components/QuizPage'
import SearchResults from '@/components/SearchResults'
import store from './store'

Vue.use(Router)

export default new Router({
  linkExactActiveClass: 'is-path-active',

  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpPage,
      beforeEnter (to, from, next) {
        if (store.getters['auth/isAuthenticated']) {
          next({ name: 'home' })
        } else {
          next()
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: SignUpPage,
      beforeEnter (to, from, next) {
        if (store.getters['auth/isAuthenticated']) {
          next({ name: 'home' })
        } else {
          next()
        }
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      beforeEnter (to, from, next) {
        if (store.getters['auth/isAuthenticated']) {
          next()
        } else {
          next({ name: 'login' })
        }
      }
    },
    {
      path: '/createquiz',
      name: 'createquiz',
      component: CreateQuiz,
      beforeEnter (to, from, next) {
        if (store.getters['auth/isAuthenticated']) {
          next()
        } else {
          next({ name: 'login' })
        }
      }
    },
    {
      path: '/createquestion',
      name: 'createquestion',
      component: CreateQuestion,
      props: true
    },
    {
      path: '/quiz/:id',
      name: 'quizPage',
      component: QuizPage
    },
    {
      path: '/search',
      name: 'search',
      component: SearchResults
    }
  ]
})
