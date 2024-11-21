import { createRouter, createWebHistory } from "vue-router";
import { guest, user, emailVerified, bookDemo, hasProject } from "./middlewares";
import workspaces from "./workspaces";
import slugify from "slugify";
import store from "../store";
import vrm from "./vrm";
import cem from "./cem";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...workspaces,
    ...vrm,
    ...cem,
    {
      name: "Home",
      component: () => import("../views/HomeView.vue"),
      path: "/",
      meta: {
        middlewares: [user, emailVerified, bookDemo, hasProject],
        canToggle: false,
        layout: 'app',
      },
    },
    {
      name: "Manage",
      component: () => import("../views/manage/ManageIndex.vue"),
      path: "/manage",
      meta: {
        middlewares: [user, emailVerified, bookDemo, hasProject],
        canToggle: false,
        layout: 'app',
      },
    },
    {
      name: "Profile",
      component: () => import("../views/ProfileView.vue"),
      path: "/profile",
      meta: {
        middlewares: [user], // hasProject removed
        canToggle: false,
        layout: 'app',
      },
      props: (route) => ({ view: route.query.view })
    },
    {
      path: "/login",
      component: () => import("../views/auth/LoginView.vue"),
      name: "Login",
      meta: {
        middlewares: [guest],
        canToggle: false,
        layout: 'auth',
      },
    },
    {
      path: "/login/google/callback",
      component: () => import("../views/auth/SocialLoginGoogleView.vue"),
      name: "LoginGoogleCallback",
      meta: {
        middlewares: [guest],
        canToggle: false,
        layout: 'auth',
      },
    },
    {
      path: "/login/microsoft/callback",
      component: () => import("../views/auth/SocialLoginMicrosoftView.vue"),
      name: "LoginMicrosoftCallback",
      meta: {
        middlewares: [guest],
        canToggle: false,
        layout: 'auth',
      },
    },
    {
      path: "/login/auto/:token",
      component: () => import("../views/auth/LoginAuto.vue"),
      name: "LoginAuto",
      meta: {
        middlewares: [],
        canToggle: false,
        layout: 'auth',
      },
    },
    {
      path: "/reset-password",
      component: () => import("../views/auth/ResetPasswordView.vue"),
      name: "Forgot",
      meta: {
        middlewares: [guest],
        canToggle: false,
        layout: 'auth',
      },
    },
    {
      path: "/book-demo",
      component: () => import("../views/BookDemo.vue"),
      name: "BookDemo",
      meta: {
        middlewares: [user],
        canToggle: false,
        layout: 'app',
      },
    },
    {
      path: "/support",
      component: () => import("../views/SupportView.vue"),
      name: "Support",
      meta: {
        middlewares: [user],
        canToggle: false,
        layout: 'app',
      },
    },
    {
      path: "/sales",
      component: () => import("../views/SalesView.vue"),
      name: "Sales",
      meta: {
        middlewares: [user],
        canToggle: false,
        layout: 'app',
      },
    },
    {
      path: "/email-unverified",
      component: () => import("../views/EmailVerifyNeeded.vue"),
      name: "EmailVerifyNeeded",
      meta: {
        middlewares: [user],
        canToggle: false,
        layout: 'auth',
      },
    },
    {
      path: "/reset-password/:token",
      component: () => import("../views/auth/ResetPasswordLinkView.vue"),
      name: "Reset",
      meta: {
        middlewares: [guest],
        canToggle: false,
        layout: 'auth',
      },
    },
    {
      path: "/verify/:id/:hash",
      component: () => import("../views/auth/VerifyEmailView.vue"),
      name: "Verify",
      meta: {
        middlewares: [],
        canToggle: false,
        layout: 'auth',
      },
    },
    {
      path: "/invite/:id/:hash",
      component: () => import("../views/auth/InviteView.vue"),
      name: "Invite",
      meta: {
        middlewares: [],
        canToggle: false,
        layout: 'auth',
      },
    },
    {
      path: "/vrm/invite/:id/:hash",
      component: () => import("../views/auth/InviteVRMView.vue"),
      name: "InviteVRM",
      meta: {
        middlewares: [],
        canToggle: false,
        layout: 'auth',
      },
    },
    {
      path: "/registration/:hash",
      component: () => import("../views/auth/RegistrationView.vue"),
      name: "RegistrationHash",
      meta: {
        middlewares: [],
        canToggle: false,
        layout: 'auth',
      },
    },
    {
      path: "/register",
      component: () => import("../views/auth/RegistrationView.vue"),
      name: "Register",
      meta: {
        middlewares: [],
        canToggle: false,
        layout: 'auth',
      },
    },
    {
      name: "NoProject",
      component: () => import("../views/auth/NoProjectView.vue"),
      path: "/profile-unverified",
      meta: {
        middlewares: [],
        canToggle: false,
        layout: 'auth',
      }
    },
    {
      name: "NotFound",
      component: () => import("../views/NotFound.vue"),
      path: "/not-found",
      meta: {
        middlewares: [],
        canToggle: false,
        layout: 'notfound',
      }
    },
    {
      name: "Error",
      component: () => import("../views/Error.vue"),
      path: "/error",
      meta: {
        middlewares: [],
        canToggle: false,
        layout: 'notfound',
      }
    },
    {
      name: "Maintenance",
      component: () => import("../views/Maintenance.vue"),
      path: "/maintenance",
      meta: {
        middlewares: [],
        canToggle: false,
        layout: 'notfound',
      }
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: {
        name: "NotFound",
      },
      meta: {
        middlewares: [],
        canToggle: false,
        layout: 'notfound',
      }
    },
  ],
});

const setUser = () => {
  return new Promise(async (resolve) => {
    const userLoaded = store.getters.userLoaded;
    const token = localStorage.getItem("accessToken");

    if (!userLoaded && token) {
      await store.dispatch("addAccessToken", token);
      resolve();
    } else {
      store.commit("userLoaded");
      resolve();
    }
  });
};

router.beforeEach(async (to, from, next) => {

  await setUser();

  const middlewares = to.meta.middlewares ?? [];
  const user = store.getters.user;

  middlewares.forEach((callback) => {
    callback(next, user);
  });

  document.body.className = slugify(to.name.replace(/([a-z])([A-Z])/g, '$1-$2'), {lower: true, replacement: '-'});

  next();
});

export default router;
