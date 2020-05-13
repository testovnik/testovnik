import axios from "axios"

export const AUTH_LOGIN_REQUEST = "AUTH_LOGIN_REQUEST"
export const AUTH_LOGIN_SUCCESS = "AUTH_LOGIN_SUCCESS"
export const AUTH_REGISTER_REQUEST = "AUTH_REGISTER_REQUEST"
export const AUTH_REGISTER_SUCCESS = "AUTH_REGISTER_SUCCESS"
export const AUTH_ERROR = "AUTH_ERROR"
export const AUTH_LOGOUT = "AUTH_LOGOUT"

const state = {
    token: localStorage.getItem("user-token") || "",
    status: "",
    error: "",
}

const getters = {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
    errors: state => state.error,
}

const actions = {
    [AUTH_LOGIN_REQUEST]: ({ commit }, user) => {
        commit(AUTH_LOGIN_REQUEST)
        return axios.post(process.env.VUE_APP_ROOT_API + "user/login", user).then(resp => {
            console.log(resp)
            localStorage.setItem("user-token", resp.data.token)
            axios.defaults.headers.common['Authorization'] = resp.data.token
            commit(AUTH_LOGIN_SUCCESS, resp.data.token)
            //dispatch(USER_REQUEST)
        })
            .catch(err => {
                console.log(err.response)
                commit(AUTH_ERROR, err.response)
                localStorage.removeItem("user-token")
            })
    },
    [AUTH_REGISTER_REQUEST]: ({ commit }, user) => {
        commit(AUTH_REGISTER_REQUEST)
        return axios.post(process.env.VUE_APP_ROOT_API + "user/register", user).then(resp => {
            console.log(resp)
            commit(AUTH_REGISTER_SUCCESS)
            //dispatch(USER_REQUEST)
        })
            .catch(err => {
                console.log(err.response)
                commit(AUTH_ERROR, err.response)
            })
    },
    [AUTH_LOGOUT]: ({ commit }) => {
        commit(AUTH_LOGOUT)
        localStorage.removeItem("user-token")
        axios.defaults.headers.common['Authorization'] = ""
    }
}

const mutations = {
    [AUTH_LOGIN_REQUEST]: state => {
        state.status = "loading"
    },
    [AUTH_LOGIN_SUCCESS]: (state, token) => {
        state.status = "success"
        state.token = token
    },
    [AUTH_REGISTER_REQUEST]: state => {
        state.status = "loading"
    },
    [AUTH_REGISTER_SUCCESS]: state => {
        state.status = "success"
    },
    [AUTH_ERROR]: (state, err) => {
        state.status = "error"
        state.error = err.data
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