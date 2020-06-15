import axios from '@/axios'

export function addQuiz (quiz) {
  return axios.post('test', quiz).then(res => res)
    .catch(err => {
      console.log(err.response)
    })
}
export function addQuestion (quizId, question) {
  console.log(question)
  console.log('quizid', quizId)
  return axios.post(`test/${quizId}/question`, question).then(res => res)
    .catch(err => {
      console.log(err.response)
    })
}
