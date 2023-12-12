<!--  Set up express pantry-->
<!-- LUCA pantry should be able to input pickup window length (how lohg of a time they need between pickups), 
and # of orders they can serve in that window (default), 
and drop date (week, day, time), 
available pickup time windows,
rules 
    (#max number of orders per user weekly,
    #snap card check needed,
    #location check needed (same city),
    #annual income 
-->

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { RouterLink } from "vue-router";
import { fetchy } from "../../utils/fetchy";

const city = ref("");
const name = ref("");
const openHours = ref("");
const closeHours = ref("");
const rules = ref({
  annualIncome: "",
  snapRequired: false,
});
const getProfile = async () => {
  try {
    const profile = await fetchy("api/profiles/currentUser", "GET");
    city.value = profile.location;
    name.value = profile.name;
    openHours.value = profile.openHour;
    closeHours.value = profile.closeHour;
    rules.value = profile.rules;
  } catch {
    //not sure
  }
};

onBeforeMount(async () => {
  await getProfile();
});
</script>
<template>
  <v-card class="ma-3">
    <v-card-title>
      {{ name }}
    </v-card-title>
    <v-card-subtitle>
      Located in {{ city }} <br />
      Open from {{ openHours }} to {{ closeHours }}</v-card-subtitle
    >

    <v-card-item>
      <v-list lines="two">
        <v-list-header class="font-weight-medium">Eligibility Requirements:</v-list-header>
        <v-list-item
          :prepend-avatar="'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/1200px-Eo_circle_green_checkmark.svg.png'"
          :title="'Maximum Annual Income'"
          :subtitle="'$' + rules.annualIncome"
        ></v-list-item>
        <v-list-item
          :prepend-avatar="'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Eo_circle_green_checkmark.svg/1200px-Eo_circle_green_checkmark.svg.png'"
          :title="'SNAP Required'"
          :subtitle="rules.snapRequired ? 'Yes' : 'No'"
        ></v-list-item>
      </v-list>
    </v-card-item>

    <v-card-actions>
      <RouterLink :to="{ name: 'Edit Profile' }">
        <v-btn>Edit Profile</v-btn>
      </RouterLink>
    </v-card-actions>
  </v-card>
</template>
