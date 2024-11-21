import {mapGetters} from "vuex";

export default {
    computed: {
        ...mapGetters([
            "workspace",
            "projects",
            "latestProjects"
        ]),
    },
    data() {
        return {
            resolved: [],
        };
    },
    methods: {
        resolveProject(projectId) {
            let project;

            if (this.workspace?.projects) {
                return {
                    id: projectId,
                    name: this.workspace.projects[projectId],
                }
            }

            if (Array.isArray(this.projects)) {
                project = this.projects.find(project => project.id === projectId);
                if (project) return project;
            }

            if (Array.isArray(this.latestProjects)) {
                project = this.latestProjects.find(project => project.id === projectId);
                if (project) return project;
            }

            if (Array.isArray(this.resolved)) {
                project = this.resolved.find(project => project.id === projectId);
                if (project) return project;
            }

            return null
        }
    }
};