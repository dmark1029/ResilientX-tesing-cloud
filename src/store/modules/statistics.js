import {axios} from "../../axios";

export default {
  state: {
    statistics: {},
  },
  mutations: {
    setStatistics(state, data) {
      state.statistics = data;
    },
  },
  actions: {
    async addStatistics(context, payload) {
      if (
          context.state.statistics?.type === payload.type && context.state.statistics?.type &&
          context.state.statistics?.year === payload.year && context.state.statistics?.year
      ) {
        return Promise.resolve();
      }
      await axios.get("/overview/statistics/?type=" + payload.type + "&year="+payload.year).then(res => {
        context.commit("setStatistics", res.data);
      })
    },
  },
  getters: {
    statistics(state) {
      return state.statistics;
    },
  },
};
