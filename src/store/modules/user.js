import {axios} from "../../axios";
import Cookies from "js-cookie";
import { UEM_PRODUCT, VRM_PRODUCT } from '/@src/models/constants'

export default {
  state: {
    accessToken: null,
    user: null,
    userLoaded: false,
    isAuthenticated: false,
  },
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token;
    },
    userLoaded(state) {
      state.userLoaded = true;
    },
    setUser(state, user) {
      state.user = user;
      state.isAuthenticated = true;
    },
  },
  actions: {
    async refreshUser({commit, dispatch}) {
      await axios
          .get("/profile")
          .then(async (res) => {
            const {data} = res.data;
            dispatch("addUser", data);
            await axios
                .get("/project/active")
                .then((res) => {
                  commit("setManageableVendors", res.data.vendors); // vendors that user can manage based on contact
                  const modules = res.data.workspace?.activeLicense?.modules;
                  if (modules) {
                    let defaultProductSet = false;
                    const savedProduct = localStorage.getItem("product");

                    if (savedProduct) {
                      if (savedProduct === VRM_PRODUCT) {
                        if (modules.length !== 0 && modules.some(module => module.slug !== VRM_PRODUCT)) {
                          commit("setProduct", VRM_PRODUCT)
                          defaultProductSet = true;
                        }
                      }
                      if (savedProduct === UEM_PRODUCT) {
                        if (modules.some(module => module.slug === UEM_PRODUCT)) {
                          commit("setProduct", UEM_PRODUCT)
                          defaultProductSet = true;
                        }
                      }
                    }

                    if (!defaultProductSet) {
                      if (modules.length !== 0 && modules.some(module => module.slug !== VRM_PRODUCT)) {
                        commit("setProduct", UEM_PRODUCT)
                      } else if (modules.some(module => module.slug === VRM_PRODUCT)) {
                        commit("setProduct", VRM_PRODUCT)
                      }
                    }
                  } else {
                    if (res.data.vendors.length) {
                      commit("setProduct", VRM_PRODUCT)
                    } else {
                      commit("setProduct", UEM_PRODUCT)
                    }
                  }

                  if (res.data.project) {
                    dispatch("addWorkspace", res.data.project.workspace);
                    if (res.data.module?.slug === VRM_PRODUCT) {
                      commit("setProject", null);
                    }
                    commit("setLatestProjects", res.data.projects);
                    commit("setLatestWorkspaces", res.data.workspaces);
                  } else {
                    // when user has no project
                    dispatch("addWorkspace", res.data.workspace);
                  }
                })
          })
          .catch((e) => {
            console.log(e)
            setTimeout(() => {
              dispatch("removeAccessToken");
              window.location.reload();
            }, 2000);
          })
          .finally(() => {
            commit("userLoaded");
          });
    },
    async addAccessToken({commit, dispatch}, token) {
      localStorage.setItem("accessToken", token);
      commit("setAccessToken", token);

      const parts = token.split("|");

      Cookies.set('docs_site_access_token', btoa(parts[0]), {
        expires: 30,
        secure: !!import.meta.env.VITE_AUTH_TOKEN_SECURE,
        sameSite: 'strict',
        path: '/',
        domain: import.meta.env.VITE_AUTH_TOKEN_DOMAIN
      })

      await dispatch("refreshUser");
    },
    addUser({ commit }, user) {
      commit("setUser", user);
      commit("userLoaded");
    },
    removeAccessToken({ commit }) {
      localStorage.removeItem("accessToken");

      Cookies.remove('docs_site_access_token', {
        path: '/',
        domain: import.meta.env.VITE_AUTH_TOKEN_DOMAIN
      })

      commit("setUser", null);
      this.state.isAuthenticated = false;
      this.state.userLoaded = false;
      commit("setAccessToken", null);
    },
  },
  getters: {
    accessToken(state) {
      return state.accessToken;
    },
    user(state) {
      return state.user;
    },
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
    userLoaded(state) {
      return state.userLoaded;
    },
  },
};
