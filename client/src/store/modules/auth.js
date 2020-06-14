import axios from '@/axios'

export const auth = {
  namespaced: true,
  state: {
    token: localStorage.getItem('user-token') || '',
    status: '',
    error: ''
  },
  actions: {
    login ({ commit }, user) {
      commit('setRequestStatus', 'loading')
      axios.post('user/login', user).then(resp => {
        localStorage.setItem('user-token', resp.data.token)
        localStorage.setItem('username', resp.data.username)
        axios.defaults.headers.common.Authorization = resp.data.token
        commit('setUserToken', resp.data.token)
      })
        .catch(err => {
          console.log(err.response)
          commit('setAuthError', err.response)
          localStorage.removeItem('user-token')
          localStorage.removeItem('username')
        })
    },
    register ({ commit }, user) {
      commit('setRequestStatus', 'loading')
      return axios.post('user/register', user).then(resp => {
        localStorage.setItem('user-token', resp.data.token)
        localStorage.setItem('username', resp.data.username)
        axios.defaults.headers.common.Authorization = resp.data.token
        commit('setUserToken', resp.data.token)
      })
        .catch(err => {
          console.log(err.response)
          commit('setAuthError', err.response)
        })
    },
    logout ({ commit }) {
      commit('resetUserToken')
      localStorage.removeItem('user-token')
      localStorage.removeItem('username')
      axios.defaults.headers.common.Authorization = ''
    }
  },
  mutations: {
    setRequestStatus (state, status) {
      state.status = status
    },
    setUserToken (state, token) {
      state.token = token
      state.status = 'success'
    },
    setAuthError (state, error) {
      state.error = error.data
      state.status = 'error'
    },
    resetUserToken (state) {
      state.token = ''
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
    errors: state => state.error
  }
}
