<template>
  <div class="quiz-question card card--large">
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
    <span v-if="selectedAnswers && selectedAnswers.length > 0 ">{{checkResult}}</span>
    <div v-if="!testFinished && answerChecked">
    <br>
    <div v-if="ansWrong">
    <span>The correct ones are:</span>
    <div v-for="correctAns in correctAnsArr" :key="correctAns.id"> {{correctAns.text}}</div>
    </div>
    </div>
    <div v-if="!testFinished" class="quiz-question__actions">
      <base-button v-if="selectedAnswers && selectedAnswers.length > 0" @click.native="checkAnswer"> Check</base-button>
      <base-button v-if="selectedAnswers && selectedAnswers.length > 0 && answerChecked" @click.native="nextQuestion">Next</base-button>
    </div>
    <div class="quiz-question__text" v-if="testFinished">Test finished!
      <div>Correct answers: {{correctAns}} / {{questions.length}}</div>
      <div>Incorrect answers: {{incorrectAns}} / {{questions.length}}</div>
      <base-button @click.native="retakeQuiz">Retake Quiz</base-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BaseButton from '@/components/BaseButton'
import Multiselect from 'vue-multiselect'

export default {
  data () {
    return {
      isChecked: false,
      selectedAnswers: null,
      checkResult: '',
      testFinished: false,
      correctAns: 0,
      incorrectAns: 0,
      answerChecked: false,
      correctAnsArr: [],
      ansWrong: false

    }
  },
  components: {
    BaseButton,
    Multiselect
  },
  methods: {
    ...mapActions('quiz', ['updateCurrentQuestion']),

    checkAnswer () {
      this.answerChecked = true
      if (JSON.stringify(this.selectedAnswers.map(ans => ans.id)) === JSON.stringify(Array.from(this.currentQuestion.correctAnswers))) {
        this.checkResult = 'Correct!'
        this.ansWrong = false
        return 1
      } else {
        this.checkResult = 'Wrong!'
        this.ansWrong = true
        this.correctAnsArr = this.currentQuestion.answers.filter(ans => this.currentQuestion.correctAnswers.includes(ans.id))
        return 0
      }
    },
    nextQuestion () {
      this.correctAnsArr = []
      if (this.checkAnswer() === 1) {
        this.correctAns += 1
        this.checkResult = ''
      } else {
        this.incorrectAns += 1
        this.checkResult = ''
      }
      this.selectedAnswers = null
      if (this.questions.indexOf(this.currentQuestion) + 1 <= this.questions.length - 1) {
        this.answerChecked = false
        this.updateCurrentQuestion(this.questions.indexOf(this.currentQuestion) + 1)
      } else {
        this.testFinished = true
      }
    },
    retakeQuiz () {
      this.$router.go()
    }
  },
  computed: {
    ...mapGetters('quiz', ['currentQuestion', 'questions'])
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
