<template>
  <div class="quiz-page" >
    <div v-if="!testStarted">
    <div v-if="quizData" class="card card--large">
      <div class="quiz-page__title">
        {{ quizData.name }}
      </div>
      <div class="quiz-page__description">
        {{ quizData.description }}
      </div>
      <div class="quiz-page__authors">
        <div v-for="author in quizData.authors" :key="author.id">
          {{ author.username }}
        </div>
      </div>
      <div class="quiz-page__actions">
        <base-button @click.native ="startTest">Start quiz</base-button>
      </div>
    </div>
    </div>
  <quiz-question v-if="testStarted"></quiz-question>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import BaseButton from '@/components/BaseButton'
import QuizQuestion from '@/components/QuizQuestion'

export default {
  components: {
    BaseButton,
    QuizQuestion
  },
  computed: {
    ...mapGetters('quiz', ['quizData', 'questions'])
  },

  data () {
    return {
      testStarted: false
    }
  },
  methods: {
    ...mapActions('quiz', ['getQuiz', 'getQuestions']),

    startTest () {
      this.getQuestions().then(() => {
        this.testStarted = true
      })
    }
  },
  mounted () {
    if (this.$route && this.$route.params && this.$route.params.id) {
      this.getQuiz(this.$route.params.id)
    }
  }
}
</script>

<style lang="sass" scoped>
.quiz-page
  width: 100%
  display: flex
  justify-content: center
  padding-top: 10px
  font-family: 'Roboto Mono'

  &__title
    font-size: 28px
    margin-bottom: 20px

  &__authors
    display: flex
    justify-content: flex-end

  &__actions
    display: flex
    justify-content: center
</style>
