<script setup lang="ts">
import router from "@/router";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
const city = ref("");
const openHours = ref("");
const closeHours = ref("");
const rules = ref({
  annualIncome: "",
  snapRequired: false,
});
const name = ref("");

const loaded = ref(false);
const hoursOptions = Array.from({ length: 24 }, (_, index) => String(index));

const cities = ref([]);
async function getCities() {
  const response = await fetch("https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/us-cities-demographics/records?group_by=city&limit=3000");
  const data = await response.json();

  cities.value = data.results.map((record: { city: any }) => record.city); // Extracting city names

  return cities;
}

async function updateLocation() {
  try {
    const profile = await fetchy("api/profiles/currentUser", "GET");
    console.log(profile);
    const profileId = profile._id;

    await fetchy("api/profiles/", "PATCH", { body: { update: { location: city.value }, _id: profileId } });
    await router.push({ name: "Profile" });
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
    await router.push({ name: "Profile" });
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
    await router.push({ name: "Profile" });
  } catch {
    //welp
  }
}

async function updateCloseHour() {
  try {
    const profile = await fetchy("api/profiles/currentUser", "GET");
    const profileId = profile._id;
    await fetchy("api/profiles/", "PATCH", { body: { update: { closeHour: closeHours.value }, _id: profileId } });
    await router.push({ name: "Profile" });
  } catch {
    //welp
  }
}

async function updateRules() {
  try {
    const profile = await fetchy("api/profiles/currentUser", "GET");
    const profileId = profile._id;
    console.log("RULES EDITED", rules.value);
    await fetchy("api/profiles/", "PATCH", { body: { update: { rules: rules.value }, _id: profileId } });
    await router.push({ name: "Profile" });
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
    <v-row class="mx-auto" style="width: 50%">
      <div class="pure-control-group">
        <label for="aligned-location">Choose the city You Live In: </label>
        <select v-model="city" id="aligned-location" required>
          <option value="" disabled>Select City</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
      </div>
      <v-btn type="submit" block class="mt-0 mb-0" text="Change Location"></v-btn>
    </v-row>
  </v-form>
  <br />
  <br />

  <v-form validate-on="submit lazy" @submit.prevent="updateName">
    <v-row class="mx-auto" style="width: 50%">
      <v-text-field v-model="name" label="name of Pantry" :persistent-placeholder="true"></v-text-field>
      <v-btn type="submit" block class="mt-0 mb-0" text="Change Name"></v-btn>
    </v-row>
  </v-form>
  <br /><br />
  <v-form validate-on="submit lazy" @submit.prevent="updateOpenHour">
    <v-row class="mx-auto" style="width: 50%">
      <v-select v-model="openHours" label="Hour that Pantry Opens" :persistent-placeholder="true" :items="hoursOptions"></v-select>
      <v-btn type="submit" block class="mt-0 mb-0" text="Change Open Hour"></v-btn>
    </v-row>
  </v-form>
  <br /><br />
  <v-form validate-on="submit lazy" @submit.prevent="updateCloseHour">
    <v-row class="mx-auto" style="width: 50%">
      <v-select v-model="closeHours" label="Hour that Pantry Closes" :persistent-placeholder="true" :items="hoursOptions"></v-select>

      <v-btn type="submit" block class="mt-0 mb-0" text="Change Close Hour"></v-btn>
    </v-row>
  </v-form>
  <br /><br />
  <v-form validate-on="submit lazy" @submit.prevent="updateRules">
    <v-row class="mx-auto" style="width: 50%">
      <div class="pure-control-group">
        <h3>Requirements: Check the requirements your pantry has:</h3>
        <input type="checkbox" id="vehicle1" name="vehicle1" value="annual_income_max" />
        <label for="vehicle1"> Annual Income Max:</label> Input Amount <input type="text" id="vehicle1input" class="dark-outline" v-model="rules.annualIncome" /><br />
        <input type="checkbox" id="vehicle2" name="vehicle2" value="snap_benefits" v-model="rules.snapRequired" />
        <label for="vehicle2">Snap Benefits Required</label><br />
      </div>
      <v-btn type="submit" block class="mt-0 mb-0" text="Change"></v-btn>
    </v-row>
  </v-form>
</template>
<style scoped>
.dark-outline {
  border: 1px solid #333; /* Dark grey border */
  padding: 5px; /* Adjust padding as needed */
}
</style>
