import {mapGetters} from "vuex";
import { VRM_PRODUCT } from '/@src/models/constants'

export default {
    computed: {
        ...mapGetters([
            "product",
            "workspace"
        ]),
    },
    methods: {
        getAssetViewURL(item) {
            if (this.product === VRM_PRODUCT) {
                return {
                    name: this.$route.name.startsWith('VrmManage') ? 'VrmManageAssetView' : 'VRMAssetView',
                    params: { asset: item.id },
                }
            }
            return {
                name: 'ProjectAssetView',
                params: { id: item.project_id, asset: item.id },
            }
        },
        getCollectionViewURL(item) {
            if (this.product === VRM_PRODUCT) {
                return {
                    name: 'VendorView',
                    params: { asset: item.id },
                }
            }
            return {
                name: 'ProjectCollectionView',
                params: { id: item.project_id, collection: item.id },
            }
        },
        getIssueIndexURL(item, query = {}) {
            if (this.product === VRM_PRODUCT) {
                return {
                    name: 'VRMIssues',
                    params: { id: this.$store.getters.workspace.id },
                    query: query,
                }
            }

            if (!item) {
                return {
                    name: 'WorkspaceIssuesView',
                    params: { id: this.$store.getters.workspace.id },
                    query: query,
                }
            }

            return {
                name: 'ProjectIssuesView',
                params: { id: item.project_id },
                query: query,
            }
        },
        getLeaksIndex(item, query = {}) {
            if (!item) {
                return {
                    name: 'WorkspaceCyberExEmailLeaksView',
                    params: { id: this.$store.getters.workspace.id },
                    query: query,
                }
            }

            return {
                name: 'CyberExEmailLeaksView',
                params: { id: item.project_id },
                query: query,
            }
        },
        getIssueURL(item) {
            if (this.product === VRM_PRODUCT) {
                return {
                    name: this.$route.name.startsWith('VrmManage') ? 'VrmManageIssuesView' : 'VRMIssueView',
                    params: { id: this.$store.getters.workspace.id, issue: item.id },
                }
            }
            return {
                name: 'ProjectIssueView',
                params: { id: item.project_id, issue: item.id },
            }
        },
    }
};