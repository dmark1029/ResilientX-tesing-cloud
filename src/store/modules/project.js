import {axios} from "../../axios";

export default {
  state: {
    projects: {},
    selectableProjects: [],
    project: null,
    latestProjects: {},
    latestWorkspaces: {},
    projectAssets: {},
    projectCollections: {},
    projectOverview: {},
    projectIntegrations: {},
  },
  mutations: {
    setProjects(state, data) {
      state.projects = data;
    },
    setSelectableProjects(state, data) {
      state.selectableProjects = data;
    },
    setProject(state, data) {
      state.project = data;
    },
    setLatestProjects(state, data) {
      state.latestProjects = data;
    },
    setLatestWorkspaces(state, data) {
      state.latestWorkspaces = data;
    },
    setProjectAssets(state, data) {
      state.projectAssets = data;
    },
    setProjectCollections(state, data) {
      state.projectCollections = data;
    },
    setProjectOverview(state, data) {
      state.projectOverview = data;
    },
    setProjectIntegrations(state, data) {
      state.projectIntegrations = data;
    },
  },
  actions: {
    addProjects({ commit }, data) {
      commit("setProjects", data);
    },
    addSelectableProjects({ commit }, data) {
      commit("setSelectableProjects", data);
    },
    async addProject(context, id) {
      if (context.state.project?.id === id && context.state.project?.workspace) {
        return Promise.resolve();
      }
      await axios.get("/project/" + id).then(async res => {
        context.commit("setProject", res.data.data);

        await axios
            .get('/workspace/' + res.data.data.workspace.id)
            .then((res) => {
              context.dispatch("addWorkspace", res.data.data);
            })
            .catch(() => {
            })
      })
    },
    async addProjectOverview(context, {projectId, moduleId}) {
      if (context.state.projectOverview?.project === projectId && context.state.projectOverview?.module === moduleId) {
        return Promise.resolve();
      }

      await axios.get(
          "/overview/?project_id=" +
          projectId +
          "&module_id=" +
          moduleId
      ).then(res => {
        let overview = res.data;
        overview.project = projectId;
        overview.module = moduleId;
        context.commit("setProjectOverview", overview);
      })
    },
    addProjectAssets({ commit }, data) {
      commit("setProjectAssets", data);
    },
    addProjectCollections({ commit }, data) {
      commit("setProjectCollections", data);
    },
    addProjectIntegrations({ commit }, data) {
      commit("setProjectIntegrations", data);
    },
  },
  getters: {
    projects(state) {
      return state.projects;
    },
    latestProjects(state) {
      return state.latestProjects;
    },
    latestWorkspaces(state) {
      return state.latestWorkspaces;
    },
    selectableProjects(state) {
      return state.selectableProjects;
    },
    project(state) {
      return state.project;
    },
    projectAssets(state) {
      return state.projectAssets;
    },
    projectCollections(state) {
      return state.projectCollections;
    },
    projectOverview(state) {
      return state.projectOverview;
    },
    projectIntegrations(state) {
      return state.projectIntegrations;
    },
  },
};
