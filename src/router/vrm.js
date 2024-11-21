import {user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense} from "./middlewares";

export default [
  {
    path: "/vrm",
    // component: { template: '<router-view :key="$route.fullPath"></router-view>' },
    component: () => import("../views/vrm/Index.vue"),
    meta: {
      middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
      canToggle: false,
      layout: 'app',
    },
    children: [
      {
        path: "",
        component: () => import("../views/vrm/Index.vue"),
        name: "VRM",
        meta: {
          middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
          canToggle: false,
          layout: 'app',
        }
      },

      {
        path: "workspaces",
        component: { template: '<router-view :key="$route.fullPath"></router-view>' },
        meta: {
          middlewares: [user, emailVerified, bookDemo, hasProject, hasHadLicense],
          canToggle: false,
          layout: 'app',
        },
        children: [
          {
            path: "",
            component: () => import("../views/workspaces/WorkspacesIndex.vue"),
            name: "VRMWorkspaces",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, hasHadLicense],
              canToggle: false,
              layout: 'app',
            }
          },
        ]
      },


      {
        path: "manage",
        component: { template: '<router-view :key="$route.fullPath"></router-view>' },
        meta: {
          middlewares: [user, emailVerified, bookDemo, hasProject],
          canToggle: false,
          layout: 'app',
        },
        children: [
          {
            path: "companies",
            component: () => import("../views/vrm/manage/Index.vue"),
            name: "VrmManage",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "companies/:asset",
            component: () => import("../views/vrm/manage/View.vue"),
            name: "VrmManageView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "assets/:asset",
            component: () => import("../views/vrm/manage/AssetView.vue"),
            name: "VrmManageAssetView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "issues/:issue",
            component: () => import("../views/vrm/manage/IssueView.vue"),
            name: "VrmManageIssuesView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "questionnaires",
            component: () => import("../views/vrm/manage/Questionnaires.vue"),
            name: "VrmManageQuestionnaires",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "remediations",
            component: () => import("../views/vrm/manage/RemediationRequests.vue"),
            name: "VrmManageRemediationRequests",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM],
              canToggle: true,
              layout: 'app',
            },
          },
        ]
      },


      {
        path: ":id",
        component: () => import("../views/vrm/Workspace.vue"),
        meta: {
          middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
          canToggle: true,
          layout: 'app',
        },
        children: [
          {
            path: "companies",
            component: { template: '<router-view :key="$route.fullPath"></router-view>' },
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
            children: [
              {
                path: "",
                component: () => import("../views/vrm/vendors/Index.vue"),
                name: "VendorsView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
                  canToggle: false,
                  layout: 'app',
                }
              }
            ]
          },
          {
            path: "",
            component: () => import("../views/vrm/dashboard/Index.vue"),
            name: "VendorOverview",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: false,
              layout: 'app',
            },
          },
          {
            path: "events",
            component: () => import("../views/vrm/events/Index.vue"),
            name: "VRMEvents",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "supply-chain",
            component: () => import("../views/vrm/SupplyChain.vue"),
            name: "VRMSupplyChain",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "reports",
            component: () => import("../views/vrm/reports/Index.vue"),
            name: "VRMReports",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "technologies",
            component: () => import("../views/vrm/Technologies.vue"),
            name: "VRMTechnologies",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "sbom",
            component: () => import("../views/vrm/SBOM.vue"),
            name: "VRMSbom",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "vulnerabilities",
            component: () => import("../views/vrm/Vulnerabilities.vue"),
            name: "VRMVulnerabilities",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "typosquatting",
            component: () => import("../views/vrm/Typosquatting.vue"),
            name: "VRMTyposquatting",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "credential-leaks",
            component: () => import("../views/vrm/EmailLeaks.vue"),
            name: "VRMEmailLeaksView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "contacts",
            component: () => import("../views/vrm/contacts/Index.vue"),
            name: "VendorsContacts",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "questionnaires",
            component: { template: '<router-view :key="$route.fullPath"></router-view>' },
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
            children: [
              {
                path: "",
                component: () => import("../views/vrm/questionnaires/Index.vue"),
                name: "VendorsQuestionnaires",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
                  canToggle: false,
                  layout: 'app',
                }
              },
              {
                path: "create",
                component: () => import("../views/vrm/questionnaires/Create.vue"),
                name: "VendorsQuestionnairesCreate",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "templates",
                component: () => import("../views/vrm/questionnaires/Templates.vue"),
                name: "VendorsQuestionnairesTemplates",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "answers",
                component: () => import("../views/vrm/questionnaires/Answers.vue"),
                name: "VendorsQuestionnairesAnswers",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "configuration",
                component: () => import("../views/vrm/questionnaires/RiskConfiguration.vue"),
                name: "VendorsQuestionnairesRiskConfiguration",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: ":questionnaire/edit",
                component: () => import("../views/vrm/questionnaires/Edit.vue"),
                name: "VendorsQuestionnairesEdit",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              }
            ]
          },
          {
            path: "invites",
            component: () => import("../views/vrm/invites/Index.vue"),
            name: "VendorsInvites",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "workflows",
            component: () => import("../views/vrm/workflows/Index.vue"),
            name: "VendorsWorkflows",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "remediations",
            component: () => import("../views/vrm/RemediationRequests.vue"),
            name: "VrmRemediationRequests",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "risk-matrix",
            component: () => import("../views/vrm/RiskMatrix.vue"),
            name: "VrmRiskMatrix",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
        ]
      },

      {
        path: "assets",
        component: { template: '<router-view :key="$route.fullPath"></router-view>' },
        meta: {
          middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
          canToggle: true,
          layout: 'app',
        },
        children: [
          {
            path: "",
            component: () => import("../views/vrm/assets/Index.vue"),
            name: "VRMAssets",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: false,
              layout: 'app',
            }
          },
          {
            path: ":asset",
            component: () => import("../views/vrm/assets/View.vue"),
            name: "VRMAssetView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          }
        ]
      },

      {
        path: "issues",
        component: { template: '<router-view :key="$route.fullPath"></router-view>' },
        meta: {
          middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
          canToggle: true,
          layout: 'app',
        },
        children: [
          {
            path: "",
            component: () => import("../views/vrm/issues/Index.vue"),
            name: "VRMIssues",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: false,
              layout: 'app',
            }
          },
          {
            path: ":issue",
            component: () => import("../views/vrm/issues/View.vue"),
            name: "VRMIssueView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          }
        ]
      },

      {
        path: "companies",
        component: { template: '<router-view :key="$route.fullPath"></router-view>' },
        meta: {
          middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
          canToggle: true,
          layout: 'app',
        },
        children: [
          {
            path: ":asset",
            component: () => import("../views/vrm/vendors/View.vue"),
            name: "VendorView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isVRM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          }
        ]
      },
    ]
  },

  // public

  {
    path: "/vrm-questionnaire/:hash",
    component: () => import("../views/vrm/questionnaires/answer.vue"),
    name: "VRMQuestionnaireAnswer",
    meta: {
      middlewares: [],
      canToggle: false,
      layout: 'auth',
    },
  },
  {
    path: "/vrm-file-request/:hash",
    component: () => import("../views/vrm/SBOMPublicUpload.vue"),
    name: "VRMSbomUpload",
    meta: {
      middlewares: [],
      canToggle: false,
      layout: 'auth',
    },
  },
];
