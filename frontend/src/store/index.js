import Vue from 'vue'
import Vuex from 'vuex'
import cookies from 'vue-cookies'
import axios from 'axios'
import BACKEND from '@/api/index'
import router from '@/router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accessToken: cookies.get('accessToken'),
    authCheck: '',
    interviews: [],
    communitys: [],
  },

  getters: {
    isLoggedIn: state => !!state.accessToken,
    config: () => ({ headers: { Authorization: `JWT ${cookies.get('accessToken')}`}}),
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.accessToken = token
      cookies.set('accessToken', token) 
    },

    // 이 부분 나중에 email을 id로 바꿔야 할듯...
    SET_AUTH(state, email) {
      state.authCheck = email
      cookies.set('authCheck', email)
    },
    SET_INTERVIEWS(state, interviews) {
      state.interviews = interviews
    },
    SET_COMMUNITYS(state, communitys) {
      state.communitys = communitys
    },
  },

  actions: {

    // ----- AUTH -----

    // Auth
    getAuth({ commit }, info) {
      axios.post(BACKEND.URL + info.location, info.data)
        .then(res => {
          console.log(res)
          commit('SET_TOKEN', res.data.token)
          commit('SET_AUTH', res.data.user.email)
        })
        .catch(err => {console.log(err)})
    },

    // Signup
    signup({ dispatch }, signupData) {
      const info = {
        data: signupData,
        location: BACKEND.ROUTES.signup
      }
      dispatch('getAuth', info)
    },

    // Login
    login({ dispatch }, loginData){
      const info = {  
        data: loginData,
        location: BACKEND.ROUTES.login
      }       
      dispatch('getAuth', info)
    },

    // Logout
    logout({ commit }) {
      commit('SET_TOKEN', null)
      commit('SET_AUTH', null)
      cookies.remove('accessToken')
      cookies.remove('authCheck')
      router.push({ name: 'Home'})
      router.go()
    },

    // ----- INTERVIEW -----
  
    // Interview List
    getInterviews() {},

    // Interview Create
    createInterview() {},

    // Interview Detail
    getInterview() {},

    // Interview Update
    updateInterview() {},

    // Interview Delete
    deleteInterview() {},

    // ----- COMMUNITY -----

    // Community List
    getCommunitys() {
      axios.get(BACKEND.URL + BACKEND.ROUTES.community)
        .then(res => this.commit('SET_COMMUNITYS', res.data))
        .catch(err => console.log(err))
    },

    // Community Create
    createCommunitys({ getters }, data) {
      axios.post(BACKEND.URL + BACKEND.ROUTES.community, data.communityData, getters.config)
        .then(() => {
          router.push('/community/list')
        })
        .catch(err => console.log(err))
    },

    // Community Detail
    getCommunity({ commit }, data) {
      axios.get(BACKEND.URL + BACKEND.ROUTES.community + `${data.id}`)
        .then(res => commit('SET_COMMUNITYS', res.data))
        .catch(err => console.log(err))
    },

    // Community Update
    updateCommunity({ getters}, data) {
      axios.put(BACKEND.URL + BACKEND.ROUTES.community + `${data.id}`, data.communityData, getters.config)
        .then(() => {
          router.push(`/community/detail/${data.id}`)
        })
        .catch(err => console.log(err))
    },
    
    // Community Delete
    deleteCommunity({ getters }, data) {
      axios.delete(BACKEND.URL + BACKEND.ROUTES.community + `${data.id}`, getters.config)
        .then(() => {
          router.push(`/community/list`)
        })
    },
  },
  modules: {
  }
})