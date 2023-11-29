<script setup lang="ts">
import { onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const location = ref("");
const name = ref("");
const openHour = ref("");
const closeHour = ref("");
const pickupWindowLength = ref("");
const ordersPerWindow = ref("");
const rules = ref("");
const cities = ref([]);

async function getCities() {
  const response = await fetch("https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/us-cities-demographics/records?group_by=city&limit=3000");
  const data = await response.json();
  console.log("HERE", data);

  cities.value = data.results.map((record) => record.city); // Extracting city names

  return cities;
}

const registerPantry = async () => {
  await fetchy("/api/profiles", "POST", {
    body: {
      location: location.value,
      name: name.value,
      openHour: openHour.value,
      closeHour: closeHour.value,
      pickupWindowLength: pickupWindowLength.value,
      ordersPerWindow: ordersPerWindow.value,
      rules: rules.value,
    },
  });
};

onMounted(async () => {
  await getCities(); // Fetch cities when the component is mounted
});
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="registerPantry">
    <h3>Register Pantry</h3>
    <fieldset>
      <div class="pure-control-group">
        <label for="aligned-location">City of Pantry</label>
        <select v-model="location" id="aligned-location" required>
          <option value="" disabled>Select City</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
      </div>

      <br />
      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">Register</button>
      </div>
    </fieldset>
  </form>
</template>
