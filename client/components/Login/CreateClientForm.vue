<script setup lang="ts">
import { onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const cities = ref([]);
const username = ref("");
const password = ref("");
const information = ref({
  annualIncome: "",
  snapEligible: false,
  city: "",
});
async function getCities() {
  const response = await fetch("https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/us-cities-demographics/records?group_by=city&limit=3000");
  const data = await response.json();

  cities.value = data.results.map((record: { city: any }) => record.city); // Extracting city names

  return cities;
}

onMounted(async () => {
  await getCities(); // Fetch cities when the component is mounted
});

async function userRegister() {
  await fetchy("/api/users", "POST", {
    body: {
      username: username.value,
      password: password.value,
      UserType: "Client",
      information: information.value,
    },
  });
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="userRegister">
    <h3>Register Client</h3>
    <fieldset>
      <div class="pure-control-group">
        <label for="aligned-name">Username</label>
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>
      <div class="pure-control-group">
        <label for="aligned-password">Password</label>
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>

      <div class="pure-control-group">
        <label for="aligned-location">Choose the city You Live In</label>
        <select v-model="information.city" id="aligned-location" required>
          <option value="" disabled>Select City</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
      </div>

      <div class="pure-control-group">
        <label for="aligned-rules">Input your Annual Income</label>
        <input v-model.trim="information.annualIncome" type="text" id="aligned-rules" placeholder="income" required />
      </div>

      <div class="pure-control-group">
        <label for="aligned-snapEligible">Do you have snap benefits?</label>
        <select v-model="information.snapEligible" id="aligned-snapEligible" required>
          <option value="" disabled>Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <br />
      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">Register</button>
      </div>
    </fieldset>
  </form>
</template>
