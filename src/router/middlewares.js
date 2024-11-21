import store from "../store";
import {UEM_PRODUCT} from "../models/constants";

export const guest = (next, user) => {
  if (user) {
    next({ name: "Home" });
  }
};

export const user = (next, user) => {
  if (!user) {
    store.dispatch("addRedirectUrl", window.location.href);

    next({ name: "Login" });
  }
};

export const bookDemo = (next, user) => {
  if (store?.getters?.general?.settings?.domain === 'default' && user.type === 'user' && user.need_demo) {
    if (!store.getters.manageableVendors.length) {
      next({ name: "BookDemo" });
    }
  }
};

export const emailVerified = (next, user) => {
  if (!user.email_verified_at) {
    next({ name: "EmailVerifyNeeded" });
  }
};

export const hasProject = (next, user) => {
  if (!store?.getters.workspace && user.type === 'user') {
    next({ name: "NoProject" });
  }

  if (store?.getters.workspace && !store?.getters.latestProjects.length && user.type === 'user') {
    if (!store.getters.manageableVendors.length) {
      if (store.getters.product === UEM_PRODUCT) {
        next({ name: "OnboardingProject" });
      }
    }
  }
};

export const hasHadLicense = (next, user) => {
  if (user.type !== 'LicenseManager') {
    if (!store.getters.workspace?.licenses_count) {
      store.dispatch("addAlert", {text: 'No license found.', type: 'danger'});

      next({ name: "Home" });
    }
  }
};

export const isVRM = (next) => {
  if (!store?.getters.project?.id) {
    return true;
  }
  if (store?.getters.workspace?.id !== store?.getters.project?.id) {
    store.dispatch("addAlert", {text: 'Selected project is not VRM compatible', type: 'danger'});

    next({ name: "Home" });
  }
};

export const isCEM = (next, user) => {
  if (user.type !== 'LicenseManager') {
    if (store?.getters.workspace?.id === store?.getters.project?.id) {
      store.dispatch("addAlert", {text: 'Selected project is not CEM compatible', type: 'danger'});

      next({ name: "Home" });
    }
  }
};
