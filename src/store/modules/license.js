import {axios} from "../../axios";

export default {
  state: {
    licenses: {},
    license: null,
  },
  mutations: {
    setLicenses(state, data) {
      state.licenses = data;
    },
    setLicense(state, data) {
      state.license = data;
    },
  },
  actions: {
    addLicenses({ commit }, data) {
      commit("setLicenses", data);
    },
    async addLicense(context, id) {
      if (context.state.license?.id === id) {
        return Promise.resolve();
      }
      await axios.get("/license/" + id).then(res => {
        context.commit("setLicense", res.data.data);
      })
    }
  },
  getters: {
    licenses(state) {
      return state.licenses;
    },
    license(state) {
      return state.license;
    },
  },
};
