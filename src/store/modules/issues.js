export default {
  state: {
    issues: {},
    issue: null,
  },
  mutations: {
    setIssues(state, data) {
      state.issues = data;
    },
    setIssue(state, data) {
      state.issue = data;
    },
  },
  actions: {
    addIssues({ commit }, data) {
      commit("setIssues", data);
    },
    addIssue({ commit }, data) {
      commit("setIssue", data);
    }
  },
  getters: {
    issues(state) {
      return state.issues;
    },
    issue(state) {
      return state.issue;
    },
  },
};
