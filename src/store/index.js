import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import goods from './modules/goods';
import decorate from './modules/decorate';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    goods,
    decorate,
    user
  },
  getters
});

export default store;
