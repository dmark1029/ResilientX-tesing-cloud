import { createStore } from "vuex";
import general from "./modules/general";
import events from "./modules/events";
import issues from "./modules/issues";
import license from "./modules/license";
import theme from "./modules/theme";
import menu from "./modules/menu";
import user from "./modules/user";
import workspace from "./modules/workspace";
import project from "./modules/project";
import asset from "./modules/asset";
import statistics from "./modules/statistics";
import module from "./modules/module";
import tasks from "./modules/tasks";
import vendors from "./modules/vendors";

const store = createStore({
  modules: {
    general,
    tasks,
    events,
    issues,
    vendors,
    license,
    module,
    theme,
    menu,
    user,
    workspace,
    project,
    asset,
    statistics
  },
});

export default store;
