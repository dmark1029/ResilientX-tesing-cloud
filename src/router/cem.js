import {user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense} from "./middlewares";

export default [
  {
    path: "/cem",
    // component: { template: '<router-view :key="$route.fullPath"></router-view>' },
    component: () => import("../views/cem/Index.vue"),
    meta: {
      middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
      canToggle: false,
      layout: 'app',
    },
    children: [
      {
        path: "",
        component: () => import("../views/cem/Index.vue"),
        name: "CEM",
        meta: {
          middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
          canToggle: false,
          layout: 'app',
        }
      },

        // onboarding routes

      {
        name: "Onboarding",
        component: () => import("../views/cem/onboarding/Onboarding.vue"),
        path: "start",
        props: true,
        meta: {
          middlewares: [],
          canToggle: false,
          layout: 'minimal',
        },
        children: [
          {
            props: true,
            path: "",
            component: () => import("../views/cem/onboarding/steps/Project.vue"),
            name: "OnboardingProject",
            meta: {
              middlewares: [user, bookDemo, emailVerified, isCEM, hasHadLicense],
              canToggle: false,
              layout: 'minimal',
            },
          },
          {
            props: true,
            path: "collection",
            component: () => import("../views/cem/onboarding/steps/Collection.vue"),
            name: "OnboardingCollection",
            meta: {
              middlewares: [user, bookDemo, emailVerified, isCEM, hasHadLicense],
              canToggle: false,
              layout: 'minimal',
            },
          },
          {
            props: true,
            path: "asset",
            component: () => import("../views/cem/onboarding/steps/Asset.vue"),
            name: "OnboardingAsset",
            meta: {
              middlewares: [user, bookDemo, emailVerified, isCEM, hasHadLicense],
              canToggle: false,
              layout: 'minimal',
            },
          },
          {
            props: true,
            path: "success",
            component: () => import("../views/cem/onboarding/steps/Success.vue"),
            name: "OnboardingSuccess",
            meta: {
              middlewares: [user, bookDemo, emailVerified, isCEM, hasHadLicense],
              canToggle: false,
              layout: 'minimal',
            },
          },
        ]
      },

      // workspace routes

      {
        path: "workspaces",
        component: { template: '<router-view :key="$route.fullPath"></router-view>' },
        meta: {
          middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
          canToggle: false,
          layout: 'app',
        },
        children: [
          {
            path: "",
            component: () => import("../views/workspaces/WorkspacesIndex.vue"),
            name: "Workspaces",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: false,
              layout: 'app',
            }
          },
          {
            path: ":id",
            component: () => import("../views/workspaces/Workspaces.vue"),
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: false,
              layout: 'app',
            },
            children: [
              {
                path: "",
                component: () => import("../views/workspaces/WorkspacesView.vue"),
                name: "WorkspacesView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: false,
                  layout: 'app',
                },
              },
              {
                path: "assets",
                component: { template: '<router-view :key="$route.fullPath"></router-view>' },
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
                children: [
                  {
                    path: "",
                    component: () => import("../views/cem/assets/Index.vue"),
                    name: "WorkspaceAssetsView",
                    meta: {
                      middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                      canToggle: false,
                      layout: 'app',
                    }
                  }
                ]
              },

              {
                path: "dashboard",
                component: () => import("../views/cem/dashboards/Index.vue"),
                name: "WorkspaceOverview",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: false,
                  layout: 'app',
                },
              },
              {
                path: "dashboard-cloud",
                component: () => import("../views/cem/dashboards/Cloud.vue"),
                name: "WorkspaceOverviewCloud",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },


              {
                path: "report",
                component: () => import("../views/cem/reports/Index.vue"),
                name: "WorkspaceReportsView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },


              {
                path: "groups",
                component: { template: '<router-view :key="$route.fullPath"></router-view>' },
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
                children: [
                  {
                    path: "",
                    component: () => import("../views/cem/collections/Index.vue"),
                    name: "WorkspaceCollectionsView",
                    meta: {
                      middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                      canToggle: false,
                      layout: 'app',
                    }
                  }
                ]
              },
              {
                path: "issues",
                component: { template: '<router-view :key="$route.fullPath"></router-view>' },
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
                children: [
                  {
                    path: "",
                    component: () => import("../views/cem/issues/Index.vue"),
                    name: "WorkspaceIssuesView",
                    meta: {
                      middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                      canToggle: false,
                      layout: 'app',
                    }
                  }
                ]
              },
              {
                path: "scans",
                component: () => import("../views/cem/tasks/Index.vue"),
                name: "WorkspaceTasksView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "events",
                component: () => import("../views/cem/events/Index.vue"),
                name: "WorkspaceEventsView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "ips",
                component: () => import("../views/cem/assets/IndexIPAddress.vue"),
                name: "WorkspaceAssetIPsView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "domains",
                component: () => import("../views/cem/assets/IndexDomain.vue"),
                name: "WorkspaceAssetDomainsView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "subdomains",
                component: () => import("../views/cem/assets/IndexSubdomain.vue"),
                name: "WorkspaceAssetSubdomainsView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },



              {
                path: "alerts",
                component: () => import("../views/cem/Alerts.vue"),
                name: "WorkspaceCyberExAlertsView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "cloud-findings",
                component: () => import("../views/cem/CloudDetails.vue"),
                name: "WorkspaceCyberExCloudDetailsView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "certificates",
                component: () => import("../views/cem/Certificates.vue"),
                name: "WorkspaceCyberExCertificatesView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "credential-leaks",
                component: () => import("../views/cem/EmailLeaks.vue"),
                name: "WorkspaceCyberExEmailLeaksView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "ips",
                component: () => import("../views/cem/IPAddresses.vue"),
                name: "WorkspaceCyberExIPView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "ports",
                component: () => import("../views/cem/Ports.vue"),
                name: "WorkspaceCyberExPortsView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "phishings",
                component: () => import("../views/cem/Phishings.vue"),
                name: "WorkspaceCyberExPhishingsView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "subdomains",
                component: () => import("../views/cem/Subdomains.vue"),
                name: "WorkspaceCyberExSubdomainsView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "technologies",
                component: () => import("../views/cem/Technologies.vue"),
                name: "WorkspaceCyberExTechnologiesView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "typosquatting",
                component: () => import("../views/cem/Typosquattings.vue"),
                name: "WorkspaceCyberExTyposquattingView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "vulnerabilities",
                component: () => import("../views/cem/Vulnerabilities.vue"),
                name: "WorkspaceCyberExVulnerabilitiesView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "sbom",
                component: () => import("../views/cem/SBOM.vue"),
                name: "WorkspaceCyberExSbomView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "locations",
                component: () => import("../views/cem/Locations.vue"),
                name: "WorkspaceCyberExLocationsView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: "risk-configuration",
                component: () => import("../views/cem/RiskConfiguration.vue"),
                name: "WorkspaceCyberExRiskConfigurationView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              }








            ]
          }
        ]
      },

      // project routes

      {
        path: "projects/:id",
        component: () => import("../views/cem/Projects.vue"),
        meta: {
          middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
          canToggle: true,
          layout: 'app',
        },
        children: [
          {
            path: "dashboard",
            component: () => import("../views/cem/dashboards/Index.vue"),
            name: "ProjectOverview",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: false,
              layout: 'app',
            },
          },
          {
            path: "dashboard-cloud",
            component: () => import("../views/cem/dashboards/Cloud.vue"),
            name: "ProjectOverviewCloud",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "assets",
            component: { template: '<router-view :key="$route.fullPath"></router-view>' },
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
            children: [
              {
                path: "",
                component: () => import("../views/cem/assets/Index.vue"),
                name: "ProjectAssetsView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: false,
                  layout: 'app',
                }
              },
              {
                path: ":asset",
                component: () => import("../views/cem/assets/View.vue"),
                name: "ProjectAssetView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              }
            ]
          },
          {
            path: "groups",
            component: { template: '<router-view :key="$route.fullPath"></router-view>' },
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
            children: [
              {
                path: "",
                component: () => import("../views/cem/collections/Index.vue"),
                name: "ProjectCollectionsView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: false,
                  layout: 'app',
                }
              },
              {
                path: ":collection",
                component: () => import("../views/cem/collections/View.vue"),
                name: "ProjectCollectionView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              },
              {
                path: ":collection/report",
                component: () => import("../views/cem/collections/Report.vue"),
                name: "ProjectCollectionReportView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              }
            ]
          },
          {
            path: "integration",
            component: () => import("../views/cem/integrations/Index.vue"),
            name: "ProjectIntegrationsView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "report",
            component: () => import("../views/cem/reports/Index.vue"),
            name: "ProjectReportsView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "issues",
            component: { template: '<router-view :key="$route.fullPath"></router-view>' },
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
            children: [
              {
                path: "",
                component: () => import("../views/cem/issues/Index.vue"),
                name: "ProjectIssuesView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: false,
                  layout: 'app',
                }
              },
              {
                path: ":issue",
                component: () => import("../views/cem/issues/View.vue"),
                name: "ProjectIssueView",
                meta: {
                  middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
                  canToggle: true,
                  layout: 'app',
                },
              }
            ]
          },
          {
            path: "scans",
            component: () => import("../views/cem/tasks/Index.vue"),
            name: "ProjectTasksView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "events",
            component: () => import("../views/cem/events/Index.vue"),
            name: "ProjectEventsView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "ips",
            component: () => import("../views/cem/assets/IndexIPAddress.vue"),
            name: "ProjectAssetIPsView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "domains",
            component: () => import("../views/cem/assets/IndexDomain.vue"),
            name: "ProjectAssetDomainsView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "subdomains",
            component: () => import("../views/cem/assets/IndexSubdomain.vue"),
            name: "ProjectAssetSubdomainsView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },



          {
            path: "alerts",
            component: () => import("../views/cem/Alerts.vue"),
            name: "CyberExAlertsView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "certificates",
            component: () => import("../views/cem/Certificates.vue"),
            name: "CyberExCertificatesView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "credential-leaks",
            component: () => import("../views/cem/EmailLeaks.vue"),
            name: "CyberExEmailLeaksView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "cloud-findings",
            component: () => import("../views/cem/CloudDetails.vue"),
            name: "CyberExCloudDetailsView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "ips",
            component: () => import("../views/cem/IPAddresses.vue"),
            name: "CyberExIPView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "ports",
            component: () => import("../views/cem/Ports.vue"),
            name: "CyberExPortsView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "phishings",
            component: () => import("../views/cem/Phishings.vue"),
            name: "CyberExPhishingsView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "subdomains",
            component: () => import("../views/cem/Subdomains.vue"),
            name: "CyberExSubdomainsView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "technologies",
            component: () => import("../views/cem/Technologies.vue"),
            name: "CyberExTechnologiesView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "typosquatting",
            component: () => import("../views/cem/Typosquattings.vue"),
            name: "CyberExTyposquattingView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "vulnerabilities",
            component: () => import("../views/cem/Vulnerabilities.vue"),
            name: "CyberExVulnerabilitiesView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "sbom",
            component: () => import("../views/cem/SBOM.vue"),
            name: "CyberExSbomView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          },
          {
            path: "locations",
            component: () => import("../views/cem/Locations.vue"),
            name: "CyberExLocationsView",
            meta: {
              middlewares: [user, emailVerified, bookDemo, hasProject, isCEM, hasHadLicense],
              canToggle: true,
              layout: 'app',
            },
          }
        ]
      },
    ]
  },
];
