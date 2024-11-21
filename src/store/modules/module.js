export default {
  state: {
    modules: {},
    product: ''
  },
  mutations: {
    setProduct(state, data) {
      state.product = data;
      localStorage.setItem("product", data);
    },
  },
  actions: {
    addProduct({ commit }, data) {
      commit("setProduct", data)
    }
  },
  getters: {
    modules(state) {
      return state.modules;
    },
    product(state) {
      return state.product
    }
  },
};
