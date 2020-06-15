<template>
  <div>
    <div class="container">
      <h2>Create question</h2>
      <input class="input-textarea" type="text" placeholder="Question" v-model="text" />
      <ul id="answers">
        <li v-for="answer in answers" :key="answer.localId">
          <input type="checkbox" :value="answer.id" v-model="correctAnswers" />
          <input class="input-textarea" type="text" placeholder="Answer" v-model="answer.text" />
        </li>
      </ul>
      <button class="signup-form-button active-theme" v-on:click="addNewAnswer">Add Answer</button>
      <button class="signup-form-button active-theme" v-on:click="submitQuestion">Submit question</button>
      <button class="signup-form-button active-theme" v-on:click="gotoQuiz">Finish</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'CreateQuestion',
  data () {
    return {
      text: '',
      answers: [
        {
          id: 1,
          text: ''
        },
        {
          id: 2,
          text: ''
        },
        {
          id: 3,
          text: ''
        },
        {
          id: 4,
          text: ''
        }
      ],
      correctAnswers: []
    }
  },
  props: ['quizId'],
  methods: {
    ...mapActions('quiz', ['addQuestion']),
    async submitQuestion () {
      const { text, correctAnswers, answers, quizId } = this
      const question = { text, correctAnswers, answers }
      const resp = await this.addQuestion({ quizId, question })
      if (resp.status === 200) {
        this.text = ''
        this.answers = [
          {
            id: 1,
            text: ''
          },
          {
            id: 2,
            text: ''
          },
          {
            id: 3,
            text: ''
          },
          {
            id: 4,
            text: ''
          }
        ]
        this.correctAnswers = []
      } else {
        console.log(resp)
      }
    },
    addNewAnswer () {
      let localId = 0
      this.answers.forEach(answer => {
        if (answer.id > localId) localId = answer.id
      })
      this.answers.push({ id: localId + 1, text: '' })
    },
    gotoQuiz () {
      this.$router.push({
        name: 'quizPage',
        params: { id: this.quizId }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.container
  display: flex
  align-items: center
  flex-direction: column
  font-family: $roboto-mono
  background: $background 0% 0% no-repeat padding-box
  height: calc(100vh - 65px)
  width: 100%

  .input-textarea
    width: 80%
    border: 0px
    box-shadow: 0px 4px 5px -5px $shadow
    border-bottom: 1px solid $dark-gray
    padding-bottom: 3px
    margin-bottom: 30px
    display: inline-block
    font-family: $roboto-mono
    opacity: 1
    outline: none
    background: transparent
    font-size: 14px
    padding: 10px 5px

.signup-form-buttons
  text-align: center
  display: flex

.signup-form-button
  font-family: $roboto-mono
  box-shadow: 0px 3px 6px $shadow
  border-radius: 4px
  text-align: center
  width: 93px
  height: 37px
  margin: 3px
  outline: none
  border: none
  cursor: pointer
#answers
  list-style-type: none
  width: 80%
</style>
