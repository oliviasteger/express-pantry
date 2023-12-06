<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
const { updateSession } = useUserStore();
const location = ref("");
const name = ref("");
const openHour = ref("");
const closeHour = ref("");
const pickupWindowLength = ref("");
const ordersPerWindow = ref("");
const rules = ref("");
const cities = ref([]);
const hoursOptions = Array.from({ length: 24 }, (_, index) => String(index + 1));
const username = ref("");
const password = ref("");

async function getCities() {
  const response = await fetch("https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/us-cities-demographics/records?group_by=city&limit=3000");
  const data = await response.json();

  cities.value = data.results.map((record: { city: any }) => record.city); // Extracting city names

  return cities;
}

const registerPantry = async () => {
  console.log("GOT HERE");
  await fetchy("/api/users", "POST", {
    body: {
      username: username.value,
      password: password.value,
      type: "Administrator",
    },
  });

  await fetchy("/api/login", "POST", {
    body: {
      username: username.value,
      password: password.value,
    },
  });

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

  //emit event to say registered event is submitted
  void updateSession();
  //void router.push({ name: "Home" });
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
        <label for="aligned-name">Username</label>
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>
      <div class="pure-control-group">
        <label for="aligned-password">Password</label>
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>
      <div class="pure-control-group">
        <label for="aligned-location">City of Pantry</label>
        <select v-model="location" id="aligned-location" required>
          <option value="" disabled>Select City</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
      </div>

      <div class="pure-control-group">
        <label for="aligned-openHour">Name of Food Pantry</label>
        <input v-model.trim="name" type="text" id="aligned-name" placeholder="name" required />
      </div>

      <div class="pure-control-group">
        <label for="aligned-openHour">Hour That Food Pantry Opens</label>
        <select v-model="openHour" id="aligned-openHour" required>
          <option value="" disabled>Select Hour</option>
          <option v-for="hour in hoursOptions" :key="hour" :value="hour">{{ hour }}</option>
        </select>
      </div>

      <div class="pure-control-group">
        <!-- <v-date-picker v-model="openHour" @input="dateMenu = false" :min="currentDate" :show-current="true"></v-date-picker> -->

        <label for="aligned-closeHour">Hour That Food Pantry Closes</label>
        <select v-model="closeHour" id="aligned-closeHour" required>
          <option value="" disabled>Select Hour</option>
          <option v-for="hour in hoursOptions" :key="hour" :value="hour">{{ hour }}</option>
        </select>
      </div>

      <div class="pure-control-group">
        <label for="aligned-pickupWindowLength">Length of Pickup Slots (in minutes)</label>
        <input v-model.trim="pickupWindowLength" type="text" id="aligned-pickupWindowLength" placeholder="pickup Length" required />
      </div>

      <div class="pure-control-group">
        <label for="aligned-ordersPerWindow">Number of Orders Per Pickup Window</label>
        <input v-model.trim="ordersPerWindow" type="text" id="aligned-ordersPerWindow" placeholder="orders Per Window" required />
      </div>

      <div class="pure-control-group">
        <label for="aligned-rules">Annual Income Max (optional)</label>
        <input v-model.trim="rules" type="text" id="aligned-rules" placeholder="rules" />
      </div>

      <br />
      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">Register</button>
      </div>
    </fieldset>
  </form>
</template>
