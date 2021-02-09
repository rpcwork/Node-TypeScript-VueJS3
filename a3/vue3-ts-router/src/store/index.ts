import { createStore } from 'vuex'

/**
 * Function: createStore() 
 * 
 * API reference: https://next.vuex.vuejs.org/api/
 * 
 * @param {options}
 *   
 * @returns: json { responsefromapi } or throws error
 * 
 * Creates a new Vuex4 store that we use for local state management
 * 
 */
export default createStore({
  state: {
    pagehits: [] as any,
    totalhits:1,
    apidataloaded:'no'
  },
  mutations: {
    incrementhit (state, pagename) {
      // mutate state
      if(!(pagename in state.pagehits)){
        state.pagehits[pagename] = 1;
      }else{
        state.pagehits[pagename]++;
      }
      state.totalhits++;
    },
    updatehit (state, payload) {
      // mutate state
      state.pagehits[payload.pagename] = payload.hits;
      
      state.totalhits =+ payload.hits;
    },
    markapidataloaded (state) {
      state.apidataloaded = 'yes';
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    getpagehits: state => {
      return state.pagehits;
    },
    gettotalhits: state => {
      return state.totalhits;
    },
    getapidataloaded: state => {
      return state.apidataloaded;
    },

  }
    
})
