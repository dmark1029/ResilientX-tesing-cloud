import { createApp } from "vue/dist/vue.esm-bundler";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
import i18n from "./i18n";
import VueDOMPurifyHTML from 'vue-dompurify-html';
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { createMetaManager } from "vue-meta";
const metaManager = createMetaManager();
import { plugin as vueMetaPlugin } from 'vue-meta'
import './styles'

const app = createApp(App);
const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
    theme: {
        defaultTheme: 'dark'
    }
})

app.use(router);
app.use(store);
app.use(metaManager);
app.use(ContextMenu);
app.use(vueMetaPlugin)
app.use(i18n)
app.use(VueDOMPurifyHTML);
app.use(vuetify)

app.directive('preload-link', vPreloadLink)
app.directive('tooltip', vTooltip)
app.directive('background', vBackground)
app.directive('table-click', vTableClick)

if (import.meta.env.VITE_ENV !== "development") {
    Sentry.init({
        app,
        environment: import.meta.env.VITE_ENV,
        release: __APP_VERSION__+'-'+import.meta.env.VITE_ENV,
        dsn: "https://9a395e981ed248fc9f78a0533c21a5e0@o4504860682158080.ingest.us.sentry.io/4504861313138688",
        integrations: [
            new BrowserTracing({
                routingInstrumentation: Sentry.vueRouterInstrumentation(router),
                tracePropagationTargets: ["localhost", "staging.resilientx.cloud", "testing.resilientx.cloud", "resilientx.cloud", /^\//],
            }),
        ],
        tracesSampleRate: import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? 0.2,
    });
}

app.mount("#app");

import {vPreloadLink} from "./directives/preload-link";
import {vTooltip} from "./directives/tooltip";
import {vBackground} from "./directives/background";
import {vTableClick} from "./directives/table-click";
