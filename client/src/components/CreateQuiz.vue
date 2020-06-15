<template>
  <div>
    <div class="container">
      <h2>Create quiz</h2>
      <input class="input-textarea" type="text" placeholder="Name" v-model="name" />
      <input class="input-textarea" type="text" placeholder="Description" v-model="description" />
      <input class="input-textarea" type="text" placeholder="Category" v-model="category" />
      <button class="signup-form-button active-theme" v-on:click.prevent="addTest">Add test</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'CreateQuiz',
  data () {
    return {
      name: '',
      description: '',
      tags: [],
      category: ''
    }
  },
  methods: {
    ...mapActions('quiz', ['addQuiz']),
    async addTest () {
      const { name, description, tags, category } = this
      const resp = await this.addQuiz({ name, description, tags, category })
      if (resp.status === 200) {
        this.$router.push({
          name: 'createquestion',
          params: { quizId: resp.data._id }
        })
      } else {
        console.log(resp)
      }
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
</style>
