import {user, emailVerified, bookDemo, hasProject, hasHadLicense} from "./middlewares";

export default [
  {
    path: "/workspaces",
    component: { template: '<router-view :key="$route.fullPath"></router-view>' },
    meta: {
      middlewares: [user, emailVerified, bookDemo, hasProject, hasHadLicense],
      canToggle: false,
      layout: 'app',
    },
    children: [
      // {
      //   path: "",
      //   component: () => import("../views/workspaces/WorkspacesIndex.vue"),
      //   name: "Workspaces",
      //   meta: {
      //     middlewares: [user, emailVerified, bookDemo, hasProject],
      //     canToggle: false,
      //     layout: 'app',
      //   }
      // },
      {
        path: ":id",
        component: () => import("../views/workspaces/Workspaces.vue"),
        meta: {
          middlewares: [user, emailVerified, bookDemo, hasProject, hasHadLicense],
          canToggle: false,
          layout: 'app',
        },
        children: [
          // {
          //   path: "",
          //   component: () => import("../views/workspaces/WorkspacesView.vue"),
          //   name: "WorkspacesView",
          //   meta: {
          //     middlewares: [user, emailVerified, bookDemo, hasProject],
          //     canToggle: false,
          //     layout: 'app',
          //   },
          // },
          {
            path: "settings",
            component: () => import("../views/workspaces/WorkspacesSettings.vue"),
            name: "WorkspaceSettingsView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "users",
            component: () => import("../views/workspaces/WorkspacesUsers.vue"),
            name: "WorkspaceUsersView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "license",
            component: () => import("../views/workspaces/WorkspacesLicense.vue"),
            name: "WorkspaceLicensesView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          }
        ]
      }
    ]
  },
];
