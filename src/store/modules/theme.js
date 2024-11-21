export default {
  state: {
    theme: "dark",
  },
  mutations: {
    setTheme(state, theme) {
      state.theme = theme;
    },
  },
  actions: {
    lightTheme({ commit }) {
      localStorage.setItem("theme", "light");
      commit("setTheme", "light");
    },
    darkTheme({ commit }) {
      localStorage.setItem("theme", "dark");
      commit("setTheme", "dark");
    },
  },
  getters: {
    theme(state) {
      return state.theme;
    },
  },
};
