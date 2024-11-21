export default {
  state: {
    events: {},
  },
  mutations: {
    setEvents(state, data) {
      state.events = data;
    },
  },
  actions: {
    addEvents({ commit }, data) {
      commit("setEvents", data);
    }
  },
  getters: {
    events(state) {
      return state.events;
    },
  },
};
