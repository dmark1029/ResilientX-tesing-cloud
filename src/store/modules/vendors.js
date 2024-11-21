export default {
  state: {
    manageableVendors: {},
    vendorContacts: {},
    questionnaires: {},
    questionnaireAnswers: {},
    vendors: {},
    vendor: null,
  },
  mutations: {
    setManageableVendors(state, data) {
      state.manageableVendors = data;
    },
    setVendorContacts(state, data) {
      state.vendorContacts = data;
    },
    setVendors(state, data) {
      state.vendors = data;
    },
    setQuestionnaires(state, data) {
      state.questionnaires = data;
    },
    setQuestionnaireAnswers(state, data) {
      state.questionnaireAnswers = data;
    },
    setVendor(state, data) {
      state.vendor = data;
    },
  },
  actions: {
    addManageableVendors({ commit }, data) {
      commit("setManageableVendors", data);
    },
    addVendorContacts({ commit }, data) {
      commit("setVendorContacts", data);
    },
    addVendors({ commit }, data) {
      commit("setVendors", data);
    },
    addQuestionnaires({ commit }, data) {
      commit("setQuestionnaires", data);
    },
    addQuestionnaireAnswers({ commit }, data) {
      commit("setQuestionnaireAnswers", data);
    },
    addVendor({ commit }, data) {
      commit("setVendor", data);
    }
  },
  getters: {
    manageableVendors(state) {
      return state.manageableVendors;
    },
    vendorContacts(state) {
      return state.vendorContacts;
    },
    questionnaires(state) {
      return state.questionnaires;
    },
    questionnaireAnswers(state) {
      return state.questionnaireAnswers;
    },
    vendors(state) {
      return state.vendors;
    },
    vendor(state) {
      return state.vendor;
    },
  },
};
