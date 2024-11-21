import {mapGetters} from "vuex";

export default {
    computed: {
        ...mapGetters([
            "user",
            "manageableVendors"
            // "workspace", not used as it is overwritten if mixin is used in a component that has prop workspace
        ]),
        canPerformAction() {
            return (slug, action, workspace = null) => {

                if (!this.user) {
                    return false;
                }

                if (this.user.type === 'LicenseManager') {
                    return true;
                }

                let item;
                if (workspace) {
                    item = workspace;
                } else {
                    item = this.$store.getters.workspace;
                }

                if (!item) {
                    return false;
                }

                if (!item.role) {
                    return false;
                }

                const permissions = item.role.permissions;
                const permission = permissions.find(p => p.slug === slug);

                if (permission && permission.permissions[action]) {
                    return permission.permissions[action].value;
                }

                return false;
            };
        },
    },
    methods: {
        canViewProject(project) {
            if (this.user.type === 'LicenseManager') {
                return true
            }

            if (project.workspace.owner) {
                return true
            }

            if (project.users.length) {
                if (project.users.filter((e) => e.id === this.user.id).length === 0) {
                    return false
                }
            }

            return true
        },
        licenseCanCreateProject(workspace) {
            let item;
            if (workspace) {
                item = workspace;
            } else {
                item = this.workspace;
            }

            if (!item.activeLicense) {
                return false;
            }

            if (
                item.projects_count >= item.activeLicense.project_limit &&
                item.activeLicense.project_limit
            ) {
                return false
            }

            return true;
        },
        licenseCanCreateVendor(workspace) {
            let item;
            if (workspace) {
                item = workspace;
            } else {
                item = this.workspace;
            }

            if (!item.activeLicense) {
                return false;
            }

            if (
                item.vendors_count >= item.activeLicense.vendor_limit &&
                item.activeLicense.vendor_limit
            ) {
                return false
            }

            return true;
        },
        licenseCanCreateScan(workspace, module) {
            let item;
            if (workspace) {
                item = workspace;
            } else {
                item = this.workspace;
            }

            if (!item.activeLicense) {
                return false;
            }

            const moduleLicense = item.activeLicense.licenseModules.find(m => m.module_id === module.id);

            if (!moduleLicense) {
                return false;
            }

            if (
                moduleLicense.scan_used >=
                moduleLicense.scan_limit &&
                moduleLicense.scan_limit
            ) {
                return false
            }

            return true;
        },
        licenseCanCreateAsset(workspace) {
            let item;
            if (workspace) {
                item = workspace;
            } else {
                item = this.workspace;
            }

            if (!item.activeLicense) {
                return false;
            }

            if (
                item.assets_count >= item.activeLicense.asset_limit &&
                item.activeLicense.asset_limit
            ) {
                return false
            }

            return true;
        },
        licenseCanCreateUser(workspace) {
            let item;
            if (workspace) {
                item = workspace;
            } else {
                item = this.workspace;
            }

            if (!item.activeLicense) {
                return false;
            }

            if (
                item.users_count >= item.activeLicense.user_limit &&
                item.activeLicense.user_limit
            ) {
                return false
            }

            return true;
        },
        hasUEM(workspace) {
            let item;
            if (workspace) {
                item = workspace;
            } else {
                item = this.workspace;
            }

            if (!item.activeLicense) {
                return false;
            }

            const module = item.activeLicense.modules.find(m => m.slug !== 'vrm');

            if (!module) {
                return false;
            }

            return true;
        },
        hasTPRM(workspace) {
            let item;
            if (workspace) {
                item = workspace;
            } else {
                item = this.workspace;
            }

            if (!item.activeLicense) {
                return false;
            }

            const module = item.activeLicense.modules.find(m => m.slug === 'vrm');

            if (!module) {
                return false;
            }

            return true;
        },
        hasLicense(workspace) {
            let item;
            if (workspace) {
                item = workspace;
            } else {
                item = this.workspace;
            }

            if (!item.activeLicense) {
                return false;
            }

            return true;
        },
        isVendor(companies) {
            if (!this.companies || !this.companies.length) {
                return false;
            }

            if (!this.manageableVendors.length) {
                return false;
            }

            const isVendor = this.manageableVendors.some(vendor => companies.some(company => company.id === vendor.vendor_id));

            return isVendor;
        },
    }
};