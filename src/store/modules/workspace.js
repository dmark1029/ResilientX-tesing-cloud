export default {
  state: {
    workspaces: {},
    registrationLinks: {},
    workspace: null,
    activeWorkspace: null,
    workspaceProjects: {},
    workspaceUsers: {},
    workspaceInvites: {},
    workspaceLicenses: {},
  },
  mutations: {
    setWorkspaces(state, data) {
      state.workspaces = data;
    },
    setRegistrationLinks(state, data) {
      state.registrationLinks = data;
    },
    setWorkspace(state, data) {
      state.workspace = data;
    },
    setWorkspaceProjects(state, data) {
      state.workspaceProjects = data;
    },
    setWorkspaceUsers(state, data) {
      state.workspaceUsers = data;
    },
    setWorkspaceInvites(state, data) {
      state.workspaceInvites = data;
    },
    setWorkspaceLicenses(state, data) {
      state.workspaceLicenses = data;
    },
  },
  actions: {
    addWorkspaces({ commit }, data) {
      commit("setWorkspaces", data);
    },
    addRegistrationLinks({ commit }, data) {
      commit("setRegistrationLinks", data);
    },
    addWorkspace(context, data) {
      context.commit("setWorkspace", data);
    },
    addWorkspaceProjects({ commit }, data) {
      commit("setWorkspaceProjects", data);
    },
    addWorkspaceUsers({ commit }, data) {
      commit("setWorkspaceUsers", data);
    },
    addWorkspaceInvites({ commit }, data) {
      commit("setWorkspaceInvites", data);
    },
    addWorkspaceLicenses({ commit }, data) {
      commit("setWorkspaceLicenses", data);
    },
  },
  getters: {
    workspaces(state) {
      return state.workspaces;
    },
    registrationLinks(state) {
      return state.registrationLinks;
    },
    workspace(state) {
      return state.workspace;
    },
    workspaceProjects(state) {
      return state.workspaceProjects;
    },
    workspaceUsers(state) {
      return state.workspaceUsers;
    },
    workspaceInvites(state) {
      return state.workspaceInvites;
    },
    workspaceLicenses(state) {
      return state.workspaceLicenses;
    },
  },
};
