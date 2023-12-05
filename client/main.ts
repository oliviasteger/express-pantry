import "@/assets/main.css";
import "purecss";
// @ts-ignore
import VueGoogleMaps from "@fawmi/vue-google-maps";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";

import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

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
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#2f01d1ff", // #E53935
          secondary: "#28b7caff", // #FFCDD2
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
