import axios from "axios"
import {AUTH_LOGOUT} from "./auth"

export const USER_REQUEST = "USER_REQUEST"
export const USER_SUCCESS = "USER_SUCCESS"
export const USER_ERROR = "USER_ERROR"

const state = { status: "", profile: {} }

const getters = {
    getProfile: state => state.profile,
    isProfileLoaded: state => !!state.profile.name
}

const actions = {
    [USER_REQUEST]: ({ commit, dispatch }) => {
        commit(USER_REQUEST)
        axios.get("/api/user/myself")
            .then(resp => {
                console.log(resp)
                commit(USER_SUCCESS, resp)
            })
            .catch(() => {
                commit(USER_ERROR)
                // if resp is unauthorized, logout, to
                dispatch(AUTH_LOGOUT)
            })
    },
}

const mutations = {
    [USER_REQUEST]: state => {
        state.status = "loading"
    },
    [USER_SUCCESS]: (state, resp) => {
        state.status = "success"
        state.profile =  resp
    },
    [USER_ERROR]: state => {
        state.status = "error"
    },
    [AUTH_LOGOUT]: state => {
        state.profile = {}
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}