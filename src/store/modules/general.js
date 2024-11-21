import store from "../index";
import Cookies from "js-cookie";

export default {
  state: {
    redirectUrl: null,
    general: {},
    bodyClass: "",
    loading: false,
    search: '',
    showSearch: false,
    showWizard: false,
    isMobile: false,
    alert: null,
    alertType: null,
    limit: null,
  },
  mutations: {
    setRedirectUrl(state, redirectUrl) {
      state.redirectUrl = redirectUrl;
    },
    setGeneral(state, token) {
      state.general = token;
    },
    setAlert(state, alert) {
      state.alert = alert;
    },
    setAlertType(state, type) {
      state.alertType = type;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setIsMobile(state, mobile) {
      state.isMobile = mobile;
    },
    setBodyClass(state, data) {
      state.bodyClass = data;
    },
    setSearch(state, data) {
      state.search = data;
    },
    setShowSearch(state, data) {
      state.showSearch = data;
    },
    setShowWizard(state, data) {
      state.showWizard = data;
    },
    setLimit(state, data) {
      state.limit = data;
    },
  },
  actions: {
    addGeneral({ commit }, general) {
      commit("setGeneral", general);
    },
    addRedirectUrl({ commit }, url) {
      var inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);

      Cookies.set('redirect_url', url, {
        expires: inFifteenMinutes,
        secure: !!import.meta.env.VITE_AUTH_TOKEN_SECURE,
        sameSite: 'strict',
        path: '/',
        domain: import.meta.env.VITE_AUTH_TOKEN_DOMAIN
      })

      commit("setRedirectUrl", url);
    },
    addAlert({ commit }, alert) {
      commit("setAlert", alert?.text);
      commit("setAlertType", alert?.type);

      setTimeout(() => {
        commit("setAlert", null);
        commit("setAlertType", null);
      }, alert?.type === "danger" ? 15000 : 8000);
    },
    addIsMobile({ commit }, value) {
      commit("setIsMobile", value);
    },
    addBodyClass({ commit }, data) {
      commit("setBodyClass", data);
    },
    addSearch({ commit }, data) {
      commit("setSearch", data);
    },
    addShowSearch({ commit }, data) {
      commit("setShowSearch", data);
    },
    addShowWizard({ commit }, data) {
      commit("setShowWizard", data);
    },
    showLoading({ commit }) {
      commit("setLoading", true);
    },
    hideLoading({ commit }) {
      commit("setLoading", false);
    },
    addLimit({ commit }, data) {
      localStorage.setItem("limit", data);
      commit("setLimit", data);
    },
  },
  getters: {
    redirectUrl(state) {
      return Cookies.get('redirect_url') ?? state.redirectUrl;
    },
    alert(state) {
      return state.alert;
    },
    alertType(state) {
      return state.alertType;
    },
    search(state) {
      return state.search;
    },
    showSearch(state) {
      return state.showSearch;
    },
    showWizard(state) {
      return state.showWizard;
    },
    isMobile(state) {
      return state.isMobile;
    },
    general(state) {
      return state.general;
    },
    bodyClass(state) {
      return state.bodyClass;
    },
    loading(state) {
      return state.loading;
    },
    limit(state) {
      let limit = localStorage.getItem("limit");

      if (!state.limit && limit) {
        if (limit === "15" || limit === "25" || limit === "50" || limit === "100") {
            return limit;
        }
      }

      return state.limit ?? "15";
    },
  },
};
