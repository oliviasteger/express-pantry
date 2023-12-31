<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
const { loginUser, updateSession, updateType } = useUserStore();
const cities = ref([]);
const username = ref("");
const password = ref("");
const information = ref({
  annualIncome: "",
  isSnapEligible: false,
  city: "",
});
const snapEligible = ref("");
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
  information.value.isSnapEligible = snapEligible.value === "true";
  await fetchy("/api/users", "POST", {
    body: {
      username: username.value,
      password: password.value,
      type: "Client",
      information: JSON.stringify(information.value),
    },
  });

  await fetchy("/api/login", "POST", {
    body: {
      username: username.value,
      password: password.value,
    },
  });
  void updateSession();
  void updateType();
  await router.push({ name: "Home" });
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
        <select v-model="snapEligible" id="aligned-snapEligible" required>
          <option value="" disabled>Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      <br />
      <v-btn block class="mb-8" color="primary" size="large" variant="tonal" type="submit"> Register </v-btn>
    </fieldset>
  </form>
</template>
