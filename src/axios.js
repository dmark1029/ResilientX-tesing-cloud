import axiosService from "axios";
import store from "./store/index";
import router from "./router";

const instance = axiosService.create({
  baseURL: import.meta.env.VITE_API_HOST,
  timeout: 25000,
  headers: {},
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
        store.dispatch("removeAccessToken");
        router.push({ name: "Login" });
    }

      if (error.response.status === 403) {
          store.dispatch("addAlert", {text: 'Unauthorized action based on privileges.', type: 'danger'});

          router.push({ name: "Home" });
      }

      if (error.response.status === 429) {
          const seconds = error.response.headers.get('Retry-After');
          if (seconds) {
              store.dispatch("addAlert", {text: 'You have reached request rate limit. Please try again after: '+seconds+' seconds.', type: 'danger'});
          } else {
              store.dispatch("addAlert", {text: 'You have reached request rate limit.', type: 'danger'});
          }
      }

    if (error.response.status === 404) {
      router.push({ name: "NotFound" });
    }

    return Promise.reject(error);
  },
  { synchronous: true }
);

instance.interceptors.request.use(
  (config) => {

      let token = localStorage.getItem("accessToken");

      config.headers["X-Locale"] = localStorage.getItem("locale") ?? 'en';

      if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
  },
  null,
  { synchronous: true }
);

export const axios = instance;

export const axiosOriginal = axiosService;
