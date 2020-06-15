import axios from '@/axios'

export const quiz = {
  namespaced: true,
  state: {
    quizData: {},
    questions: [],
    currentQuestion: {}
  },
  actions: {
    async getQuiz ({ commit }, id) {
      const quiz = await axios(`test/${id}`)
        .then(res => res && res.data)
        .catch(() => null)
      if (quiz) commit('setQuizData', quiz)
    },
    async getQuestions ({ commit, state }) {
      const quizId = state.quizData._id
      if (quizId) {
        const questions = await axios(`test/${quizId}/questions`)
          .then(res => res && res.data)
          .catch(() => null)
        if (questions) commit('setQuizQuestions', questions)
      }
    },
    updateCurrentQuestion ({ commit }, nextQuestionID) {
      commit('setCurrentQuestion', nextQuestionID)
    }

  },
  mutations: {
    setQuizData (state, quiz) {
      state.quizData = quiz
    },
    setQuizQuestions (state, questions) {
      state.questions = questions
      state.currentQuestion = questions[0]
    },
    setCurrentQuestion (state, payload) {
      state.currentQuestion = state.questions[payload]
    }
  },
  getters: {
    quizData: state => state.quizData,
    questions: state => state.questions,
    currentQuestion: state => state.currentQuestion
  }
}
