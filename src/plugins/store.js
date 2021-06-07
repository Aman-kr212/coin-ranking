import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    coins: []
  },

  mutations: {
    SET_COINS_DATA(state, coins) {
      state.coins = coins;
    }
  }
});