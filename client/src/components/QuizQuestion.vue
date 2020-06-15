<template>
  <div class="quiz-question card card--large">
    <div class="quiz-question__text">
      {{ currentQuestion.text }}
    </div>
    <div class="quiz-question__answers">
      <div v-for="answer in currentQuestion.answers"
        :key="answer._id"
        class="quiz-question__answer">
        {{ answer.text }}
      </div>
    </div>
    <div class="quiz-question__actions">
      <base-button>Check</base-button>
      <base-button>Next</base-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      isChecked: false
    }
  },
  computed: {
    ...mapGetters('quiz', ['currentQuestion'])
  }
}
</script>
