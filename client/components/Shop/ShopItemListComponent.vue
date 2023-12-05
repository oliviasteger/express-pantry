Set up express pantry


<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";

const selectedCity = ref("");
const name = ref("");
const profiles = ref();
const openHours = ref("");
const closeHours = ref("");
const rules = ref("");
const { currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["shop"]);
const emit = defineEmits(["openShop", "refreshPantryList"]);



"/users/:username/items"
const setUpShop = async () => {
  try {
    const results = await fetchy(`api/profiles/location/${selectedCity.value}`, "GET");
    profiles.value  = results;
  } catch {
    return;
  }
};
async function getCurrentCity() {
  let user;
  try {
    user = await fetchy(`api/users/${currentUsername.value}`, "GET");
  } catch (_) {
    console.log("failed")
    return;
  }
  
  selectedCity.value = user.information.city;
}
onBeforeMount(async () => {
    await getCurrentCity(); 
});
</script>

<!-- <template>
  <div class="title">Profile: {{ name }}</div>
  <div class="pure-control-group">City Location: {{ city }}</div>
  <div class="pure-control-group">Open Hours: {{ openHours }} to {{ closeHours }}</div>
  <div class="pure-control-group">Requirements: Maximum Annual Income: {{ rules }}</div>
</template> -->
<template>
    <div class="list-title">Food Pantries Located in {{ selectedCity }}</div>
    <div class="list-container" v-if = "profiles.length !== 0">
        <button class="profile-button" v-for="profile,index in profiles" :key="profile._id" @click="emit('openShop', profile._id)">
            <h3>{{ profile.name }}</h3>
        </button>
        
    </div>
  
</template>
<style scoped>


.profile-button {
  text-align: center;
  padding: 8px 16px;
  background-color: transparent;
  color: #007bff;
  border: 2px solid #007bff;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.3s ease-in-out,
    color 0.3s ease-in-out;
}

.profile-button:hover {
  background-color: #007bff;
  color: #fff;
}
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}

.list-title {
  font-size: 1.5em;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

/* Add more styling as needed */
</style>
