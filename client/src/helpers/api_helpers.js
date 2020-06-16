import axios from '@/axios'
import Vue from 'vue'

export function addQuiz (quiz) {
  return axios.post('test', quiz).then(res => res)
    .catch(err => {
      console.log(err.response)
      Vue.$toast.error(err.response.data.join('<br/>'))
    })
}
export function addQuestion (quizId, question) {
  console.log(question)
  console.log('quizid', quizId)
  return axios.post(`test/${quizId}/question`, question).then(res => res)
    .catch(err => {
      console.log(err.response)
      Vue.$toast.error(err.response.data.join('<br/>'))
    })
}

export async function search () {
  const results = await axios('test')
    .then(res => res && res.data)
    .catch(() => [])
  return results
}
