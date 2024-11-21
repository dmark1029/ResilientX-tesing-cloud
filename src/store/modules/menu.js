export default {
  state: {
    isOpened: false,
    openedSide: "",
  },
  mutations: {
    setIsOpened(state, token) {
      state.isOpened = token;
    },
    setOpenedSide(state, data) {
      state.openedSide = data;
    },
  },
  actions: {
    addOpenedSide({ commit }, data) {
      commit("setOpenedSide", data);
    },
    openMenu({ commit }) {
      document.body.classList.remove("enlarge-menu", 'enlarge-menu-all');
      localStorage.setItem("menu", "true");
      commit("setIsOpened", true);
    },
    closeMenu({ commit }) {
      if (window.screen.width < 1025) { // mobile
        document.body.classList.add("enlarge-menu", 'enlarge-menu-all');
      } else {
        document.body.classList.add("enlarge-menu");
      }
      localStorage.removeItem("menu");
      commit("setIsOpened", false);
    },
  },
  getters: {
    openedSide(state) {
      return state.openedSide;
    },
    isOpened(state) {
      return state.isOpened;
    },
  },
};
