export default {
  state: {
    assets: {},
    asset: {},
    assetReports: {},
    assetTasks: {},
    assetScheduledTasks: {},
  },
  mutations: {
    setAssets(state, data) {
      state.assets = data;
    },
    setAsset(state, data) {
      state.asset = data;
    },
    setAssetTasks(state, data) {
      state.assetTasks = data;
    },
    setAssetReports(state, data) {
      state.assetReports = data;
    },
    setAssetScheduledTasks(state, data) {
      state.assetScheduledTasks = data;
    },
  },
  actions: {
    addAssets({ commit }, data) {
      commit("setAssets", data);
    },
    addAsset({ commit }, data) {
      commit("setAsset", data);
    },
    addAssetTasks({ commit }, data) {
      commit("setAssetTasks", data);
    },
    addAssetReports({ commit }, data) {
      commit("setAssetReports", data);
    },
    addAssetScheduledTasks({ commit }, data) {
      commit("setAssetScheduledTasks", data);
    },
  },
  getters: {
    assets(state) {
      return state.assets;
    },
    asset(state) {
      return state.asset;
    },
    assetTasks(state) {
      return state.assetTasks;
    },
    assetReports(state) {
      return state.assetReports;
    },
    assetScheduledTasks(state) {
      return state.assetScheduledTasks;
    },
  },
};
