import "@/assets/main.css";
import "@mdi/font/css/materialdesignicons.css";
import "purecss";

// @ts-ignore
import VueGoogleMaps from "@fawmi/vue-google-maps";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { mdi } from "vuetify/iconsets/mdi";

import "vuetify/styles";

import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import { createApp } from "vue";

import App from "./App.vue";
// import DayJsAdapter from "@date-io/dayjs";

// createVuetify({

// }
import router from "./router";
// import { VuetifyDateAdapter } from "vuetify/composables/date/adapters/vuetify";

const app = createApp(App);
const pinia = createPinia();
const API_KEY = import.meta.env.VITE_GOOGLEMAPS_API_KEY;
export const vuetify = createVuetify({
  components,
  directives,
  defaults: {
    VCard: {
      VBtn: { variant: "outlined" },
    },
  },
  date: {},
  icons: {
    defaultSet: "mdi",
    sets: {
      mdi,
    },
  },
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#3066be", // #E53935
          secondary: "#666666", // #FFCDD2
        },
      },
    },
  },
});

pinia.use(piniaPluginPersistedState);

app.use(pinia);
app.use(router);
app.use(VueGoogleMaps, {
  load: {
    key: API_KEY,
    // language: 'de',
  },
});

app.use(vuetify).mount("#app");
