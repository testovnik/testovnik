<template>
  <div  class="quiz-question card card--large">
    <div v-if="!testFinished"  class="quiz-question__text">
      {{ currentQuestion.text }}
    </div>
    <div v-if="!testFinished" class="quiz-question__answers">
      <multiselect
      v-model="selectedAnswers"
      :options="currentQuestion.answers"
      :multiple="true"
      track-by="text"
      label="text"></multiselect>
    </div>
    <div v-if="!testFinished">
    <span v-if="selectedAnswers && selectedAnswers.length > 0 ">{{checkResult}}</span>
    </div>
    <div v-if="!testFinished" class="quiz-question__actions">
      <base-button v-if="selectedAnswers && selectedAnswers.length > 0" @click.native="checkAnswer"> Check</base-button>
      <base-button @click.native="nextQuestion">Next</base-button>
    </div>
    <div class="quiz-question__text" v-if="testFinished">Test finished!</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BaseButton from '@/components/BaseButton'
import Multiselect from 'vue-multiselect'

export default {
  data () {
    return {
      isChecked: false,
      selectedAnswers: null,
      checkResult: '',
      testFinished: false
    }
  },
  components: {
    BaseButton,
    Multiselect
  },
  methods: {
    checkAnswer () {
      if (JSON.stringify(this.selectedAnswers.map(ans => ans.id)) === JSON.stringify(Array.from(this.currentQuestion.correctAnswers))) {
        this.checkResult = 'Correct!'
      } else {
        this.checkResult = 'Wrong!'
      }
    },
    nextQuestion () {
      console.log(this.questions.indexOf(this.currentQuestion) + 1)
      if (this.questions.indexOf(this.currentQuestion) + 1 < this.questions.length - 1) {
        this.$store.commit('setCurrentQuestion', this.questions[this.questions.indexOf(this.currentQuestion) + 1])
      } else {
        console.log('finished')
        this.testFinished = true
      }
    }
  },
  computed: {
    ...mapGetters('quiz', ['currentQuestion', 'questions'])
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
