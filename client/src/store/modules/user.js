import axios from '@/axios'

export const user = {
  namespaced: true,
  state: {
    status: '',
    profile: {}
  },
  actions: {
    getProfile ({ commit, dispatch }) {
      commit('setRequestStatus', 'loading')
      axios.get('/api/user/myself')
        .then(resp => {
          commit('setProfile', resp)
        })
        .catch(() => {
          commit('setRequestStatus', 'error')
          dispatch('auth/resetUserToken', { root: true })
        })
    }
  },
  mutations: {
    setRequestStatus (state, status) {
      state.status = status
    },
    setProfile (state, resp) {
      state.status = 'success'
      state.profile = resp
    },
    resetProfile (state) {
      state.profile = {}
    }
  },
  getters: {
    getProfile: state => state.profile,
    isProfileLoaded: state => !!state.profile.name
  }
}
