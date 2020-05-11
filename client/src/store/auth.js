import axios from "axios"

export const AUTH_REQUEST = "AUTH_REQUEST"
export const AUTH_SUCCESS = "AUTH_SUCCESS"
export const AUTH_ERROR = "AUTH_ERROR"
export const AUTH_LOGOUT = "AUTH_LOGOUT"

const state = {
    token: localStorage.getItem("user-token") || "",
    status: "",
    errorCode: "",
}

const getters = {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
    error: state => state.errorCode,
}

const actions = {
    [AUTH_REQUEST]: ({ commit}, user) => {
        commit(AUTH_REQUEST)
        return axios.post("api/user/login", user).then(resp => {
            console.log(resp)
            localStorage.setItem("user-token", resp.data.token)
            axios.defaults.headers.common['Authorization'] = resp.data.token
            commit(AUTH_SUCCESS, resp.data.token)
            //dispatch(USER_REQUEST)
        })
            .catch(err => {
                commit(AUTH_ERROR, err.response)
                localStorage.removeItem("user-token")
            })
    },
    [AUTH_LOGOUT]: ({ commit }) => {
        commit(AUTH_LOGOUT)
        localStorage.removeItem("user-token")
        axios.defaults.headers.common['Authorization'] = ""
    }
}

const mutations = {
    [AUTH_REQUEST]: state => {
        state.status = "loading"
    },
    [AUTH_SUCCESS]: (state, token) => {
        state.status = "success"
        state.token = token
    },
    [AUTH_ERROR]: (state, err) => {
        state.status = "error"
        state.errorCode = err.status
    },
    [AUTH_LOGOUT]: state => {
        state.token = ""
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}