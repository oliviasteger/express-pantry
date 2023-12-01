<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const city = ref("");
const openHours = ref("");
const closeHours = ref("");
const rules = ref("");
const name = ref("");

const loaded = ref(false);

const cities = ref([]);
async function getCities() {
  const response = await fetch("https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/us-cities-demographics/records?group_by=city&limit=3000");
  const data = await response.json();

  cities.value = data.results.map((record: { city: any }) => record.city); // Extracting city names

  return cities;
}

// const getProfile = async () => {
//   try {
//     const profile = await fetchy("api/profiles/currentUser", "GET");
//     city.value = profile.location;
//     name.value = profile.name;
//     openHours.value = profile.openHour;
//     closeHours.value = profile.closeHour;
//     rules.value = profile.rules;
//   } catch {
//     //not sure
//   }
// };
async function updateLocation() {
  try {
    const profile = await fetchy("api/profiles/currentUser", "GET");
    console.log(profile);
    const profileId = profile._id;

    await fetchy("api/profiles/", "PATCH", { body: { update: { location: city.value }, _id: profileId } });
  } catch {
    //welp
  }
}

async function updateName() {
  try {
    const profile = await fetchy("api/profiles/currentUser", "GET");
    console.log(profile);
    const profileId = profile._id;
    await fetchy("api/profiles/", "PATCH", { body: { update: { name: name.value }, _id: profileId } });
  } catch {
    //welp
  }
}

async function updateOpenHour() {
  try {
    const profile = await fetchy("api/profiles/currentUser", "GET");
    console.log(profile);
    const profileId = profile._id;
    await fetchy("api/profiles/", "PATCH", { body: { update: { openHour: openHours.value }, _id: profileId } });
  } catch {
    //welp
  }
}

async function updateCloseHour() {
  try {
    const profile = await fetchy("api/profiles/currentUser", "GET");
    const profileId = profile._id;
    await fetchy("api/profiles/", "PATCH", { body: { update: { closeHour: closeHours.value }, _id: profileId } });
  } catch {
    //welp
  }
}

async function updateRules() {
  try {
    const profile = await fetchy("api/profiles/currentUser", "GET");
    const profileId = profile._id;
    await fetchy("api/profiles/", "PATCH", { body: { update: { rules: rules.value }, _id: profileId } });
  } catch {
    //welp
  }
}

onBeforeMount(async () => {
  await getCities();
  loaded.value = true;
});
</script>

<template>
  <h2>Update User Profile</h2>
  <v-form validate-on="submit lazy" @submit.prevent="updateLocation">
    <div class="pure-control-group">
      <label for="aligned-location">Choose the city You Live In: </label>
      <select v-model="city" id="aligned-location" required>
        <option value="" disabled>Select City</option>
        <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
      </select>
    </div>
    <!-- <v-select v-model="information.city" label="Select City" :placeholder="undefined" :persistent-placeholder="true" :items="cities" return-object></v-select> -->
    <v-btn type="submit" block class="mt-2" text="Change"></v-btn>
  </v-form>

  <v-form validate-on="submit lazy" @submit.prevent="updateName">
    <v-text-field v-model="name" label="name of Pantry" :persistent-placeholder="true"></v-text-field>
    <v-btn type="submit" block class="mt-2" text="Change"></v-btn>
  </v-form>
  <v-form validate-on="submit lazy" @submit.prevent="updateOpenHour">
    <v-text-field v-model="openHours" label="Hour that Pantry Opens" :persistent-placeholder="true"></v-text-field>
    <v-btn type="submit" block class="mt-2" text="Change"></v-btn>
  </v-form>
  <v-form validate-on="submit lazy" @submit.prevent="updateCloseHour">
    <v-text-field v-model="closeHours" label="Hour that Pantry Closes" :persistent-placeholder="true"></v-text-field>
    <v-btn type="submit" block class="mt-2" text="Change"></v-btn>
  </v-form>
  <v-form validate-on="submit lazy" @submit.prevent="updateRules">
    <v-text-field v-model="rules" label="Max Annual Income Requirement" :persistent-placeholder="true"></v-text-field>
    <v-btn type="submit" block class="mt-2" text="Change"></v-btn>
  </v-form>
</template>
