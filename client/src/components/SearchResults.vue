<template>
  <div class="search-results">
    <div class="container">
      <div v-for="quiz in quizes" :key="quiz._id" class="card quiz">
        <div class="quiz__title">
          {{ quiz.name }}
        </div>
        <div class="quiz__description">
          {{ quiz.description }}
        </div>
        <div class="quiz__footer">
          <div class="quiz__author">
            @{{ quiz.authors[0].username }}
          </div>
          <router-link class="quiz__link" :to="{name: 'quizPage', params: { id: quiz._id }}">
            Select
          </router-link>
        </div>
      </div>
      <div v-for="num in 4" :key="num" class="quiz quiz--hiden-flex" ></div>
    </div>
  </div>
</template>

<script>
import { search } from '@/helpers/api_helpers'

export default {
  data () {
    return {
      quizes: []
    }
  },
  methods: {
    search,
    async getQuzes () {
      this.quizes = await this.search()
    }
  },
  mounted () {
    // idealy if search was working it would support link query
    this.getQuzes()
  }
}
</script>

<style lang="sass" scoped>
.search-results
  width: 100%
  display: flex
  justify-content: center
  padding-top: 20px
  font-family: $roboto-mono

.container
  width: 1024px
  display: flex
  flex-wrap: wrap

.quiz
  flex: 1 1 25%
  margin: 15px

  &__title
    font-size: 18px
    font-weight: 600
    margin-bottom: 15px

  &__footer
    display: flex
    justify-content: space-between
    margin-top: 10px

  &__author
    text-decoration: underline

  &__link
    text-decoration: none
    color: black

  &--hidden-flex
    visibility: hidden
</style>
