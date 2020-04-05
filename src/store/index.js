import Vue from 'vue'
import Vuex from 'vuex'
import book from './book'
import getters from './getters'
import actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        book
    },
    getters,
    actions
})

export default store
